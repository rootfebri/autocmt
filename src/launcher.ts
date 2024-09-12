import {Browser, executablePath} from "puppeteer";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import puppeteer from "puppeteer-extra";

export const chromeLaunch = async (profile: string): Promise<Browser> => {
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
        headless: false,
        executablePath: executablePath('chrome'),
        devtools: false,
        slowMo: 0,
        ignoreDefaultArgs: ['--disable-extensions'],
        args: [
            // '--start-maximized',
            '--disable-gpu',
            '--no-sandbox',
            '--no-zygote',
            '--disable-setuid-sandbox',
            '--disable-accelerated-2d-canvas',
            '--disable-dev-shm-usage',
            "--proxy-server='direct://'",
            "--proxy-bypass-list=*"
        ]
    });
}
