import {Browser, executablePath} from "puppeteer";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import puppeteer from "puppeteer-extra";
import process from "node:process";

export default async (profile: string, headless: boolean = false): Promise<Browser> => {
    if (process.argv.includes('--headless')) {
        headless = !!process.argv.find((value, index, args) => {
            if (value === '--headless' && typeof args[index + 1] === 'boolean') {
                return args[index + 1] as unknown as boolean;
            }
        });
    }

    const stealth = StealthPlugin();
    stealth.enabledEvasions.delete('iframe.contentWindow')
    // @ts-ignore
    puppeteer.use(stealth)
    // @ts-ignore
    puppeteer.use(require('puppeteer-extra-plugin-user-preferences')({
        userPrefs: {
            webkit: {
                webprefs: {
                    default_font_size: 12
                }
            }
        }
    }));

    // @ts-ignore
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
