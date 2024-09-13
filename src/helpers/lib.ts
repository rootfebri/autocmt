import path from "path";
import fs from "fs";
import Profile from "../../models/profile";
import {FProfile} from "./libs";
import chalk from "chalk";
import os from "os";

export const CHROME_DIR: string = path.join(__dirname, `../chrome/userData`)
export const docPath = path.join(os.homedir(), 'Documents');

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
    return fs.existsSync(docPath) ? path.normalize(docPath) : path.normalize(os.homedir());
}