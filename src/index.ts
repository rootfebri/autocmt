import {select} from "@inquirer/prompts";
import setupLogin from "./setup";
import AutoComment from "./auto-comment";

const main = async () => {
    try {
        const answer = await select({
            message: 'Pilih aksi',
            choices: [
                {name: 'Jalankan Bot Auto Comment', value: AutoComment},
                {name: 'Buat Profil Chrome baru', value: setupLogin},
            ],
        });

        await answer().finally(() => console.log("Operation completed successfully."));
    } catch (error) {
        console.error("An error occurred in main:", error);
    } finally {
        process.exit(0);
    }
}

main().catch(console.log);
