import path from "path";
import {checkbox} from '@inquirer/prompts';
import fs from "fs";
import {selectRandom, TWEETS_DIR} from "../helpers/lib.ts";
import launcher from "../actions/launcher.ts";
import delay from "delay";
import Profile from "../../models/profile.ts";
import chalk from "chalk";

const X_HOME = `https://x.com/home`;

const remapFiles = (file: string) => ({name: file, value: path.join(TWEETS_DIR, file)})

export default async function () {
    const tweetFiles: string[] = fs.readdirSync(TWEETS_DIR).filter((file) => fs.statSync(path.join(TWEETS_DIR, file)).isFile());
    if (tweetFiles.length === 0) {
        console.log(chalk.red(`Tidak ada file tweet yang tersedia, buat dulu file nya di folder tweets/ bannnng`))
        return;
    }
    const files = await checkbox({
        message: 'Pilih file tweet',
        choices: tweetFiles.map(remapFiles).filter(file => file.value.includes('.txt')),
        required: true,
    });

    const profiles = await Profile.findAll({where: {twitter: true}});
    if (profiles.length === 0) {
        console.log(chalk.red(`Tidak ada chrome yang memiliki akun Twitter`))
        return;
    }

    for (const profile of profiles) {
        try {
            const fileComment = selectRandom(files)
            let tweet = fs.readFileSync(fileComment, {encoding: 'utf-8'});
            if (tweet.length > 280) {
                console.log(chalk.yellow(`Tweet terlalu panjang. Diambil sebagian...`))
            }
            tweet = tweet.slice(0, 280);
            console.log(`Memanggil chrome profil ${profile.name}...\r`)
            const browser = await launcher(profile.fullpath, true);
            const [page] = await browser.pages();
            console.log(`Memanggil chrome profil ${profile.name}... berhasil\n`)

            console.log(`Membuka twitter...\r`)
            await page.goto(X_HOME, {waitUntil: 'domcontentloaded'});
            await delay(1500)

            console.log(`Membuka twitter... berhasil\n`);
            await delay(3500)
            console.log(`Membuat tweet baru`)

            await page.keyboard.press('n')
            const textArea = await page.waitForSelector('div[aria-labelledby="modal-header"][aria-modal="true"][role="dialog"]', {visible: true})

            if (textArea) {
                console.log(`Tweet form berhasil terbuka`)
                console.log(`Menulis Tweet...`)
                await textArea?.type(tweet, {delay: 100});
                console.log(`Menulis Tweet... berhasil`)
                console.log(`Mengirim...`)
                await page.keyboard.down('ControlLeft')
                await page.keyboard.press('Enter')
                await page.keyboard.up('ControlLeft')
                await delay(5000)
                console.log(`Mengirim... berhasil`)
            } else {
                console.error(`Terjadi kesalahan saat membuka form tweet`)
            }
        } catch (e: any) {
            console.error(e.message)
        }
    }
};