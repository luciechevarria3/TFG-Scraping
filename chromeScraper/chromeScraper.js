import { Cluster } from "puppeteer-cluster";
import fs from "fs";

import { getExtensionDetails } from "./chromeExtDetails.js";
import { addDetails } from "../databaseManagment/dbManagement.js";

const extensions = process.argv[2]; // Número de urls de chrome a scrapear


console.time("[CHROME] == Tiempo para scrapear " + extensions + " extensiones");
console.log("[CHROME] == Scraping initialized");

(async () => {

  // PUPPETEER-CLUSTER: opciones de arranque
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 2,
    puppeteerOptions: { headless: false, defaultViewport: null }
  });

  let extensionsInfo = [];  // Lista con información de todas las extensiones

  /// PROCESO QUE SE EJECUTARÁ PARA CADA EXTENSIÓN
  await cluster.task(async ({ page, data: url }) => {

    await page.goto(url + '?hl=en');

    // Conseguir información de la extensión
    const extensionDetails = await getExtensionDetails(page);

    // Añadir información a la lista
    extensionsInfo.push(extensionDetails);

    // Añadir información a la BBDD
    addDetails(extensionDetails);

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
      for (let i = 0; i < extensions; i++) { cluster.queue(urls[i]); }
    }

  });

  // Shutdown after everything is done
  await cluster.idle();
  await cluster.close();

  /// PROCESO AÑADIR DETALLES DE EXTENSIÓN A "chromeExtensions.json"
  // Preparar la lista para añadirla a edgeExtensions.json
  extensionsInfo = JSON.stringify(extensionsInfo, 0, 2);

  // Guardar los datos en un fichero .json
  fs.writeFileSync("./chromeScraper/chromeExtensions.json", extensionsInfo);

  /// FIN DE SCRAPEO
  console.log("[CHROME] == Scraping finalizado.");
  console.timeEnd("[CHROME] == Tiempo para scrapear " + extensions + " extensiones");
})();
