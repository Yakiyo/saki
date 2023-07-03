# <p align="center">Saki</p>

<div align="center"><a href="https://discord.gg/WQspAHcJHB"><img alt="Discord" src="https://img.shields.io/discord/803177741943439360?color=blue&label=Discord&logo=discord&logoColor=white&style=plastic"></a> <a href="https://www.reddit.com/r/GimaiSeikatsu/"><img alt="Subreddit subscribers" src="https://img.shields.io/reddit/subreddit-subscribers/GimaiSeikatsu?color=orange&label=r%2FGimaiSeikatsu&logo=reddit&logoColor=orange&style=plastic"></a> <a href="./.github/workflows/ci.yml"><img src="https://github.com/Yakiyo/saki/actions/workflows/ci.yml/badge.svg"></a></div>
<div align="center">
<a href="https://gitpod.io/from-referrer/"><img src="https://raw.githubusercontent.com/Yakiyo/Yume-Bot/master/src/assets/logos/gitpod.svg" alt="Open on gitpod https://gitpod.io/from-referrer/"></a>
</div>

This repository contains the source code for the custom bot for the Gimai Seikatsu [Discord Server](https://discord.gg/WQspAHcJHB). This is a Typescript port of the original bots written in Java by [Look](https://github.com/Muril-o).

The bot is fully based on slash commands. For a complete list of commands, use `/help` command.

The bot isn't available publicly to other servers. You can see the hosted one in the Gimai Seikatsu Discord server or [self host](#self-hosting) it.

## Links
**Discord:** https://discord.gg/WQspAHcJHB \
**Subreddit:** [r/GimaiSeikatsu](https://reddit.com/r/GimaiSeikatsu) \
**Fandom:** [Gimai Seikatsu Fandom](https://gimai-seikatsu.fandom.com/wiki/Gimai_Seikatsu_Wiki)

## Bot Information
**Language:** [Typescript](https://www.typescriptlang.org/) \
**Library:** [Discord.js V14](https://discord.js.org)

## Contribution 

For new feature requests, you can make an issue and i'll see what can be done.

1) [Fork it](https://github.com/Yakiyo/saki/fork)
2) Create new branch `git checkout -b my-new-feature`
3) Commit changes `git commit -m "Add cool feature"`
3) Push changes to it `git push <remote> <branch>`
4) Create a [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)

Any and all contributions are welcome. Please make sure you're code passes the CI. ✌

## Self-Hosting
It is pretty easy to self host the bot. It should take around 5-10 minutes to do it if you know what you're doing.

Requirements:

- [Nodejs](https://nodejs.org) version 16.9.0 or higher
- A Discord [Bot application](https://discordjs.guide/preparations/setting-up-a-bot-application.html)
- A [mongodb](https://www.mongodb.com/) instance with replica set. The free tier on [Mongodb Atlas](https://www.mongodb.com/atlas) will work fine.
- A Twitter [bearer token](https://developer.twitter.com/en/docs/authentication/oauth-2-0/bearer-tokens)
- A Youtube [api-key](https://developers.google.com/youtube/registering_an_application)

First clone the repostiory with [git](https://git-scm.com/).
```bash
$ git clone https://github.com/Yakiyo/saki
```
Then create a file named `.env` and populate it like the following
```env
DISCORD_TOKEN=<Bot token goes here>
DATABASE_URL=<Mongodb URI>
DEPLOY=<Set this to TRUE for registering slash commands on startup>
NODE_ENV=<production|dev>
YOUTUBE_API_KEY=<Youtube api key>
YOUTUBE_COOKIE=<Youtube cookie keys>
```
If you are deploying in production, do set the `NODE_ENV` to `production`. On dev it logs errors to console and other helpful stuff which are usually not needed in production. Once you are done with the env file, install packages and seed the database. Seeding is required as some of the code expect the bare minimum data to be there in the database.
```bash
$ npm install
# then seed it
$ npm run prs:seed
```
You can modify the basic data to be seeded by editing the [seed script](./scripts/seed.ts).
Finally edit the [`config`](./config.json) file with your configuration. 
If you havent already, deploy the bot's slash commands for them to show up in your server.
```bash
$ npm run deploy
```
Or set the `.env` files `DEPLOY` variable to `TRUE`

Now run the bot.
```bash
$ npm run start
```
For any queries or problems, feel free to open an [issue](https://github.com/Yakiyo/saki/issues/new/choose). I'll be happy to help.
## Author
**Saki** © [Yakiyo](https://github.com/Yakiyo). Authored and maintained by Yakiyo & [Look](https://github.com/Muril-o).

Released under [MIT License](https://opensource.org/licenses/MIT).
