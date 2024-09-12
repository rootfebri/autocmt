import { getProfiles } from "./lib";
import { confirm, select } from "@inquirer/prompts";
import fs from "fs";

export default async function () {
    const profiles = getProfiles();
    if (profiles.length === 0) {
        console.error(`Tidak ada profil disini.`);
    } else {
        const delProfile = await select({
            message: 'Pilih profil untuk dihapus',
            choices: profiles.map(profile => {
                return {
                    name: profile.name,
                    value: async () => {
                        const confirmation = await confirm({ message: 'Yakin?', default: true });
                        if (confirmation) {
                            try {
                                if (fs.lstatSync(profile.fullpath).isDirectory()) {
                                    fs.rmSync(profile.fullpath, { recursive: true, force: true });
                                    console.log(`Profil "${profile.name}" berhasil dihapus!`);
                                } else {
                                    fs.unlinkSync(profile.fullpath);
                                    console.log(`Profil "${profile.name}" berhasil dihapus!`);
                                }
                            } catch (e: any) {
                                console.error(`Gagal menghapus profil "${profile.name}": ${e.message}`);
                            }
                        }
                    }
                };
            })
        });

        await delProfile();
    }
}
