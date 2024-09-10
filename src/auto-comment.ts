import {input} from "@inquirer/prompts";
import {getProfiles} from "./lib";
import {chromeLaunch} from "./launcher";
import delay from "delay";

const AutoComment = async () => {
    const linkPost = await input({
        message: 'Masukkan link postingan: ',
        validate: value => value.length > 10 && value.startsWith('https://www.facebook.com/')
    });

    const comment = await input({
        message: 'Masukkan isi komentar',
        validate: value => value.length > 10
    })

    const profiles = getProfiles()
    for (const profile in profiles) {
        const browser = await chromeLaunch(profile)
        const [page] = await browser.pages()
        await page.goto(linkPost, {waitUntil: 'networkidle0'})

        const commentInput = await page.waitForSelector('div[data-lexical-editor="true"][role="textbox"][spellcheck="true"]')
        await commentInput?.tap()
        await commentInput?.focus()
        await commentInput?.type(comment, {delay: 150})
        await delay(1500)
        await commentInput?.press('Enter')
        await commentInput?.dispose()

        await delay(5500)
        await browser.close()
        await delay(5500)
    }
};

export default AutoComment;