package main

import (
	_ "github.com/charmbracelet/log"
	"github.com/bwmarrin/discordgo"
)

func initHandlers() {
	client.AddHandlerOnce(func(s *discordgo.Session, r *discordgo.Ready) {
		
	})
}