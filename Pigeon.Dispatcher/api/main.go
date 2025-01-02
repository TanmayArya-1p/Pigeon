package api

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"Pigeon.Dispatcher/handlers"
	"Pigeon.Dispatcher/models"
	rd "Pigeon.Dispatcher/rd"
	"github.com/google/uuid"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/redis/go-redis/v9"
)

func authMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		secret_rec := r.Header.Get("Authorization")
		if secret_rec != os.Getenv("AUTH_SECRET") {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		next(w, r)
	}
}

func PushMessageValidationMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "POST" {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}
		var order models.Dispatch
		if err := json.NewDecoder(r.Body).Decode(&order); err != nil {
			http.Error(w, "Bad Request: Invalid JSON", http.StatusBadRequest)
			return
		}
		if err := order.Validate(); err != nil {
			http.Error(w, "Bad Request: "+err.Error(), http.StatusBadRequest)
			return
		}
		ctx := context.WithValue(r.Context(), "order", order)
		r = r.WithContext(ctx)

		next(w, r)
	}
}

var middlewares = []func(http.HandlerFunc) http.HandlerFunc{PushMessageValidationMiddleware, authMiddleware}
var client *redis.Client

func dispatchHTTPHandler(w http.ResponseWriter, r *http.Request) {
	order, ok := r.Context().Value("order").(models.Dispatch)
	if !ok {
		http.Error(w, "Internal Server Error: Invalid order type", http.StatusInternalServerError)
		return
	}
	rd.PushOrder(client, order)
	fmt.Fprintln(w, "Order pushed successfully")
}

func ping(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Pong")
}

var worker chan bool
var running = false

func StartDispatcherHandler(w http.ResponseWriter, r *http.Request) {
	if running {
		http.Error(w, "Worker Already Running", http.StatusConflict)
		return
	}

	interval := 30
	if r.Method != "GET" {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	running = true
	if r.URL.Query().Get("interval") != "" {
		fmt.Sscanf(r.URL.Query().Get("interval"), "%d", &interval)
	}
	worker = handlers.StartDispatchWorker(client, interval)
	fmt.Fprintln(w, "Dispatch Worker Started", interval)
}

func StopDispatcherHandler(w http.ResponseWriter, r *http.Request) {
	if !running {
		http.Error(w, "Worker Not Running", http.StatusConflict)
		return
	}
	handlers.StopDispatchWorker(worker)
	running = false
	fmt.Fprintln(w, "Dispatch Worker Terminated")
}

type DispatcherStatus struct {
	Running        bool `json:"running"`
	Pending        int  `json:"pending"`
	Served         int  `json:"served"`
	Deleted_Tokens int  `json:"deleted_tokens"`
}

func (DispatcherStatus) fetchMetrics() (DispatcherStatus, error) {
	resp, err := http.Get("http://localhost:" + os.Getenv("DISPATCHER_PORT") + "/metrics")
	if err != nil {
		return DispatcherStatus{}, err
	}
	defer resp.Body.Close()
	scanner := bufio.NewScanner(resp.Body)
	status := DispatcherStatus{}
	status.Running = running
	for scanner.Scan() {
		line := scanner.Text()
		if strings.HasPrefix(line, "pigeon_dispatcher_deleted_user_tokens") {
			parts := strings.Fields(line)
			if len(parts) == 2 {
				status.Deleted_Tokens, _ = strconv.Atoi(parts[1])
			}
		} else if strings.HasPrefix(line, "pigeon_dispatcher_dispatched_notifications") {
			parts := strings.Fields(line)
			if len(parts) == 2 {
				status.Served, _ = strconv.Atoi(parts[1])
			}
		} else if strings.HasPrefix(line, "pigeon_dispatcher_pending_orders") {
			parts := strings.Fields(line)
			if len(parts) == 2 {
				status.Pending, _ = strconv.Atoi(parts[1])
			}
		}
	}
	if err := scanner.Err(); err != nil {
		return DispatcherStatus{}, err
	}

	return status, nil
}

func StatusDispatcherHandler(w http.ResponseWriter, r *http.Request) {
	status := DispatcherStatus{}
	stat, err := status.fetchMetrics()
	if err != nil {
		http.Error(w, "Failed to fetch metrics: "+err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(stat)
}

func CampaignDispatchHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}
	var callbackURL = r.URL.Query().Get("callback")
	var order models.CampaignDispatch
	if err := json.NewDecoder(r.Body).Decode(&order); err != nil {
		http.Error(w, "Bad Request: Invalid JSON", http.StatusBadRequest)
		return
	}
	if err := order.Validate(); err != nil {
		http.Error(w, "Bad Request: "+err.Error(), http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	trackerID := uuid.New().String()
	json.NewEncoder(w).Encode(map[string]string{"message": "Order Being Processed", "tracker_id": trackerID})
	go func() {
		for _, i := range order.To {
			dispatch := models.Dispatch{
				ScheduledAt: order.ScheduledAt,
				Message:     order.Message,
			}
			dispatch.Message.To = i
			rd.PushOrder(client, dispatch)
		}
		if callbackURL != "" {
			clt := http.Client{
				Timeout: 5 * time.Second,
			}
			req, _ := http.NewRequest("POST", callbackURL, strings.NewReader(fmt.Sprintf(`{"tracker_id": "%s"}`, trackerID)))
			req.Header.Set("Content-Type", "application/json")
			resp, err := clt.Do(req)
			if err != nil {
				fmt.Println("Failed to send callback:", err)
				return
			}
			defer resp.Body.Close()
			if resp.StatusCode != http.StatusOK {
				fmt.Println("Callback returned non-OK status:", resp.Status)
			}
		}
	}()
}

func ServeAPI() {
	client = rd.Connect()
	defer client.Close()
	h := dispatchHTTPHandler
	for _, middleware := range middlewares {
		h = middleware(h)
	}
	http.HandleFunc("/dispatch", h)
	http.HandleFunc("/pingAuth", authMiddleware(ping))
	http.HandleFunc("/ping", ping)
	http.HandleFunc("/start", authMiddleware(StartDispatcherHandler))
	http.HandleFunc("/stop", authMiddleware(StopDispatcherHandler))
	http.HandleFunc("/status", StatusDispatcherHandler)
	http.Handle("/metrics", promhttp.Handler())
	http.ListenAndServe(":"+os.Getenv("DISPATCHER_PORT"), nil)
}

// func main() {
// 	godotenv.Load()
// 	ServeAPI()
// }
