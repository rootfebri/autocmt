import {input, select} from "@inquirer/prompts";
import {getRandomComment, userBasePath} from "../helpers/lib.ts";
import launcher from "../actions/launcher.ts";
import delay from "delay";
import fileSelector from 'inquirer-file-selector'
import * as fs from "fs";
import Profile from "../../models/profile.ts";
import chalk from "chalk";
import {HTTPResponse} from "puppeteer";

export default async function () {
    const profiles = await Profile.findAll({where: {facebook: true}});

    if (profiles.length === 0) {
        console.log(chalk.red(`Tidak ada chrome yang memiliki akun Facebook`))
        return;
    }

    const linkPost = await input({
        message: 'Masukkan link postingan: ',
        validate: value => value.includes('http') || value.includes('https') || 'Link postingan harus valid',
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
                name: 'Dari file .txt (Dipisah perbaris)', value: () => fileSelector({
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
        page.on('dialog', async (dialog) => {
            console.log('Dialog detected:', dialog.message());
            if (dialog.type() === 'alert') {
                console.log('Canceling alert dialog...');
                try {
                    await dialog.dismiss();
                    console.log('Alert dialog canceled.');
                } catch (e) {
                    console.log('Alert dialog cancel has been failed.');
                }
            }
        });

        let comment: string;
        if (fs.existsSync(_comment)) {
            console.log(chalk.cyan(`Membuka profile chrome ${profile.name}... Berhasil`))
            comment = await getRandomComment(_comment);
        } else {
            comment = _comment;
        }

        console.log(chalk.yellow(`Membuka link postingan...`))
        let response: HTTPResponse | null = null;
        try {
            response = await page.goto(linkPost, {waitUntil: 'networkidle0'});
        } catch (e: any) {
            console.error(`Error: ${chalk.red(e.message || e)}`);
        }
        if (!response) {
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

        try {
            const commentInput = await page.$('div[data-lexical-editor="true"][role="textbox"][spellcheck="true"]');
            await commentInput?.tap();
            await commentInput?.focus();
            await commentInput?.type(comment, {delay: 150});
            await commentInput?.press('Enter', {delay: 150});
            await delay(5000)
            await commentInput?.dispose();
        } catch (e: any) {
            console.log(chalk.red(`Error: ${chalk.red(e.message || e)}`));
        }

        await delay(5500);
        await browser.close();
        await delay(5500);
        console.log(`Profil ${profile.name} selesai...`)
    }
};

