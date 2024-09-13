import {select} from "@inquirer/prompts";
import setupLogin from "./actions/setup";
import deleteProfile from "./actions/delete-profile";
import fs from "fs";
import {CHROME_DIR} from "./helpers/lib";
import listProfile from "./actions/list-profile";
import twitter from "./task/twitter";
import instagram from "./task/instagram";
import facebook from "./task/facebook";
import createProfile from "./actions/create-profile";

const ensureChrome = () => {
    if (!fs.existsSync(CHROME_DIR)) {
        fs.mkdirSync(CHROME_DIR, {recursive: true})
    }
}

export default async () => {
    ensureChrome();

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
                                value: listProfile
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
    } catch (error) {
        console.error("An error occurred in main:", error);
    } finally {
        process.exit(0);
    }
}

