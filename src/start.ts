import main from "./main";

(async () => {
    while (true) {
        try {
            await main()
        } catch (error) {
            console.error("An error occurred in main:", error);
        }
    }
})()