import path from "path";
import { checkbox, select } from '@inquirer/prompts';
import fs from "fs";
import { selectRandom, TWEET_PHOTOS_DIR, TWEETS_DIR } from "../helpers/lib";
import launcher from "../actions/launcher";
import delay from "delay";
import Profile from "../../profile";
import chalk from "chalk";
const X_HOME = `https://x.com/home`;
export default async function () {
    const profiles = await Profile.findAll({ where: { twitter: true } });
    if (profiles.length === 0) {
        console.log(chalk.red(`Tidak ada chrome yang memiliki akun Twitter`));
        return;
    }
    const pakaiFitur = await tanyaFitur();
    await pakaiFitur(profiles);
}
;
const remapFiles = (file) => ({ name: file, value: path.join(TWEETS_DIR, file) });
const tanyaFitur = () => select({
    message: 'Pilih fitur yang ingin dipakai',
    choices: [
        { name: 'Auto Tweet', value: autoTweet },
        { name: 'Auto Re-Tweet', value: autoReTweet, disabled: true, description: 'Belum ready!' },
    ],
});
const autoTweet = async (profiles) => {
    const tweetFiles = fs.readdirSync(TWEETS_DIR).filter((file) => fs.statSync(path.join(TWEETS_DIR, file)).isFile());
    if (tweetFiles.length === 0) {
        console.log(chalk.red(`Tidak ada file tweet yang tersedia, buat dulu file nya di folder tweets/ bannnng`));
        return;
    }
    const files = await checkbox({
        message: 'Pilih file tweet',
        choices: tweetFiles.map(remapFiles).filter(file => file.value.includes('.txt')),
        required: true,
    });
    for (const profile of profiles) {
        try {
            const fileComment = selectRandom(files);
            let tweet = fs.readFileSync(fileComment, { encoding: 'utf-8' });
            if (tweet.length > 280) {
                console.log(chalk.yellow(`Tweet terlalu panjang. Diambil sebagian...`));
            }
            tweet = tweet.slice(0, 280);
            console.log(`Memanggil chrome profil ${profile.name}...\r`);
            const browser = await launcher(profile.fullpath, true);
            const [page] = await browser.pages();
            console.log(`Memanggil chrome profil ${profile.name}... berhasil\n`);
            console.log(`Membuka twitter...\r`);
            await page.goto(X_HOME, { waitUntil: 'domcontentloaded' });
            await delay(1500);
            console.log(`Membuka twitter... berhasil\n`);
            await delay(3500);
            console.log(`Membuat tweet baru`);
            await page.keyboard.press('n');
            const textArea = await page.waitForSelector('div[aria-labelledby="modal-header"][aria-modal="true"][role="dialog"]', { visible: true });
            if (textArea) {
                console.log(`Tweet form berhasil terbuka`);
                console.log(`Menulis Tweet...`);
                await textArea?.type(tweet, { delay: 100 });
                console.log(`Menulis Tweet... berhasil`);
                const tweetPhoto = scanAndGrabRandPhoto();
                if (tweetPhoto) {
                    console.log(`Menambahkan gambar...`);
                    const inputs = await page.$$('input[data-testid="fileInput"][type="file"]');
                    for (const input of inputs) {
                        if (await input.isVisible())
                            await input.uploadFile(tweetPhoto);
                    }
                    console.log(`Menambahkan gambar... ${chalk.green('Sukses')}`);
                }
                console.log(`Mengirim...`);
                await page.keyboard.down('ControlLeft');
                await page.keyboard.press('Enter');
                await page.keyboard.up('ControlLeft');
                await delay(5000);
                console.log(`Mengirim... berhasil`);
            }
            else {
                console.error(`Terjadi kesalahan saat membuka form tweet`);
            }
        }
        catch (e) {
            console.error(e.message);
        }
    }
};
const autoReTweet = async (profiles) => {
    const tweetFiles = fs.readdirSync(TWEETS_DIR).filter((file) => fs.statSync(path.join(TWEETS_DIR, file)).isFile());
    if (tweetFiles.length === 0) {
        console.log(chalk.red(`Tidak ada file tweet yang tersedia, buat dulu file nya di folder tweets/ bannnng`));
        return;
    }
    const files = await checkbox({
        message: 'Pilih file tweet',
        choices: tweetFiles.map(remapFiles).filter(file => file.value.includes('.txt')),
        required: true,
    });
    for (const profile of profiles) {
        try {
            const fileComment = selectRandom(files);
            let tweet = fs.readFileSync(fileComment, { encoding: 'utf-8' });
            if (tweet.length > 280) {
                console.log(chalk.yellow(`Tweet terlalu panjang. Diambil sebagian...`));
            }
            tweet = tweet.slice(0, 280);
            console.log(`Memanggil chrome profil ${profile.name}...\r`);
            const browser = await launcher(profile.fullpath, true);
            const [page] = await browser.pages();
            console.log(`Memanggil chrome profil ${profile.name}... berhasil\n`);
            console.log(`Membuka twitter...\r`);
            await page.goto(X_HOME, { waitUntil: 'domcontentloaded' });
            await delay(1500);
            console.log(`Membuka twitter... berhasil\n`);
            await delay(3500);
            console.log(`Membuat tweet baru`);
            await page.keyboard.press('n');
            const textArea = await page.waitForSelector('div[aria-labelledby="modal-header"][aria-modal="true"][role="dialog"]', { visible: true });
            if (textArea) {
                console.log(`Tweet form berhasil terbuka`);
                console.log(`Menulis Tweet...`);
                await textArea?.type(tweet, { delay: 100 });
                console.log(`Menulis Tweet... ${chalk.green('Sukses')}`);
                const tweetPhoto = scanAndGrabRandPhoto();
                if (tweetPhoto) {
                    console.log(`Menambahkan gambar...`);
                    await delay(1000);
                    console.log(`Menambahkan gambar... ${chalk.green('Sukses')}`);
                }
                console.log(`Mengirim...`);
                await page.keyboard.down('ControlLeft');
                await page.keyboard.press('Enter');
                await page.keyboard.up('ControlLeft');
                await delay(5000);
                console.log(`Mengirim... ${chalk.green('Sukses')}`);
            }
            else {
                console.error(chalk.red(`Terjadi kesalahan saat membuka form tweet: Form tidak ditemukan`));
            }
        }
        catch (e) {
            console.error(`Profile ERROR: ${e.message}`);
        }
    }
};
const scanAndGrabRandPhoto = () => {
    if (!fs.existsSync(TWEET_PHOTOS_DIR)) {
        fs.mkdirSync(TWEET_PHOTOS_DIR, { recursive: true });
        return null;
    }
    else {
        const photos = fs.readdirSync(TWEET_PHOTOS_DIR).filter((file) => !file.includes('.gitignore') && fs.statSync(path.join(TWEET_PHOTOS_DIR, file)).isFile());
        if (photos.length === 0) {
            return null;
        }
        const photo = selectRandom(photos);
        return path.join(TWEET_PHOTOS_DIR, photo);
    }
};
