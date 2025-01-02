package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/joho/godotenv"

	"Pigeon.Dispatcher/models"
	rd "Pigeon.Dispatcher/rd"
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

	http.ListenAndServe(":8000", nil)
}

func main() {
	godotenv.Load()
	ServeAPI()
}
