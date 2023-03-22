import { Cluster } from 'puppeteer-cluster';
import fs from 'fs';

import { getExtensionDetails } from './firefoxExtDetails.js';

const extensions = 10; // Número de urls de firefox a scrapear

console.time("Tiempo para scrapear " + extensions + " extensiones");

(async () => {
  // PUPPETEER-CLUSTER: opciones de arranque
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 5,
    // puppeteerOptions: {headless: false},
  });

  let extensionsInfo = [];  // Lista con la información de todas las extensiones

  /// DEFINIR UNA TASK: IR A LA PÁGINA Y SCRAPEAR ATRIBUTOS DE LA EXTENSIÓN
  await cluster.task(async ({ page, data: url}) => {

    await page.goto(url);

    const extensionDetails = await getExtensionDetails(page);

    extensionsInfo.push(extensionDetails);

  });

  /// PROCESO DE INSERTAR URLS A LA QUEUE DEL CLUSTER

  fs.readFile("./firefoxScraper/firefoxLinks.txt", "utf8", (err, data) => {
    // Leer las urls de chrome_ids.txt
    if (err) {
      console.error(err);
      return;
    }
    const urls = data.split(/\r?\n/);
    for (let i = 0; i < extensions; i++) {
      cluster.queue(urls[i]);
    };
  });

  // Shutdown after everything is done
  await cluster.idle();
  await cluster.close();

  /// PROCESO DE ESCRIBIR LA INFORMACIÓN DE LAS EXTENSIONES EN UN FICHERO JSON
  fs.writeFileSync('./firefoxScraper/firefoxExtensions.json', JSON.stringify(extensionsInfo, 0, 2));

  console.log("[FIREFOX] == Scraping finalizado.");
  console.timeEnd("Tiempo para scrapear " + extensions + " extensiones");
})();