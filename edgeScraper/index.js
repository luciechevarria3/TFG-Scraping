import puppeteer from 'puppeteer';
import fs from 'fs';
import { getExtensionInfo } from './extensionsAttributes.js';

(async () => {

  // URL para hacer una prueba: Editor Microsoft
  const url = "https://microsoftedge.microsoft.com/addons/detail/editor-microsoft-correct/hokifickgkhplphjiodbggjmoafhignh";

  // Abrir el browser en modo incógnito
  const browser = await puppeteer.launch({
    headless: false,
  });
  const context = await browser.createIncognitoBrowserContext();

  // Creamos una nueva pestaña de incógnito
  const page = await context.newPage();

  // PROCESO DE OBTENCIÓN DE LINKS
  // Conseguir los links de edgeExtensions.json
  let urls = fs.readFileSync('edgeScraper/edgeExtensions.json', 'utf-8');

  // Parsearlos a un objeto Javascript
  urls = JSON.parse(urls);
  urls = urls['links']; // Ahora tenemos la lista de links en la variable urls

  let extensionsInfo = [];  // Lista que guardará la información de cada extensión
  // Proceso de viajar a cada página de extensión y guardar su información
  for (let i = 0; i < 5; i++) {

    // Viajamos a la página mediante la url
    await page.goto(urls[i]);
  
    // Conseguir los atributos de la extensión
    const extensionInfo = await getExtensionInfo(page);

    // Añadir la información a la lista
    extensionsInfo.push(extensionInfo);
  
  }

  // Preparar la lista para añadirla a extensionsInfo.json
  extensionsInfo = JSON.stringify(extensionsInfo, 0, 2);

  // Guardar los datos en un fichero .json
  fs.writeFileSync('./edgeScraper/extensionInfo.json', extensionsInfo);

  // Cerramos el navegador
  await browser.close();
  console.log("[EDGE] - Scraping finalizado.");
})();