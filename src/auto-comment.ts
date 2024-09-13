import {input, select} from "@inquirer/prompts";
import {getProfiles, getRandomComment} from "./lib";
import {chromeLaunch} from "./launcher";
import delay from "delay";
import fileSelector from 'inquirer-file-selector'
import * as os from "os";
import fs from "fs";

export default async function () {
    const linkPost = await input({
        message: 'Masukkan link postingan: ',
    });

    const askForComment = async () => await input({
        message: 'Masukkan isi komentar',
    });

    const askForFileComment = async () => await fileSelector({
        message: 'Pilih file komentar:',
        basePath: os.homedir(),
        match: file => !file.isDir && file.name.includes('.txt')
    });

    const commentOrFile = await select({
        message: 'Pilih sumber komentar',
        choices: [
            {name: 'Manual (1 Komentar)', value: askForComment},
            {name: 'Dari file .txt', value: askForFileComment}
        ]
    })

    const _comment = await commentOrFile();
    const profiles = getProfiles();

    for (const profile of profiles) {
        let comment: string;
        if (fs.existsSync(_comment)) {
            comment = await getRandomComment(_comment);
        } else {
            comment = _comment;
        }

        console.log(`Memanggil chrome profil ${profile.name}...`)
        const browser = await chromeLaunch(profile.fullpath);
        const [page] = await browser.pages();
        console.log(`Memanggil chrome profil ${profile.name}... berhasil`)

        console.log(`Membuka link postingan...`)
        await page.goto(linkPost, {waitUntil: 'networkidle0'});
        console.log(`Membuka link postingan... berhasil`)
        await delay(1500)

        if (await page.$('#login_popup_cta_form') !== null) {
            console.log(`Akun facebook untuk profile ${profile.name} telah logout/cookie hilang`)
            await browser.close();
            await delay(5500);
            continue;
        }

        try {
            const commentInput = await page.waitForSelector('div[data-lexical-editor="true"][role="textbox"][spellcheck="true"]');

            await commentInput?.tap();
            await commentInput?.focus();
            await commentInput?.type(comment, {delay: 150});

            await delay(1500);
            await commentInput?.press('Enter');
            await commentInput?.dispose();
        } catch (e: any) {
            console.error(`Gagal memberikan komentar pada profil \`${profile}\``, `\`${e.message}\``)
        }

        await delay(5500);
        await browser.close();
        await delay(5500);
        console.log(`Profil ${profile.name} selesai...`)
    }
};

