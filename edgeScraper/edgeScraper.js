import { Cluster } from "puppeteer-cluster";
import fs from "fs";

import { getExtensionDetails } from "./edgeExtDetails.js";
import { addDetails } from "../databaseManagment/addDetails.js";

/// FUNCIÓN PARA AÑADIR DETALLES DE EXTENSIÓN A LA BBDD
// let addDetails = (details) => {
//   // insert the document
//   const db = mongojs("extensionsDetails", ["edge"]);
//   db.edge.insert(details, async (err, result) => {
//     if (err) {
//       console.log("ERROR: inserción a BBDD: " + err);
//     } else {
//       console.log("Extensión insertada correctamente: " + JSON.stringify(details));
//     }

//     await db.close();
//   });
// };

const extensions = process.argv[2]; // Número de extensiones que se quiere scrapear

console.time("[EDGE] == Tiempo para scrapear " + extensions + " extensiones");
console.log("[EDGE] == Scraping initialized");

(async () => {
  
  // PUPPETEER-CLUSTER: opciones de arranque
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT, // Incognito pages
    maxConcurrency: 3, // Cuantas extensiones scrapear en cada repetición
    puppeteerOptions: {
      // headless: false,
      // defaultViewport: false,
    },
  });
  
  // COMIENZO DEL PROCESO DE SCRAPEO
  let extensionsInfo = []; // Lista que guardará la información de cada extensión
  await cluster.task(async ({ page, data: url }) => {
    await page.goto(url);
    
    // Conseguir los atributos de la extensión
    const extensionDetails = await getExtensionDetails(page);
    
    // Añadir la información a la lista
    extensionsInfo.push(extensionDetails);

    // Añadir información a la BBDD
    addDetails(extensionDetails, "edge");
    
  });
  
  /// PROCESO PARA INSERTAR LINKS AL QUEUE DEL CLUSTER
  fs.readFile("./edgeScraper/edgeLinks.txt", "utf8", (err, data) => {
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
  
  await cluster.idle();
  await cluster.close();
  
  // Preparar la lista para añadirla a extensionsInfo.json
  extensionsInfo = JSON.stringify(extensionsInfo, 0, 2);
  
  // Guardar los datos en un fichero .json
  fs.writeFileSync("./edgeScraper/edgeExtensions.json", extensionsInfo);
  
  console.log("[EDGE] == Scraping finalizado.");
  console.timeEnd("[EDGE] == Tiempo para scrapear " + extensions + " extensiones");
})();