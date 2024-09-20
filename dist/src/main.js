import { select } from "@inquirer/prompts";
import setupLogin from "./actions/setup";
import deleteProfile from "./actions/delete-profile";
import fs from "fs";
import { BASE_DIR, CHROME_DIR, TWEETS_DIR } from "./helpers/lib";
import listProfile from "./actions/list-profile";
import twitter from "./task/twitter";
import instagram from "./task/instagram";
import facebook from "./task/facebook";
import createProfile from "./actions/create-profile";
import openProfile from "./actions/open-profile";
import process from "process";
import { sequelize } from "../models";
import path from "path";
const ensureRequiredDir = () => {
    if (!fs.existsSync(CHROME_DIR)) {
        fs.mkdirSync(CHROME_DIR, { recursive: true });
    }
    if (!fs.existsSync(TWEETS_DIR)) {
        fs.mkdirSync(TWEETS_DIR, { recursive: true });
    }
};
const ensureLogger = () => {
    if (!fs.existsSync(path.join(BASE_DIR, 'logs'))) {
        fs.mkdirSync(path.join(BASE_DIR, 'logs'), { recursive: true });
    }
};
const main = async () => {
    ensureRequiredDir();
    ensureLogger();
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
        try {
            const answer2 = await answer();
            await answer2();
        }
        catch (e) {
            console.error("An error occurred in second thread:", e.message);
            const logFile = path.join(BASE_DIR, 'logs', 'error.log');
            fs.appendFileSync(logFile, `${e}\n`);
        }
    }
    catch (e) {
        console.error("An error occurred in main thread:", e.message);
        const logFile = path.join(BASE_DIR, 'logs', 'error.log');
        fs.appendFileSync(logFile, `${e}\n`);
    }
    finally {
        process.exit(0);
    }
};
(async () => {
    await sequelize.authenticate({
        logging: false,
        benchmark: false,
        nest: false,
    });
    await main();
})();
