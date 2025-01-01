package redis

import (
	"context"
	"encoding/json"
	"log"
	"os"

	"Pigeon.Dispatcher/models"
	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
)

var ctx = context.Background()

func connect() *redis.Client {
	godotenv.Load()
	var client *redis.Client = redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_HOST"),
		Password: os.Getenv("REDIS_PASSWORD"),
		DB:       0,
		Protocol: 2,
	})
	val, _ := client.Get(ctx, "orders").Result()
	if len(val) == 0 {
		client.Set(ctx, "orders", "[]", 0)
	}
	return client
}

func close(client *redis.Client) {
	client.Close()
}

func fetchOrders(client *redis.Client) []models.Dispatch {
	val, _ := client.Get(ctx, "orders").Result()
	dispatches := make([]models.Dispatch, 0, 10)
	err := json.Unmarshal([]byte(val), &dispatches)
	if err != nil {
		log.Fatalf("Error unmarshalling JSON: %v", err)
	}
	return dispatches
}

func popOrder(client *redis.Client, ref_epoch int64) models.Dispatch {
	dispatches := fetchOrders(client)
	if len(dispatches) == 0 {
		return models.Dispatch{}
	}
	dispatch := dispatches[0]
	if ref_epoch >= dispatch.ScheduledAt {
		dispatches = dispatches[1:]
		val, _ := json.Marshal(dispatches)
		client.Set(ctx, "orders", val, 0)
		return dispatch
	} else {
		return models.Dispatch{}
	}
}

func pushOrder(client *redis.Client, dispatch models.Dispatch) []models.Dispatch {
	dispatches := fetchOrders(client)
	i := 0
	j := len(dispatches)
	for i < j {
		mid := (i + j) / 2
		if dispatches[mid].ScheduledAt < dispatch.ScheduledAt {
			i = mid + 1
		} else {
			j = mid
		}
	}
	dispatches = append(dispatches[:i], append([]models.Dispatch{dispatch}, dispatches[i:]...)...)
	val, _ := json.Marshal(dispatches)
	client.Set(ctx, "orders", val, 0)
	return dispatches
}

// func main() {
// 	client := connect()
// 	defer close(client)
// 	dispatch := popOrder(client)

// 	fmt.Printf("Dispatches: %v\n", dispatch)
// }
