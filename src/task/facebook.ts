import {input, select} from "@inquirer/prompts";
import {doNotPanic, getRandomComment, userBasePath} from "../helpers/lib.ts";
import launcher from "../actions/launcher.ts";
import delay from "delay";
import fileSelector from 'inquirer-file-selector'
import * as fs from "fs";
import Profile from "../../models/profile.ts";
import chalk from "chalk";

export default async function () {
    const profiles = await Profile.findAll({where: {facebook: true}});

    if (profiles.length === 0) {
        console.log(chalk.red(`Tidak ada chrome yang memiliki akun Facebook`))
        return;
    }

    const linkPost = await input({
        message: 'Masukkan link postingan: ',
        validate: value => /^(https?:\/\/)?([\da-z.-]+\.)+[a-z]{2,}$/.test(value) || 'Link postingan harus valid',
    });

    const commentOrFile = await select({
        message: 'Pilih sumber komentar',
        choices: [
            {
                name: 'Manual (1 Komentar)', value: () => input({
                    message: 'Masukkan isi komentar',
                })
            },
            {
                name: 'Dari file .txt', value: () => fileSelector({
                    message: 'Pilih file komentar:',
                    basePath: userBasePath(),
                    match: file => !file.isDir && file.name.includes('.txt')
                })
            }
        ]
    })
    const _comment = await commentOrFile();

    for (const profile of profiles) {
        console.log(chalk.yellow(`Membuka profile chrome ${profile.name}... `))
        const browser = await launcher(profile.fullpath, true);
        const [page] = await browser.pages();
        console.log(chalk.cyan(`Membuka profile chrome ${profile.name}... Berhasil`))

        let comment: string;
        if (fs.existsSync(_comment)) {
            comment = await getRandomComment(_comment);
        } else {
            comment = _comment;
        }

        console.log(chalk.yellow(`Membuka link postingan...`))
        const response = await page.goto(linkPost, {waitUntil: 'networkidle0'}).catch(doNotPanic);
        if (response?.status() !== 200) {
            console.error(`Gagal membuka link postingan pada profil \`${profile}\``)
            await browser.close();
            await delay(5500);
            continue;
        } else {
            console.log(chalk.cyan(`Membuka link postingan... Berhasil`))
        }

        if (await page.$('#login_popup_cta_form') !== null || page.url().includes('checkpoint')) {
            console.log(`Akun facebook untuk profile ${profile.name} telah logout/cookie hilang`)
            await browser.close();
            await delay(5500);
            continue;
        }

        const commentInput = await page.$('div[data-lexical-editor="true"][role="textbox"][spellcheck="true"]').catch(doNotPanic);
        await commentInput?.tap();
        await commentInput?.focus();
        await commentInput?.type(comment, {delay: 150});
        await commentInput?.press('Enter', {delay: 150});
        await delay(5000)

        await commentInput?.dispose();

        await delay(5500);
        await browser.close();
        await delay(5500);
        console.log(`Profil ${profile.name} selesai...`)
    }
};

