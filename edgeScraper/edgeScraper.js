import { Cluster } from "puppeteer-cluster";
import fs from "fs";
import { getExtensionDetails } from "./edgeExtDetails.js";

const extensions = 10; // Número de extensiones que se quiere scrapear

console.time("Tiempo para scrapear " + extensions + " extensiones");
(async () => {
  
  // PUPPETEER-CLUSTER: opciones de arranque
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT, // Incognito pages
    maxConcurrency: 5, // Cuantas extensiones scrapear en cada repetición
    puppeteerOptions: {
      headless: false,
      defaultViewport: false,
    },
  });
  
  // COMIENZO DEL PROCESO DE SCRAPEO
  let extensionsInfo = []; // Lista que guardará la información de cada extensión
  await cluster.task(async ({ page, data: url }) => {
    await page.goto(url);
    
    // Conseguir los atributos de la extensión
    const extensionInfo = await getExtensionDetails(page);
    
    // Añadir la información a la lista
    extensionsInfo.push(extensionInfo);
    
  });
  
  /// PROCESO PARA INSERTAR LINKS AL QUEUE DEL CLUSTER
  fs.readFile("./edgeScraper/edgeLinks.txt", "utf8", (err, data) => {
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
  
  await cluster.idle();
  await cluster.close();
  
  // Preparar la lista para añadirla a extensionsInfo.json
  extensionsInfo = JSON.stringify(extensionsInfo, 0, 2);
  
  // Guardar los datos en un fichero .json
  fs.writeFileSync("./edgeScraper/edgeExtensions.json", extensionsInfo);
  
  console.log("[EDGE] == Scraping finalizado.");
  console.timeEnd("Tiempo para scrapear " + extensions + " extensiones");
})();