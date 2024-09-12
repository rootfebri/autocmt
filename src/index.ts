import {select} from "@inquirer/prompts";
import setupLogin from "./setup";
import AutoComment from "./auto-comment";
import deleteProfile from "./delete-profile";
import fs from "fs";
import {CHROME_DIR} from "./lib";
import listProfile from "./list-profile";
import autoPostTwitter from "./auto-post-twitter";

const main = async () => {
    if (! fs.existsSync(CHROME_DIR)) {
        fs.mkdirSync(CHROME_DIR, {recursive: true})
    }
    try {
        const answer = await select({
            message: 'Pilih aksi',
            choices: [
                {name: 'Jalankan Bot Auto Comment', value: AutoComment},
                {name: 'Buat Profil Chrome baru', value: setupLogin},
                {name: 'Lihat semua profil chrome', value: listProfile},
                {name: 'Hapus profil chrome', value: deleteProfile},
                {name: 'Auto Tweet', value: autoPostTwitter},
            ],
        });

        await answer();
    } catch (error) {
        console.error("An error occurred in main:", error);
    } finally {
        process.exit(0);
    }
}

main().catch(console.log);
