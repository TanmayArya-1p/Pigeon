package api

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"Pigeon.Dispatcher/handlers"
	"Pigeon.Dispatcher/models"
	rd "Pigeon.Dispatcher/rd"
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
	Running bool `json:"running"`
	Pending int  `json:"pending"`
	Served  int  `json:"served"`
}

func StatusDispatcherHandler(w http.ResponseWriter, r *http.Request) {
	if running {
		fmt.Fprintln(w, "Worker Running")
	} else {
		fmt.Fprintln(w, "Worker Not Running")
	}
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
	http.Handle("/metrics", promhttp.Handler())
	http.ListenAndServe(":8000", nil)
}

// func main() {
// 	godotenv.Load()
// 	ServeAPI()
// }
