import {input} from "@inquirer/prompts";
import {isProfileExists} from "./lib";
import {chromeLaunch} from "./launcher";

export const setupLogin = async () => {
    const profileName = await input({required: true, message: 'Masukkan nama profile chrome', default: ''})
    if (profileName.length < 1 && isProfileExists(profileName)) {
        console.info(`PROFILE ${profileName} SUDAH ADA`)
        process.exit(-1)
    }

    const browser = await chromeLaunch(profileName);
    const [page] = await browser.pages();
    await page.goto('https://facebook.com')
}
