import {select} from "@inquirer/prompts";
import setupLogin from "./actions/setup.ts";
import deleteProfile from "./actions/delete-profile.ts";
import fs from "fs";
import {CHROME_DIR, TWEETS_DIR} from "./helpers/lib.ts";
import listProfile from "./actions/list-profile.ts";
import twitter from "./task/twitter.ts";
import instagram from "./task/instagram.ts";
import facebook from "./task/facebook.ts";
import createProfile from "./actions/create-profile.ts";
import openProfile from "./actions/open-profile.ts";
import process from "node:process";

const ensureRequiredDir = () => {
    if (!fs.existsSync(CHROME_DIR)) {
        fs.mkdirSync(CHROME_DIR, {recursive: true})
    }
    if (!fs.existsSync(TWEETS_DIR)) {
        fs.mkdirSync(TWEETS_DIR, {recursive: true})
    }
}

const main = async () => {
    ensureRequiredDir();

    try {
        const answer = await select({
            message: 'Menu',
            choices: [
                {
                    name: 'Jalankan BOT',
                    value: async () => await select({
                        message: 'Pilih sosial media',
                        choices: [{
                            name: 'Twitter',
                            value: twitter,
                        }, {
                            name: 'Facebook',
                            value: facebook,
                        }, {
                            name: 'Instagram',
                            value: instagram,
                        }]
                    }),
                },
                {
                    name: 'Pengaturan Browser',
                    value: async () => await select({
                        message: 'Menu',
                        choices: [
                            {
                                name: 'Loginkan akun pada profil (FB, X, IG)',
                                value: setupLogin
                            }, {
                                name: 'Buat profil chrome',
                                value: createProfile
                            }, {
                                name: 'Buka profil chrome',
                                value: openProfile
                            }, {
                                name: 'Daftar Profil',
                                value: listProfile
                            }, {
                                name: 'Hapus Profil',
                                value: deleteProfile
                            },
                        ]
                    })
                },
            ],
        });

        const answer2 = await answer();
        await answer2();
    } catch (error: any) {
        console.error("An error occurred in main:", error.message);
    } finally {
        process.exit(0);
    }
}

(async () => {
    await main()
})()
