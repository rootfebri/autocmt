import path from "path";
import fs from "fs";
import {select} from "@inquirer/prompts";
import {chromeLaunch} from "./launcher";

export const CHROME_DIR: string = `./chrome/userData`

export const isProfileExists = (input: string): boolean => {
    const p = path.normalize(path.join(__dirname, `${CHROME_DIR}/${input}`))

    return fs.existsSync(p)
}

export const getProfiles = (): string[] => {
    try {
        const files = fs.readdirSync(CHROME_DIR);
        return files.filter((file) => {
            const filePath = path.join(CHROME_DIR, file);
            return fs.statSync(filePath).isDirectory();
        });
    } catch (error) {
        console.error(`Folder ${CHROME_DIR} error/tidak ditemukan`);
        return [];
    }
};

export const selectProfile = async () => {
    const profiles = getProfiles().map(profile => {
        return {
            name: profile,
            value: profile,
        }
    })

    if (profiles.length === 0) {
        console.log("Tidak ada profile ready")
        process.exit(-1)
    }

    const selected = await select({
        message: "Pilih salah satu",
        choices: profiles,
    });

    await chromeLaunch(selected)
}
