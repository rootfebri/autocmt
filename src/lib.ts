import path from "path";
import fs from "fs";

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
