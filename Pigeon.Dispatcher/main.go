package main

import (
	api "Pigeon.Dispatcher/api"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	api.ServeAPI()
}
