package models

import expo "github.com/oliveroneill/exponent-server-sdk-golang/sdk"

type Dispatch struct {
	ScheduledAt int64            `json:"scheduled_at"`
	Message     expo.PushMessage `json:"message"`
}
