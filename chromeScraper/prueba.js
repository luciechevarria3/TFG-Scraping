import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({headless: false,});
  const page1 = await browser.newPage();
  await page1.goto('https://chrome.google.com/webstore/detail/%C3%A9cole-camille-j-lerouge-s/lhfpokdnpoeblioniflbmagncpdlhdkk');
  await page1.setViewport({width: 1080, height: 1024});

  const page2 = await browser.newPage();
  await page2.goto('https://chrome.google.com/webstore/detail/%C3%A7erez-edit%C3%B6r%C3%BC/mhapeibfgdckgclagaciaeacbmleogkl');
  await page2.setViewport({width: 1080, height: 1024});

  const page3 = await browser.newPage();
  await page3.goto('https://chrome.google.com/webstore/detail/%C3%A8-maiuscola-accentata/bmegikflmmkgpgfjnmelombinkcjcpgi');
  await page3.setViewport({width: 1080, height: 1024});

  // await browser.close();
})();