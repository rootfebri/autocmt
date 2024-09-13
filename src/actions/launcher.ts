import {Browser, executablePath} from "puppeteer";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import puppeteer from "puppeteer-extra";

export default async (profile: string, headless: boolean = false): Promise<Browser> => {
    const stealth = StealthPlugin()
    stealth.enabledEvasions.delete('iframe.contentWindow')
    puppeteer.use(stealth)
    puppeteer.use(require('puppeteer-extra-plugin-user-preferences')({
        userPrefs: {
            webkit: {
                webprefs: {
                    default_font_size: 12
                }
            }
        }
    }));

    return await puppeteer.launch({
        userDataDir: profile,
        headless: headless,
        executablePath: executablePath('chrome'),
        devtools: false,
        ignoreDefaultArgs: ['--disable-extensions'],
        args: [
            // '--start-maximized',
            // '--disable-gpu',
            // '--no-sandbox',
            '--no-zygote',
            '--disable-accelerated-2d-canvas',
            '--disable-dev-shm-usage',
            "--proxy-server='direct://'",
            "--proxy-bypass-list=*",
        ]
    });
}
