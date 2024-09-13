import {checkbox} from "@inquirer/prompts";
import fs from "fs";
import Profile from "../../models/profile";
import {fmtProfiles, inqTheme} from "../helpers/lib";
import chalk from "chalk";
import prompts from "prompts";

export default async function () {
    const instructions = chalk.dim(' (↑ ↓ untuk bergerak [tekan :ENTER: jika panah stuck], :SPASI: untuk memilih, :ENTER: Hapus profile, `a` Pilih Semua, `i` Membalik Pilihan)');
    try {
        const choices = await Profile.findAll().then(profiles => profiles.map(profile => ({title: profile.name, value: profile})));

        const profiles = await prompts({
            message: 'Pilih profil untuk dihapus',
            choices,
            type: 'multiselect',
            name: 'data',
            hint: instructions,
        });

        for (const profile of profiles.data) {
            console.log(typeof profile, profile)
            // await deleteRecursive(profile)
        }
    } catch (e: any) {
        console.error('Gagal menghapus profile', e.message || e)
    }
}

const deleteRecursive = async (profile: Profile) => {
    try {
        if (fs.lstatSync(profile.fullpath).isDirectory()) {
            fs.rmSync(profile.fullpath, {recursive: true, force: true});
            console.log(`Profil "${profile.name}" berhasil dihapus!`);
        } else {
            fs.unlinkSync(profile.fullpath);
            console.log(`Profil "${profile.name}" berhasil dihapus!`);
        }
        await profile.destroy({force: true});
    } catch (e: any) {
        console.error(`Gagal menghapus profil "${profile.name}": ${e.message}`);
    }
}