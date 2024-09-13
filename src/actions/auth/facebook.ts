import chromeLaunch from "../launcher";
import Profile from "../../../models/profile";
import {confirm, expand} from "@inquirer/prompts";
import chalk from "chalk";
import {inqTheme} from "../../helpers/lib";

export default async (profile: Profile) => {
    if (!profile.facebook) {
        const isContinue = await expand({
            message: 'Apakah anda ingin melakukan login Facebook?',
            choices: [
                {name: 'Ya', value: true, key: 'y'},
                {name: 'Tidak', value: false, key: 'n'}
            ],
            default: 'n',
            theme: {
                prefix: chalk.blue('Facebook: '),
                ...inqTheme
            },
            expanded: true,
        });

        if (!isContinue) {
            return;
        }
    }
    const browser = await chromeLaunch(profile.fullpath);
    const [page] = await browser.pages();
    await page.goto('https://facebook.com');
    await confirm({
        message: 'Selesai?',
        default: false,
        transformer: (value) => value ? 'y' : 'n',
    })
    await browser.close()
}