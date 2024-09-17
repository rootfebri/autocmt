import path from "path";
import fs from "fs";
import Profile from "../../models/profile.ts";
import chalk from "chalk";
import os from "node:os";
import process from "node:process";

type FProfile = {
    name: string
    value: Profile
}

export const BASE_DIR: string = path.resolve(__dirname, '..', '..');
export const CHROME_DIR: string = path.join(BASE_DIR, `src/chrome/userData`)
export const DOC_PATH: string = fs.existsSync(path.join(os.homedir(), 'Documents')) ? path.join(os.homedir(), 'Documents') : os.homedir();
export const TWEETS_DIR: string = path.join(BASE_DIR, `tweets`)

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

export const doNotPanic = (e: any) => {
    console.error(`Error: ${chalk.red(e.message || e)}`);
}

export const validateEmailPhoneUsername = (input: string) => {
    if (input.includes('@')) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input) || 'Masukkan alamat email yang valid.';
    } else if (input.includes('+')) {
        return /^\+\d{1,2}\s?\d{3,4}\s?\d{3,4}\s?\d{4}$/.test(input) || 'Masukkan nomor telepon yang valid.';
    } else {
        return !input.includes(' ') && !input.includes('@') && !input.includes('+') || 'Masukkan alamat email, nomor telepon, atau username Twitter yang valid.';
    }
}

export const userBasePath = () => {
    return fs.existsSync(DOC_PATH) ? path.normalize(DOC_PATH) : path.normalize(os.homedir());
}