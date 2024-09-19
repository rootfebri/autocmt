import {confirm, select} from "@inquirer/prompts";
import Profile from "../../models/profile";
import {doNotPanic, fmtProfiles, panic} from "../helpers/lib";
import launcher from "./launcher";

export default async function () {
    const choices = await Profile.findAll().then(fmtProfiles).catch(panic);
    const profile = await select({
        message: 'Pilih profil untuk dibuka',
        choices,
    });

    const browser = await launcher(profile.fullpath).catch(panic);
    const [page] = await browser.pages();
    await page.goto('https://www.google.com').catch(doNotPanic);
    await confirm({message: 'Tekan :ENTER: jika sudah selesai.'});
    await browser.close().catch(panic);
}
