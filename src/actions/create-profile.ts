import Profile from "../../models/profile";
import {input} from "@inquirer/prompts";
import {CHROME_DIR} from "../helpers/lib";
import path from "path";
import chromeLaunch from "./launcher";
import delay from "delay";

export default async () => {
    const profileName = await input({
        required: true,
        message: 'Masukkan nama profile chrome',
        validate: async value => {
            const profile = await Profile.findOne({where: {name: value, fullpath: path.join(CHROME_DIR, value)}})
            return profile === null
        },
        transformer: value => path.join(CHROME_DIR, value).replace(/\\/g, '/'),
    });

    try {
        const profile = await Profile.create({
            name: profileName,
            fullpath: path.join(CHROME_DIR, profileName),
        });

        const browser = await chromeLaunch(profile.fullpath, true);
        await delay(2000)
        await browser.close()

        console.info(`[${profile.id}] Profile '${profile.name}' Berhasil dibuat!`)
    } catch (error) {
        console.error("Error creating profile:", error);
    }
};
