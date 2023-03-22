const puppeteer = require('puppeteer');
const fs = require('fs');
// let argv = require('minimist')(process.argv.slice(2));
// const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database('../extensions.db');

// This is where we'll put the code to get around the tests.
const setUserAgent = async (page) => {

// Pass the User-Agent Test.
    const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
    await page.setUserAgent(userAgent);
}

let wsURLs = fs.readFileSync('/firefoxScraper/links.txt', 'utf8').split('\n');

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    let context = await browser.createIncognitoBrowserContext();
    let page = await context.newPage();
    await setUserAgent(page);

    for (let i = 0; i < wsURLs.length && wsURLs[i].length > 0; i++) {

        await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1000)));
        // await page.setRequestInterception(true);

        try {
            await page.goto(wsURLs[i] + "?hl=en");

        }catch (e) { // posible timeout, close context and open a new incognito tab
            await context.close();
            context = await browser.createIncognitoBrowserContext();
            page = await context.newPage();
            await setUserAgent(page);
            continue;
        }

        try {
            await page.waitForSelector('.MetadataCard.AddonMeta-overallRating', {timeout: 5000}); // TimeoutError
        } catch (e) {
            console.log(`element doesn't exist, should exit catch block and close.`)
            console.log(wsURLs[i])
            continue;
        }

        const values = await page.evaluate(() => {

            const title =  document.querySelector(".AddonTitle").firstChild.textContent;

            // 4.7
            const rating = parseFloat(document.querySelector('.AddonMeta-rating-title').textContent.split(" ")[0])

            // '1,786' reviews
            const count = parseInt( document.querySelector('.MetadataCard.AddonMeta-overallRating').childNodes[1].firstChild.textContent.replace(",","") )

            // Alerts & Updates , Web Development
            const categoryNodes = document.querySelectorAll('.AddonMoreInfo-related-category-link')
            let categories = []; categoryNodes.forEach(entry => categories.push(entry.text))
            let category = categories.join(" , ")

            // '123,833' users
            const users = document.querySelector('.MetadataCard.AddonMeta-overallRating').childNodes[0].firstChild.textContent

            const urls = document.querySelector(".AddonMoreInfo-links-contents-list")
            const website = urls.childNodes[0]?.querySelector(".AddonMoreInfo-homepage-link")?.getAttribute("title")
            const email = urls.childNodes[2]?.querySelector(".AddonMoreInfo-support-email")?.href
            const support = urls.childNodes[1]?.querySelector(".AddonMoreInfo-support-link")?.getAttribute("title")

            const version = document.querySelector(".Definition-dd.AddonMoreInfo-version").innerText

            // 13 days ago (Jun 1, 2022)
            const updated = document.querySelector(".Definition-dd.AddonMoreInfo-last-updated").innerText.match(/\((.*)\)/i)[1]

            const size = document.querySelector(".Definition-dd.AddonMoreInfo-filesize").innerText

            let publisher = document.querySelector(".AddonTitle-author a")?.innerText
            if (publisher == ''){ // the author might not have a link
                publisher = document.querySelector(".AddonTitle-author").innerText.replace('by ', '')
            }

            let description =  '';
            description = document.querySelector(".AddonDescription-contents")?.innerText
            if (description == ''){ // not found an about box
                description =  document.querySelector(".Addon-summary")?.innerText
            }

            return {
                webstore: location.href.split("/").at(-2),
                title,
                rating,
                count,
                category,
                users,
                website,
                email,
                support,
                version,
                updated,
                size,
                publisher,
                description
            }
        });

        if (i % 5 == 0) {
            console.log(values)
            console.log("Scraping " + i)
        }
        if (i % 1000 == 0) {
            await context.close();
            context = await browser.createIncognitoBrowserContext();
            page = await context.newPage();
            await setUserAgent(page);
        }

        // const stmt = db.prepare("INSERT INTO extensions (webstoreID, title, rating, count, category, users, website, email, support, version, updated, size, publisher, description, browser) " +
        //     "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,'Firefox')");
        // stmt.run(
        //     values['webstore'],
        //     values['title'],
        //     values['rating'],
        //     values['count'],
        //     values['category'],
        //     values['users'],
        //     values['website'],
        //     values['email']??null,
        //     values['support']??null,
        //     values['version'],
        //     values['updated'],
        //     values['size'],
        //     values['publisher'],
        //     values['description'],
        // );

        // stmt.finalize();

    }

    await context.close();
    await browser.close();


})();
