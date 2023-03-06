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

  // Viajamos a la página mediante la url
  await page.goto(url);

  // Conseguir los atributos de la extensión
  const extensionInfo = await getExtensionInfo(page);

  // Guardar los datos en un fichero .json
  fs.writeFileSync('./edgeScraper/extensionInfo.json', extensionInfo);

  // Cerramos el navegador
  await browser.close();
  console.log("[EDGE] - Scraping finalizado.");
})();