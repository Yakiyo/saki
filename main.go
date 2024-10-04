package main

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"os/signal"

	"github.com/disgoorg/disgo"
	"github.com/disgoorg/disgo/bot"
	"github.com/disgoorg/disgo/discord"
	"github.com/disgoorg/disgo/gateway"
	"github.com/disgoorg/snowflake/v2"
	_ "github.com/joho/godotenv/autoload"
)

func main() {

	token := os.Getenv("TOKEN")
	if token == "" {
		slog.Error("Missing required env valoe TOKEN")
		return
	}

	client, err := disgo.New(token,
		bot.WithGatewayConfigOpts(
			gateway.WithIntents(
				gateway.IntentGuilds,
				gateway.IntentGuildMessages,
				gateway.IntentGuildMessageReactions,
				gateway.IntentMessageContent,
				gateway.IntentDirectMessages,
			),
			gateway.WithPresenceOpts(
				gateway.WithOnlineStatus(discord.OnlineStatusOnline),
				gateway.WithListeningActivity("Lofi Music"),
			),
		),
		bot.WithEventListenerFunc(interactionHandler),
		bot.WithEventListenerFunc(messageHandler))

	if err != nil {
		slog.Error("Error when creating client", slog.Any("err", err))
		return
	}
	slog.Info("bot id", slog.Any("id", client.ID()))
	if _, err := client.Rest().SetGuildCommands(snowflake.GetEnv("BOT_ID"), snowflake.GetEnv("GUILD_ID"), commands); err != nil {
		slog.Error("Error when deploying guild commands", slog.Any("err", err))
		return
	}

	if err := client.OpenGateway(context.TODO()); err != nil {
		slog.Error("Failed to open gateway connection", slog.Any("err", err))
		return
	}

	fmt.Println("Starting bot...")
	slog.Info("bot id", slog.Any("id", client.ID()))
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)
	<-stop
	fmt.Println("Shutting down...")
}
