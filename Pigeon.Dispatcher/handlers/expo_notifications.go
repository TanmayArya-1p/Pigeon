package handlers

import (
	"fmt"

	expo "github.com/mijara/exponent-server-sdk-golang/sdk"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	deletedUsers = promauto.NewCounter(prometheus.CounterOpts{
		Name: "pigeon_dispatcher_deleted_user_tokens",
		Help: "The total number of expired user tokens encountered",
	})
	dispatchedNotifications = promauto.NewCounter(prometheus.CounterOpts{
		Name: "pigeon_dispatcher_dispatched_notifications",
		Help: "The total number of notifications dispatched",
	})
)

// TODO: PROMETHEUS TRACKER DELETED USERS
// TODO: PROMETHEUS TRACK DISPATCHED NOTIFICATIONS

func Connect() *expo.PushClient {
	client := expo.NewPushClient(nil)
	return client
}

type NotificationResponse struct {
	Response  *expo.PushResponse
	isExpired bool
	ExpoToken expo.ExponentPushToken
}

func SendNotification(client *expo.PushClient, message expo.PushMessage) NotificationResponse {
	response, _ := client.Publish(&message)
	if response.Status == "error" {
		fmt.Printf("Error sending notification\n")
		deletedUsers.Inc()
		return NotificationResponse{Response: nil, isExpired: true, ExpoToken: message.To}
	}
	dispatchedNotifications.Inc()
	return NotificationResponse{Response: &response, isExpired: false, ExpoToken: message.To}
}
