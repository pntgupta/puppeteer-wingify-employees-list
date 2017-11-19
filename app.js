const puppeteer = require('puppeteer');
const fs = require('fs');

const GOOGLE_SEARCHBOX = '#lst-ib';
const GOOGLE_SEARCH_RESULT = (num) => `#rso > div:nth-of-type(${num}) > div > div > div > div > h3 > a`;
const WINGIFY_CAREER = `#top_header  nav ul.navigation > li:nth-of-type(2) > a`;
const WINGIFY_TEAM_MEMBERS = (num) => `.section-team .team-list li:nth-of-type(${num})  div.name`;


(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('http://google.com');

    await page.click(GOOGLE_SEARCHBOX);
    await page.keyboard.type('wingify');
    await page.keyboard.press('Enter');
    await page.waitForSelector(GOOGLE_SEARCH_RESULT(1));

    console.log("Google Search Completed.");

    await page.click(GOOGLE_SEARCH_RESULT(1));
    await page.waitForSelector(WINGIFY_CAREER);

    console.log("Wingify Site Opened");

    await page.click(WINGIFY_CAREER);
    await page.waitForSelector(WINGIFY_TEAM_MEMBERS(1));

    console.log("Wingify Career page Opened");

    let wfs = fs.createWriteStream('./member-list.txt');
    for (let i = 1; true; i++) {
        let memberName = await page.evaluate((sel) => {
            let nameDOMElement = document.querySelector(sel);
            return nameDOMElement ? nameDOMElement.innerText : null;
        }, WINGIFY_TEAM_MEMBERS(i));

        if (!memberName) {
            console.log(`TOTAL EMPLOYEES: ${i - 1}`);
            wfs.write(`\n\nTOTAL EMPLOYEES: ${i - 1}`)
            break;
        }
        console.log(memberName);
        wfs.write(`${memberName}\n`);
    }

    await browser.close();
})();
