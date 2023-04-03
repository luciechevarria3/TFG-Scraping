import { Cluster } from 'puppeteer-cluster';
import fs from 'fs';

import { getExtensionDetails } from './firefoxExtDetails.js';
import { addDetails } from "../databaseManagment/dbManagement.js";

/// FUNCIÓN PARA AÑADIR DETALLES DE EXTENSIÓN A LA BBDD
// let addDetails = (details) => {
//   // insert the document
//   const db = mongojs("extensionsDetails", ["firefox"]);
//   db.firefox.insert(details, async (err, result) => {
//     if (err) {
//       console.log("ERROR: inserción a BBDD: " + err);
//     } else {
//       console.log("Extensión insertada correctamente: " + JSON.stringify(details));
//     }

//     await db.close();
//   });
// };


const extensions = process.argv[2]; // Número de urls de firefox a scrapear

console.time("[FIREFOX] == Tiempo para scrapear " + extensions + " extensiones");
console.log("[FIREFOX] == Scraping initialized");

(async () => {
  // PUPPETEER-CLUSTER: opciones de arranque
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 3,
    // puppeteerOptions: {headless: false},
  });

  let extensionsInfo = [];  // Lista con la información de todas las extensiones

  /// DEFINIR UNA TASK: IR A LA PÁGINA Y SCRAPEAR ATRIBUTOS DE LA EXTENSIÓN
  await cluster.task(async ({ page, data: url}) => {

    await page.goto(url);

    // Conseguir información de la extensión
    const extensionDetails = await getExtensionDetails(page);

    // Añadirla a la lista de extensiones
    extensionsInfo.push(extensionDetails);

    // Añadir información a la BBDD
    addDetails(extensionDetails);

  });

  /// PROCESO DE INSERTAR URLS A LA QUEUE DEL CLUSTER

  fs.readFile("./firefoxScraper/firefoxLinks.txt", "utf8", (err, data) => {
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

  // Preparar la lista para añadirla a extensionsInfo.json
  extensionsInfo = JSON.stringify(extensionsInfo, 0, 2);

  /// PROCESO DE ESCRIBIR LA INFORMACIÓN DE LAS EXTENSIONES EN UN FICHERO JSON
  fs.writeFileSync('./firefoxScraper/firefoxExtensions.json', extensionsInfo);

  console.log("[FIREFOX] == Scraping finalizado.");
  console.timeEnd("[FIREFOX] == Tiempo para scrapear " + extensions + " extensiones");
})();