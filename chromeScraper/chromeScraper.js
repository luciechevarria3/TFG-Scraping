import { Cluster } from "puppeteer-cluster";
import fs from "fs";
import { getExtensionDetails } from "./chromeExtDetails.js";
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

const extensions = process.argv[2]; // Número de urls de chrome a scrapear

console.time("[CHROME] == Tiempo para scrapear " + extensions + " extensiones");
console.log("[CHROME] == Scraping initialized");

(async () => {

  // PUPPETEER-CLUSTER: opciones de arranque
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 5,
    puppeteerOptions: {headless: false}
  });
  
  let extensionsInfo = [];  // Lista con información de todas las extensiones
  
  // Define a task (in this case: screenshot of page)
  await cluster.task(async ({ page, data: url }) => {

    await page.goto(url);
    
    const extensionDetails = await getExtensionDetails(page);
    
    extensionsInfo.push(extensionDetails);
    
    // addDetails(this.extensionDetails);

  });
  
  /// PROCESO PARA AÑADIR LAS URLS A LA QUEUE DEL CLUSTER PUPPETEER  
  fs.readFile("./chromeScraper/chromeLinks.txt", "utf8", (err, data) => {
    // Leer las urls de chrome_ids.txt
    if (err) {
      console.error(err);
      return;
    }
    const urls = data.split(/\r?\n/);

    if (extensions == 0) {  // CASO PARA SCRAPEAR TODAS LAS EXTENSIONES DISPONIBLES
      for (let url of urls) { cluster.queue(url) };
    }
    else {                  // CASO PARA SCRAPEAR LAS EXTENSIONES QUE NOS PIDEN
      for (let i = 0; i<extensions; i++ ) { cluster.queue(urls[i]); }
    }

  });
  
  // Shutdown after everything is done
  await cluster.idle();
  await cluster.close();
  
  // Preparar la lista para añadirla a edgeExtensions.json
  extensionsInfo = JSON.stringify(extensionsInfo, 0, 2);
  
  // Guardar los datos en un fichero .json
  fs.writeFileSync("./chromeScraper/chromeExtensions.json", extensionsInfo);

  console.log("[CHROME] == Scraping finalizado.");
  console.timeEnd("[CHROME] == Tiempo para scrapear " + extensions + " extensiones");
})();
