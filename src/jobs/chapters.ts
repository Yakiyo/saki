import fetch from "node-fetch";
import { shorten } from "../util";

(async () => {
    const v = await fetch("https://cclawtranslations.home.blog/feed/")
    .then(v => v.text())
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
    const titles = v.split("<title>");
    const links = v.split("<link>");
    console.log(shorten(titles[3], 200)?.split('</title>')[0])
    console.log(shorten(links[3], 200)?.split('</link>')[0]);
    // for (let i = 0; i < titles.length; i++) {}
})()