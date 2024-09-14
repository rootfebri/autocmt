import {input, select} from "@inquirer/prompts";
import {doNotPanic, getRandomComment, panic, userBasePath} from "../helpers/lib.ts";
import launcher from "../actions/launcher.ts";
import delay from "delay";
import fileSelector from 'inquirer-file-selector'
import fs from "fs";
import Profile from "../../models/profile.ts";
import chalk from "chalk";

export default async function () {

    const profiles = await Profile.findAll({where: {instagram: true}});
    const linkPost = await input({
        message: 'Masukkan link postingan: ',
        validate: value => /^(https?:\/\/)?([\da-z.-]+\.)+[a-z]{2,}$/.test(value) || 'Link postingan harus valid',
        transformer: value => value.replace('http://', 'https://'),
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


        const commentInput = await page.waitForSelector('textarea[autocomplete="off"]').catch(panic);

        await commentInput?.tap();
        await commentInput?.focus();
        await commentInput?.type(comment, {delay: 150});
        await commentInput?.press('Enter', {delay: 150});

        let maxTry: number = 50
        while (await page.$('div[data-visualcompletion="loading-state"]').catch(doNotPanic) && maxTry > 1) {
            await delay(100)
            maxTry--
        }

        await commentInput?.dispose();


        await delay(5500);
        await browser.close();
        await delay(5500);
    }
};

