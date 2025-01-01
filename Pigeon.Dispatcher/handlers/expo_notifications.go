package handlers

import (
	"fmt"

	expo "github.com/mijara/exponent-server-sdk-golang/sdk"
)

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
	response, err := client.Publish(&message)
	if response.Status == "error" {
		fmt.Printf("Error sending notification: %v\n", err)
		return NotificationResponse{Response: nil, isExpired: true, ExpoToken: message.To}
	}
	return NotificationResponse{Response: &response, isExpired: false, ExpoToken: message.To}
}
