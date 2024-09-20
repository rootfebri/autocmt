import { checkbox } from "@inquirer/prompts";
import fs from "fs";
import Profile from "../../profile";
import { fmtProfiles, inqTheme } from "../helpers/lib";
import chalk from "chalk";
export default async function () {
    const instructions = chalk.dim(' (↑ ↓ untuk bergerak [tekan :ENTER: jika panah stuck], :SPASI: untuk memilih, :ENTER: Hapus profile, `a` Pilih Semua, `i` Membalik Pilihan)');
    try {
        const choices = await Profile.findAll().then(fmtProfiles);
        const profiles = await checkbox({
            message: 'Pilih profil untuk dihapus',
            required: true,
            choices,
            instructions,
            theme: inqTheme
        });
        for (const profile of profiles) {
            await deleteRecursive(profile);
        }
    }
    catch (e) {
        console.error('Gagal menghapus profile', e.message || e);
    }
}
const deleteRecursive = async (profile) => {
    try {
        if (fs.lstatSync(profile.fullpath).isDirectory()) {
            fs.rmSync(profile.fullpath, { recursive: true, force: true });
            console.log(`Profil "${profile.name}" berhasil dihapus!`);
        }
        else {
            fs.unlinkSync(profile.fullpath);
            console.log(`Profil "${profile.name}" berhasil dihapus!`);
        }
        await profile.destroy({ force: true });
    }
    catch (e) {
        console.error(`Gagal menghapus profil "${profile.name}": ${e.message}`);
    }
};
