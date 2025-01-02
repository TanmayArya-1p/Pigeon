package models

import (
	"errors"

	expo "github.com/mijara/exponent-server-sdk-golang/sdk"
)

type CampaignDispatch struct {
	ScheduledAt int64                    `json:"scheduled_at"`
	To          []expo.ExponentPushToken `json:"to"`
	Message     expo.PushMessage         `json:"message"`
}

func (d *CampaignDispatch) Validate() error {
	if d.ScheduledAt <= 0 {
		return errors.New("scheduled_at must be a positive integer")
	}
	for _, token := range d.To {
		if (!exponentTokenValidator(token)) || len(token) == 0 {
			return errors.New("Invalid ExponentPushToken")
		}
	}
	if !exponentPushMessageValidator(d.Message) {
		return errors.New("Invalid ExponentPushMessage")
	}
	return nil
}
