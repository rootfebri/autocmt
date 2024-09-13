import Profile from "../../../models/profile";
import {confirm, expand, input} from "@inquirer/prompts";
import chalk from "chalk";
import {inqTheme, panic, validateEmailPhoneUsername} from "../../helpers/lib";
import launcher from "../launcher";
import delay from "delay";

const LOGIN_FORM = `input[type="text"][name="username"]`;
const PASSWORD_FORM = `input[type="password"][name="password"]`;

export default async (profile: Profile) => {
    if (profile.instagram) {
        const isContinue = await expand({
            message: chalk.yellow('Profile ini sudah memiliki akun instagram, ingin melakukan login ulang untuk Instagram?'),
            choices: [
                {name: 'Ya', value: true, key: 'y'},
                {name: 'Tidak', value: false, key: 'n'}
            ],
        });

        if (!isContinue) return;
        await Profile.update({instagram: false}, {where: {id: profile.id}});
    }


    const browser = await launcher(profile.fullpath, true);
    const [page] = await browser.pages();
    console.log(chalk.blue(`Membuka link login Instagram...`));
    await page.goto(`https://www.instagram.com/accounts/login/`, {waitUntil: 'networkidle0'}).catch(panic);
    let login = '';
    let password = '';
    const continueWithFacebook = await page.$('button._acan');
    if (continueWithFacebook) {
        const yes = await confirm({message: chalk.yellow('Lanjutkan dengan Facebook?')});
        if (yes) {
            await continueWithFacebook.click().catch(panic);
            await delay(5000);
            if (!page.url().includes('accounts/login')) {
                await Profile.update({instagram: true}, {where: {id: profile.id}});
                console.log(chalk.green(`Login ke Instagram berhasil. 🥳🎉`));
                return;
            }
        } else {
            await page.$$eval('div[role="button"]', async (buttons) => {
                buttons.forEach((button) => button.innerText.trim().toLowerCase().includes('switch') ? button.click() : null);
            });
        }
    } else {
        login = await input({
            message: 'Masukkan alamat [email | username | nomor] Instagram:',
            theme: inqTheme,
            validate: validateEmailPhoneUsername,
            required: true,
        });
        password = await input({
            message: 'Masukkan kata sandi Instagram:',
            theme: inqTheme,
            validate: (value: string) => value.length >= 5 || 'Kata sandi harus minimal 5 karakter.',
            required: true,
        });
        await delay(2500);
    }

    const loginForm = await page.waitForSelector(LOGIN_FORM).catch(panic);
    const paswdForm = await page.waitForSelector(PASSWORD_FORM).catch(panic);
    if (!loginForm || !paswdForm) {
        console.log(chalk.red(`Form ${!paswdForm ? 'password' : !loginForm ? 'email' : 'entahlah'} Instagram tidak ditemukan.`));
        return;
    }

    await loginForm.tap().catch(panic);
    await loginForm.focus().catch(panic);
    await loginForm.type(login, {delay: 100}).catch(panic);
    await delay(1000)
    await paswdForm.tap().catch(panic);
    await paswdForm.focus().catch(panic);
    await paswdForm.type(password, {delay: 100}).catch(panic);
    await delay(1000)
    await page.keyboard.press('Enter').catch(panic);
    await delay(5000)

    console.clear();
    // console.log(await terminalImage.buffer(pageImage));

    const status = await confirm({message: chalk.blue(`Login berhasil?`)});
    if (status) {
        await Profile.update({instagram: true}, {where: {id: profile.id}});
        console.log(chalk.green(`Login ke Instagram berhasil. 🥳🎉`));
    } else {
        console.log(chalk.cyan(`Lakukan Login ke Instagram secara manual...`));
        const status = await confirm({message: chalk.blue(`Login berhasil?`)});
        if (status) {
            await Profile.update({instagram: true}, {where: {id: profile.id}});
            console.log(chalk.green(`Login ke Instagram berhasil. 🥳🎉`));
        }
    }
}