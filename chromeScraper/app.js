import { Cluster } from "puppeteer-cluster";
import fs from "fs";
// const mongojs = require("mongojs");

// let addDetails = (details) => {
//   // insert the document
//   const db = mongojs("mongodb://127.0.0.1:27017/extensions", ["details"]);
//   db.details.insert(details, async (err, result) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(details);
//     }

//     await db.close();
//   });
// };

(async () => {
  // Create a cluster with 2 workers
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 4,
    // puppeteerOptions: {headless: true}
  });

  // Define a task (in this case: screenshot of page)
  await cluster.task(async ({ page, data: url }) => {
    try {
      await page.goto(url);
      await page.waitForSelector("div.e-f-n-Va", { timeout: 5000 }); // TimeoutError
    } catch (e) {
      return [];
    }
    /// PROCESO DE SCRAPING DE INFORMACIÓN DE EXTENSIÓN DE CHROME
    let extensionDetails = await page.evaluate(() => {
      const nameAndImg = document.querySelector('.e-f-n-Va');
      // Nombre de la extensión
      const name = nameAndImg.querySelector('h1').textContent;
      // URL de la extensión
      const url = document.URL;
      // Div que contiene info de publisher, lastUpdate
      const additionalInfo = document.querySelector('.C-b-p-D-J');
      // Publisher de la extensión
      const publisher = additionalInfo.children[1].textContent;
      // Última vez que la extensión ha sido actualizada
      const lastUpdated = additionalInfo.children[6].textContent;
      // Categoría de la extensión
      const category = nameAndImg.querySelector('.e-f-y').textContent
      // Rating (en formato texto) de la extensión
      const rating = nameAndImg.querySelector('.Y89Uic').title;
      // TODO: about
      // TODO: imageURL
      const imageURL = titleAndImg.querySelector('img').src;
      // TODO: activeInstalls





      // const offeredby = document.querySelector("span.C-b-p-D-R").innerText;
      // let publisher;

      // if (offeredby == "Offered by") {
      //   publisher = document.querySelector("span.C-b-p-D-Xe").innerText;
      // } else {
      //   // may be empty
      //   publisher = document.querySelector("a.C-b-p-rc-D-R")?.href;
      // }

      // // click on 'Read More'
      // document
      //   .querySelector("div.C-b-p-j-Oa-ArRF3d-mb-c.g-c.g-c-aSvl1d")
      //   .click();
      // const description = document.querySelector(".C-b-p-j-Pb").innerText;

      return {
        webstore: location.href.split("/").at(-1).split("?")[0],
        // publisher,
        // description,
      };
    });

    console.log(JSON.stringify(extensionDetails));

    // addDetails(this.extensionDetails);
  });

  /// PROCESO PARA AÑADIR LAS URLS A LA QUEUE DEL CLUSTER PUPPETEER
  // let from = myArgs[0];
  // let to = myArgs[1];
  const nUrls = 3; // Número de urls de chrome a scrapear

  fs.readFile("./chromeScraper/chrome_ids.txt", "utf8", (err, data) => {
    // Leer las urls de chrome_ids.txt
    if (err) {
      console.error(err);
      return;
    }
    const urls = data.split(/\r?\n/);
    for (let i = 0; i < nUrls; i++) {
      cluster.queue(urls[i]);
    }
    // const lines = data.split(/\r?\n/).slice(0, -1);
    // lines.forEach((line, idx) => {
    //   if (idx >= from && idx < to)
    //     cluster.queue(line);
    //     console.log(line);
    // });
  });

  // Shutdown after everything is done
  await cluster.idle();
  await cluster.close();
})();