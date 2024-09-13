import {checkbox, select} from "@inquirer/prompts";
import Profile from "../../models/profile";
import facebook from "./auth/facebook";
import {fmtProfiles} from "../helpers/lib";
import twitter from "./auth/twitter";

export default async function () {
    const profiles = await Profile.findAll().then(fmtProfiles);
    if (profiles.length === 0) {
        console.error('Tidak ada profile Chrome yang terdaftar.');
        return;
    }
    const profile = await select({
        message: 'Pilih profile Chrome:',
        choices: profiles,
    });

    const auths = await checkbox({
        message: 'Lakukan login untuk:',
        choices: [
            {name: 'Facebook', value: facebook},
            {name: 'Twitter', value: twitter},
            {name: 'Instagram', value: twitter},
        ],
        required: true,
        validate: (answers) => answers.length > 0 || 'Harus memilih salah satu.',
    })

    for (const auth of auths) {
        await auth(profile)
    }
}
