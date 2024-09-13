import path from "path";
import fs from "fs";
import Profile from "../../models/profile";
import {FProfile} from "./libs";
import chalk from "chalk";

export const CHROME_DIR: string = path.join(__dirname, `../chrome/userData`)

export const isProfileExists = (input: string): boolean => {
    const p = path.normalize(path.join(CHROME_DIR, input))

    return fs.existsSync(p)
}

export interface IProfile {
    name: string
    fullpath: string
}

export const getProfiles = (): IProfile[] => {
    try {
        const filenames = fs.readdirSync(CHROME_DIR).filter((file) => fs.statSync(path.join(CHROME_DIR, file)).isDirectory());
        return filenames.map(filename => {
            return {
                name: filename,
                fullpath: path.join(CHROME_DIR, filename)
            }
        })
    } catch (error) {
        console.error(`Folder ${CHROME_DIR} error/tidak ditemukan`);
        return [];
    }
};

export const getRandomComment = (file: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, "utf-8", (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            const lines = data.trim().split('\n');
            const line = lines[Math.floor(Math.random() * lines.length)];
            resolve(line);
        });
    });
};

export const selectRandom = (input: string[]): string => {
    return input[Math.floor(Math.random() * input.length)];
}

export const renderMediaLists = (profile: Profile): string => {
    const twitter = `[ TW: ${!profile.twitter ? '×' : '○'} ]`;
    const facebook = `[ FB: ${!profile.facebook ? '×' : '○'} ]`;
    const instagram = `[ IG: ${!profile.instagram ? '×' : '○'} ]`;
    return `${twitter} ${facebook} ${instagram}`

}

export const fmtProfiles = (profiles: Profile[]) => profiles.map(fmtProfile);
export const fmtProfile = (profile: Profile): FProfile => ({
    name: `[${profile.id}] ${profile.name} | ${renderMediaLists(profile)}`,
    value: profile,
});

export const inqTheme = {
    spinner: {
        interval: 200,
        frames: ['-', '\\', '|', '/'],
    },
    style: {
        answer: chalk.green,
        key: chalk.cyan,
        message: chalk.white,
        error: chalk.red,
        help: chalk.gray,
        highlight: chalk.cyan,
        defaultAnswer: chalk.white,
    },
}

export const panic = (e: any) => {
    console.error(`Error: ${chalk.red(e.message || e)}`);
    process.exit(1);
}