package handlers

import (
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"Pigeon.Dispatcher/models"
	"Pigeon.Dispatcher/rd"
	"github.com/redis/go-redis/v9"
)

func StartDispatchWorker(client *redis.Client, interval int) chan bool {
	done := make(chan bool)
	go dispatchWorker(client, done, interval)
	return done
}

func StopDispatchWorker(done chan bool) {
	done <- true
}

func sendDeleteRequest(curr *models.Dispatch) bool {
	clt := http.Client{
		Timeout: 5 * time.Second,
	}
	req, _ := http.NewRequest("POST", os.Getenv("DELETE_TOKEN_WEBHOOK"), strings.NewReader(fmt.Sprintf(`{"TOKEN": "%s"}`, curr.Message.To)))
	req.Header.Set("Content-Type", "application/json")
	resp, err := clt.Do(req)
	if err != nil {
		return false
	}
	resp.Body.Close()
	return true
}

func dispatchWorker(client *redis.Client, done chan bool, interval int) {
	fmt.Println("Dispatch Worker Started")
	exp_client := Connect()
	for {
		select {
		case <-done:
			fmt.Println("Dispatch Worker Terminated")
			return
		default:
			curr, status := rd.PopOrder(client, time.Now().Unix())
			if status {
				noti_resp := SendNotification(exp_client, curr.Message)
				if noti_resp.isExpired {
					// clt := http.Client{
					// 	Timeout: 5 * time.Second,
					// }
					// req, _ := http.NewRequest("POST", os.Getenv("DELETE_TOKEN_WEBHOOK"), strings.NewReader(fmt.Sprintf(`{"TOKEN": "%s"}`, curr.Message.To)))
					// req.Header.Set("Content-Type", "application/json")
					// resp, _ := clt.Do(req)
					// resp.Body.Close()
					sendDeleteRequest(&curr)
					fmt.Printf("Possible Cause: Expo Token %s is expired\n", curr.Message.To)
				}
			}
			time.Sleep(time.Duration(interval) * time.Second)
		}
	}

}
