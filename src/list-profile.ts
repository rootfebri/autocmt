import {getProfiles} from "./lib";

export default async function () {
    const profiles = getProfiles()
    if (profiles.length === 0) {
        console.error(`Tidak ada profil disini.`)
    } else {
        for (const profile of profiles) {
            console.info(profile.name, '\n');
        }
    }
}