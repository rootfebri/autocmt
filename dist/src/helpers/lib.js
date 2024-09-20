import path from "path";
import fs from "fs";
import chalk from "chalk";
import os from "os";
import process from "process";
export const BASE_DIR = path.resolve(__dirname, '..', '..');
export const CHROME_DIR = path.join(BASE_DIR, `src/chrome/userData`);
export const DOC_PATH = fs.existsSync(path.join(os.homedir(), 'Documents')) ? path.join(os.homedir(), 'Documents') : os.homedir();
export const TWEETS_DIR = path.join(BASE_DIR, `tweets`);
export const TWEET_PHOTOS_DIR = path.join(TWEETS_DIR, 'photos');
export const getRandomComment = (file) => {
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
export const selectRandom = (input) => {
    return input[Math.floor(Math.random() * input.length)];
};
export const renderMediaLists = (profile) => {
    const twitter = `[ TW: ${!profile.twitter ? '×' : '○'} ]`;
    const facebook = `[ FB: ${!profile.facebook ? '×' : '○'} ]`;
    const instagram = `[ IG: ${!profile.instagram ? '×' : '○'} ]`;
    return `${twitter} ${facebook} ${instagram}`;
};
export const fmtProfiles = (profiles) => profiles.map(fmtProfile);
export const fmtProfile = (profile) => ({
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
};
export const panic = (e) => {
    console.error(`Error: ${chalk.red(e.message || e)}`);
    process.exit(1);
};
export const doNotPanic = (e) => {
    console.error(`Error: ${chalk.red(e.message || e)}`);
};
export const validateEmailPhoneUsername = (input) => {
    if (input.includes('@')) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input) || 'Masukkan alamat email yang valid.';
    }
    else if (input.includes('+')) {
        return /^\+\d{1,2}\s?\d{3,4}\s?\d{3,4}\s?\d{4}$/.test(input) || 'Masukkan nomor telepon yang valid.';
    }
    else {
        return !input.includes(' ') && !input.includes('@') && !input.includes('+') || 'Masukkan alamat email, nomor telepon, atau username Twitter yang valid.';
    }
};
export const userBasePath = () => {
    return fs.existsSync(DOC_PATH) ? path.normalize(DOC_PATH) : path.normalize(os.homedir());
};
