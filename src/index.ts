import {AppDataSource} from "./data-source"
import {Chrome} from "./entity/Chrome"

AppDataSource.initialize().then(async (self) => {
    console.log("Inserting a new user into the database...")
    const chrome = new Chrome()
    chrome.facebook = false
    chrome.twitter = false
    chrome.instagram = false
    chrome.fullPath = "C:\\Users\\WOL\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe"
    chrome.name = "Google Chrome"

    await AppDataSource.manager.save(chrome)
    console.log("Saved a new user with id: " + chrome.id)

    console.log("Loading users from the database...")
    const users = await AppDataSource.manager.find(Chrome)
    const chromes = await self.manager.find(Chrome)
    console.log("Loaded users: ", chromes)

    console.log("Here you can setup and run express / fastify / any other framework.")

}).catch(error => console.log(error))
