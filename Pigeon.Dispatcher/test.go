package main

import (
	"fmt"
	"log"

	expo "github.com/mijara/exponent-server-sdk-golang/sdk"
)

func main() {
	client := expo.NewPushClient(nil)

	// Create a new push message
	message := expo.PushMessage{
		To:    "ExponentPushToken[b80zXpNcJ6aiC0Nuqd4xI4]", // Replace with a valid Expo push token
		Body:  "Hello, this is a test notification!",
		Title: "Test Notification",
	}

	// Send the push notification
	response, err := client.Publish(&message)
	if err != nil {
		log.Fatalf("Error sending notification: %v", err)
	}
	fmt.Printf("Response: %v\n", response)
}
