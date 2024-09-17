import Profile from "../../models/profile.ts";
import {confirm, input, select} from "@inquirer/prompts";
import {CHROME_DIR} from "../helpers/lib.ts";
import path from "path";
import launcher from "./launcher.ts";
import delay from "delay";

export default async () => {
    const create = await select({
        message: 'Pilih cara membuat profile',
        choices: [
            {name: 'Manual', value: ManualProfile},
            {name: 'Otomatis', value: Otomatis}
        ],
    })

    await create();
};

const ManualProfile = async () => {
    const profileName = await input({
        required: true,
        message: 'Masukkan nama profile chrome',
        validate: async value => await Profile.findOne({where: {name: value, fullpath: path.join(CHROME_DIR, value)}}) === null,
        transformer: value => path.join(CHROME_DIR, value).replace(/\\/g, '/'),
    });
    try {
        const profile = await Profile.create({
            name: profileName,
            fullpath: path.join(CHROME_DIR, profileName),
        });

        const browser = await launcher(profile.name, true);
        await delay(2000)
        await browser.close()

        console.info(`[${profile.id}] Profile '${profile.name}' Berhasil dibuat!`)
    } catch (error) {
        console.error("Error creating profile:", error);
    }
}

const Otomatis = async () => {
    const prefix = await input({
        required: true,
        message: 'Masukkan prefix untuk nama profile chrome',
        transformer: value => `${value}_`
    });
    let maxProfile: number | string = await input({
        message: 'Masukkan jumlah profile yang ingin dibuat',
        default: '1',
        validate: (value) => Number(value) > 0 || 'Jumlah profile harus lebih besar dari 0',
    });
    maxProfile = parseInt(maxProfile);
    const autoClose = await confirm({
        message: 'Apakah ingin menutup browser setelah membuat semua profile?',
        default: true,
    });

    let created = 0;
    for (let i = 0; i < maxProfile; i++) {
        let profileName = `${prefix}_${i}`;
        if (await Profile.findOne({where: {name: profileName, fullpath: path.join(CHROME_DIR, profileName)}}) === null) {
            const profile = await Profile.create({
                name: profileName,
                fullpath: path.join(CHROME_DIR, profileName),
            });

            const browser = await launcher(profile.fullpath, true);
            await delay(2000)
            if (!autoClose) {
                await confirm({message: `Udah mbot?`});
            }
            await browser.close()
            console.info(`[${profile.id}] Profile '${profile.name}' Berhasil dibuat!`)
            created++;
        }
    }
    console.log(`Berhasil membuat ${created} profile chrome!`)
}