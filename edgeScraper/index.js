import puppeteer from "puppeteer";
import { Cluster } from "puppeteer-cluster";
import fs from "fs";
import { getExtensionInfo } from "./extensionsAttributes.js";

const extensions = 100; // Número de extensiones que se quiere scrapear

console.time("Tiempo para scrapear " + extensions + " extensiones");
(async () => {
  // Conseguir los links de edgeExtensions.json
  let urls = fs.readFileSync("edgeScraper/edgeExtensions.json", "utf-8");

  // Parsearlos a un objeto Javascript
  urls = JSON.parse(urls);
  urls = urls["links"]; // Ahora tenemos la lista de links en la variable urls

  // PUPPETEER-CLUSTER: opciones de arranque
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE, // Incognito pages
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
    const extensionInfo = await getExtensionInfo(page);

    // Añadir la información a la lista
    extensionsInfo.push(extensionInfo);

  });

  
  // Metemos en la queue todas las páginas de las extensiones
  for (let i = 0; i < extensions; i++) {
    cluster.queue(urls[i]);
  }

  await cluster.idle();
  await cluster.close();

  // Preparar la lista para añadirla a extensionsInfo.json
  extensionsInfo = JSON.stringify(extensionsInfo, 0, 2);

  // Guardar los datos en un fichero .json
  fs.writeFileSync("./edgeScraper/extensionInfo.json", extensionsInfo);
  
  console.log("[EDGE] == Scraping finalizado.");
  console.timeEnd("Tiempo para scrapear " + extensions + " extensiones");
})();