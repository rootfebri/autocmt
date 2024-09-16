import Profile from "../../../models/profile.ts";
import {expand, input} from "@inquirer/prompts";
import chalk from "chalk";
import {inqTheme, panic} from "~/helpers/lib.ts";
import delay from "delay";
import launcher from "../launcher.ts";

export default async (profile: Profile) => {
    if (profile.facebook) {
        const isContinue = await expand({
            message: 'Profile ini sudah memiliki akun facebook, ingin melakukan login ulang untuk Facebook?',
            choices: [
                {name: 'Ya', value: true, key: 'y'},
                {name: 'Tidak', value: false, key: 'n'}
            ],
        });

        if (!isContinue) return;
        await Profile.update({facebook: false}, {where: {id: profile.id}});
    }

    const email = await input({
        message: 'Masukkan alamat email Facebook:',
        theme: inqTheme,
        // validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Masukkan alamat email yang valid.',
        required: true,
    });

    const password = await input({
        message: 'Masukkan kata sandi Facebook:',
        theme: inqTheme,
        validate: (value: string) => value.length >= 5 || 'Kata sandi harus minimal 5 karakter.',
        required: true,
    })

    const browser = await launcher(profile.fullpath);
    const [page] = await browser.pages();
    console.error(`Lakukan login ke Facebook pada browser.`);

    try {
        await page.goto('https://facebook.com').catch(panic);
        const emailInput = await page.waitForSelector('#email');
        const passwordInput = await page.waitForSelector('#pass');
        await emailInput?.tap();
        await emailInput?.focus();
        await emailInput?.type(email, {delay: 100});
        await passwordInput?.tap();
        await passwordInput?.focus();
        await passwordInput?.type(password, {delay: 100});
        await page.keyboard.press('Enter', {delay: 100});

        await delay(5000);
        await page.waitForNavigation({waitUntil: 'networkidle0'});

        if (page.url().includes('/two_step_verification') || page.url().includes('/checkpoint')) {
            console.log(chalk.yellow('Lakukan verifikasi secara manual 📛'));
            while (page.url().includes('/two_step_verification') || page.url().includes('/checkpoint')) {
                await delay(1000);
            }
            if (page.url().includes('/two_factor/remember_browser')) {
                console.log(chalk.green(`Login ke Facebook berhasil. 🥳🎉`));
                await Profile.update({facebook: true}, {where: {id: profile.id}})
            }
        } else {
            console.log(chalk.green(`Login ke Facebook berhasil. 🥳🎉`));
            await Profile.update({facebook: true}, {where: {id: profile.id}})
        }
    } catch (e: any) {
        console.log(`Error: ${chalk.red(e.message)}`);
    }
    await browser.close()
}