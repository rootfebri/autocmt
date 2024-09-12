import {input} from "@inquirer/prompts";
import {CHROME_DIR, isProfileExists} from "./lib";
import {chromeLaunch} from "./launcher";
import path from "path";

export const setupLogin = async () => {
    const profileName = await input({
        required: true,
        message: 'Masukkan nama profile chrome',
        default: '',
        validate: value => value.length > 1 && !isProfileExists(value) && !value.includes('\\') && !value.includes('/'),
        transformer: value => path.join(CHROME_DIR, value).replace(/\\/g, '/'),
    })

    const browser = await chromeLaunch(path.join(CHROME_DIR, profileName));
    const [page] = await browser.pages();
    await page.goto('https://facebook.com')
}
