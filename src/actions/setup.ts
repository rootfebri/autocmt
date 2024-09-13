import {checkbox, select} from "@inquirer/prompts";
import Profile from "../../models/profile";
import facebook from "./auth/facebook";
import {fmtProfiles} from "../helpers/lib";

export default async function () {
    const profiles = Profile.findAll().then(fmtProfiles);
    const profile = await select({
        message: 'Pilih profile Chrome:',
        choices: await profiles,
    });

    const auths = await checkbox({
        message: 'Lakukan login untuk:',
        choices: [
            {name: 'Facebook', value: facebook},
            {name: 'Instagram', value: facebook},
            {name: 'Twitter', value: facebook},
        ],
    })

    for (const auth of auths) {
        await auth(profile)
    }
}
