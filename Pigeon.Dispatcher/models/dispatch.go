package models

import (
	"errors"
	"strings"

	expo "github.com/mijara/exponent-server-sdk-golang/sdk"
)

type Dispatch struct {
	ScheduledAt int64            `json:"scheduled_at"`
	Message     expo.PushMessage `json:"message"`
}

func exponentTokenValidator(etok expo.ExponentPushToken) bool {
	tok := string(etok)
	if !strings.HasPrefix(tok, "ExponentPushToken[") {
		return false
	}
	if !strings.HasSuffix(tok, "]") {
		return false
	}
	return true
}

func exponentPushMessageValidator(pm expo.PushMessage) bool {
	if pm.Title == "" {
		return false
	}
	if pm.Body == "" {
		return false
	}
	if len(pm.Data) == 0 {
		return false
	}
	return true
}

func (d *Dispatch) Validate() error {
	if d.ScheduledAt <= 0 {
		return errors.New("scheduled_at must be a positive integer")
	}
	if (!exponentTokenValidator(d.Message.To)) || len(d.Message.To) == 0 {
		return errors.New("Invalid ExponentPushToken")
	}
	if !exponentPushMessageValidator(d.Message) {
		return errors.New("Invalid ExponentPushMessage")
	}
	return nil
}
