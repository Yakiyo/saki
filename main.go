package main

import (
	"fmt"
	"os"
	"os/signal"

	"github.com/bwmarrin/discordgo"
	_ "github.com/joho/godotenv/autoload"
)

func main() {

	token := os.Getenv("TOKEN")
	if token == "" {
		fmt.Println("Missing required env value TOKEN")
		return
	}

	client, _ := discordgo.New("Bot " + token)

	if err := client.Open(); err != nil {
		fmt.Println("Failed to open connection", err)
		return
	}

	defer client.Close()
	fmt.Println("Starting bot...")

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)
	<-stop
	fmt.Println("Graceful shutdown")
}
