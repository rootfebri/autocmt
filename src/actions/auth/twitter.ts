import Profile from "../../../models/profile";
import {expand, input} from "@inquirer/prompts";
import {inqTheme, panic, validateEmailPhoneUsername} from "~/helpers/lib";
import launcher from "../launcher";
import chalk from "chalk";
import delay from "delay";
import {ElementHandle} from "puppeteer";

export default async (profile: Profile) => {
    if (profile.twitter) {
        const isContinue = await expand({
            message: 'Profile ini sudah memiliki akun twitter, ingin melakukan login ulang untuk Twitter?',
            choices: [
                {name: 'Ya', value: true, key: 'y'},
                {name: 'Tidak', value: false, key: 'n'}
            ],
            theme: inqTheme,
        });

        if (!isContinue) return;
        await Profile.update({twitter: false}, {where: {id: profile.id}});
    }

    const identifier = await input({
        message: 'Masukkan alamat [email | username | nomor] Twitter:',
        theme: inqTheme,
        validate: validateEmailPhoneUsername,
        required: true,
    });

    const password = await input({
        message: 'Masukkan kata sandi Twitter:',
        theme: inqTheme,
        validate: (value: string) => value.length >= 5 || 'Kata sandi harus minimal 5 karakter.',
        required: true,
    });

    const browser = await launcher(profile.fullpath);
    const [page] = await browser.pages();

    try {
        console.log(chalk.blue(`Mengambil link login Twitter...`));
        await page.goto('https://x.com/i/flow/login', {waitUntil: 'networkidle0'}).catch(panic);
        console.log(chalk.green(`Link terbuka`));

        console.log(chalk.blue(`Mengisi form login Twitter...`));
        // @ts-ignore
        let emailInput: ElementHandle<HTMLInputElement> | null = null;
        try {
            emailInput = await page.waitForSelector('input[autocapitalize="sentences"][autocomplete="username"][autocorrect="on"][name="text"][spellcheck="true"][type="text"]');
        } catch (e) {
            console.log(`PANIC!: Terjadi panic pada saat mencari input email.`);
            panic(e);
        }
        await emailInput?.tap();
        await emailInput?.focus();
        await emailInput?.type(identifier, {delay: 100});
        await page.keyboard.press('Enter', {delay: 100});
        await delay(5000)
        let needUsernameOrPhone = await page.$('input[data-testid="ocfEnterTextTextInput"]')
        while (needUsernameOrPhone) {
            const additional = await input({message: chalk.yellow('Masukkan [username | nomor] Twitter:'), validate: validateEmailPhoneUsername, required: true});
            await needUsernameOrPhone.tap()
            await needUsernameOrPhone.focus()
            await needUsernameOrPhone.type(additional, {delay: 100});
            await page.keyboard.press('Enter', {delay: 100});
            await delay(2500);
            needUsernameOrPhone = await page.$('input[data-testid="ocfEnterTextTextInput"]')
            if (!needUsernameOrPhone) {
                break;
            } else {
                console.log(chalk.yellow('Nomor telepon atau username Twitter salah, silahkan coba lagi.'));
            }
        }

        if (await page.$('#arkoseFrame')) {
            console.log(chalk.yellow('Lakukan verifikasi secara manual 📛'));
            while (await page.$('#arkoseFrame') !== null) await delay(1000);
        } else {
            console.log(chalk.cyan('Captcha tidak ditemukan, melanjutkan ke password form.'));
        }

        // @ts-ignore
        let passwordInput: ElementHandle<HTMLInputElement> | null = null;
        try {
            console.log(chalk.blue(`Mencari form password Twitter...`));
            passwordInput = await page.$('input[autocapitalize="sentences"][autocomplete="current-password"][autocorrect="on"][name="password"][spellcheck="true"][type="password"]');
            if (!passwordInput) {
                console.log(chalk.yellow('Password form tidak ditemukan, lakukan login manual.'));
                const askAgain = await expand({message: 'Login berhasil?', choices: [{name: 'Ya', value: true, key: 'y'}, {name: 'Tidak', value: false, key: 'n'}], theme: inqTheme, default: 'y'});
                if (askAgain) {
                    console.log(chalk.green(`Login ke Twitter berhasil. 🥳🎉`));
                    await Profile.update({twitter: true}, {where: {id: profile.id}})
                }
            } else {
                await passwordInput.tap();
                await passwordInput.focus();
                await passwordInput.type(password, {delay: 100});
                await page.keyboard.press('Enter', {delay: 100});
                await delay(5000)
                if (page.url().includes('/home')) {
                    console.log(chalk.green(`Login ke Twitter berhasil. 🥳🎉`));
                    await Profile.update({twitter: true}, {where: {id: profile.id}})
                } else {
                    const askAgain = await expand({message: 'Login berhasil?', choices: [{name: 'Ya', value: true, key: 'y'}, {name: 'Tidak', value: false, key: 'n'}], theme: inqTheme, default: 'y'});
                    if (askAgain) {
                        console.log(chalk.green(`Login ke Twitter berhasil. 🥳🎉`));
                        await Profile.update({twitter: true}, {where: {id: profile.id}})
                    }
                }
            }
        } catch (e: any) {
            console.log(`PANIC!: Terjadi panic pada saat mencari input password.`);
            panic(e);
        }
    } catch (e: any) {
        console.log(`Error: ${chalk.red(e.message)}`);
    }
    await browser.close()
}