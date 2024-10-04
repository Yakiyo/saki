package main

import (
	"log/slog"
	"strings"

	"github.com/disgoorg/disgo/discord"
	"github.com/disgoorg/disgo/events"
)

var commands = []discord.ApplicationCommandCreate{
	discord.SlashCommandCreate{
		Name:        "echo",
		Description: "says what you say",
		Options: []discord.ApplicationCommandOption{
			discord.ApplicationCommandOptionString{
				Name:        "message",
				Description: "What to say",
				Required:    true,
			},
			discord.ApplicationCommandOptionBool{
				Name:        "ephemeral",
				Description: "If the response should only be visible to you",
				Required:    true,
			},
		},
	},
}

func interactionHandler(event *events.ApplicationCommandInteractionCreate) {
	data := event.SlashCommandInteractionData()

	switch data.CommandName() {
	case "echo":
		{
			err := event.CreateMessage(discord.NewMessageCreateBuilder().
				SetContent(data.String("message")).
				SetEphemeral(data.Bool("ephemeral")).
				Build(),
			)

			if err != nil {
				slog.Error("error on sending response", slog.Any("err", err))
			}
		}
	default:
		panic("Nani kore???")

	}

}

func messageHandler(event *events.MessageCreate) {
	message := event.Message

	// return early for bot messages and non prefixed messages
	if message.Author.Bot || !strings.HasPrefix(message.Content, "!") {
		return
	}

	msgArr := strings.Split(message.Content[1:], " ")

	command := msgArr[0]

	switch command {
	case "echo":
		{
			content := strings.Join(msgArr[1:], " ")
			event.Client().Rest().CreateMessage(
				message.ChannelID,
				discord.
					NewMessageCreateBuilder().
					SetContent(content).
					Build(),
			)
		}

	}
}
