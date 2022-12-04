import { SlashCommandBuilder } from "discord.js";
import { type Command } from "../../struct/types";

const faqs = [
    {
        title: "Can you watch YouTube VN despite not reading the LN?",
        desc: "- Yes, you can. LN and VN have unrelated series progress and can be read/watched separately."
    },
    {
        title: "Is Gimai Seikatsu anime, manga, LN, or a game?",
        desc: "- Gimai Seikatsu as a series was originally a YouTube VN-style series with short videos which you can [check out here](https:\/\/bit.ly\/gimaiyoutube).\n- Later the Light Novel had its debut, currently there are 5 released volumes with the 6th coming on the 25th August 2022.\n- The manga adaptation was then announced and is available digitally on [ComicWalker](https:\/\/comic-walker.com\/contents\/detail\/KDCW_KS13202353010000_68).\n- Anime was then announced but we don't know its release date or animation studio yet."
    },
    {
        title: "Is there an official translation for the LN in English?",
        desc: "- Currently, there's no official translation available for Gimai Seikatsu in English. However, there's currently a Fan Translation for it by [CClaws Translations](https:\/\/discord.gg\/e4BJxX6)."
    },
    {
        title: "What is the release schedule of the YouTube videos?",
        desc: "- The episodes (in Japanese) are released every Sunday. However, English subs are are officially sent to them by [CClaws Translations](https:\/\/discord.gg\/e4BJxX6) every Sunday. And when the English subtitles are officially up, we make an announcement for the same, so make sure to grab the <@&808757223244300311> role if you want to know when the english subs are available for a new video."
    },
    {
        title: "Anime release date?",
        desc: "- Not yet. Make sure to grab the <@&1000722297302286376> role for updates regarding dates, key visuals and more."
    },
] as {
    title: string,
    desc: string
}[];


export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('faq')
        .setDescription('Display a specific faq')
        .addNumberOption(option =>
            option.setName("number")
                .setDescription("The Faq number to display")
                .setMinValue(1)
                .setMaxValue(5)
                .setRequired(true)),
    async execute(interaction) {
        const int = interaction.options.getNumber("number") as number;
        const faq = faqs[int - 1];
        interaction.reply({
            embeds: [{
                color: 16762880,
                author: {
                    name: "FAQ",
                    url: "https://discord.com/channels/803177741943439360/851109391427436615/851151111405568022",
                    icon_url: "https://cdn.discordapp.com/attachments/483063348792000513/808132429297876992/alert.png"
                },
                fields: [
                    {
                        name: `__${int}. ${faq.title}__`,
                        value: faq.desc
                    }
                ]
            }]
        });
    },
}