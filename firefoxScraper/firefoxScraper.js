import { Cluster } from 'puppeteer-cluster';
import fs from 'fs';

(async () => {
  /// CREATE A CLUSTER
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 4,
    // puppeteerOptions: {headless: false},
  });

  const extensions = [];  // Lista con la información de todas las extensiones

  /// DEFINIR UNA TASK: IR A LA PÁGINA Y SCRAPEAR ATRIBUTOS DE LA EXTENSIÓN
  await cluster.task(async ({ page, data: url}) => {
    try { // Intenta ir a la página de la extensión
      await page.goto(url);
      await page.waitForSelector('.Addon-header', {timeout: 3000});
    } catch (error) {
      extensions.push({
        webstore: "Firefox Browser Add-Ons",
        url,
        error: "Extension Not Available",
      });
      return [];
    }

    /// PROCESO DE SCRAPING DE ATRIBUTOS DE EXTENSIÓN
    let extensionDetails = await page.evaluate(() => {

      // Nombre de la extensión
      const name = document.querySelector(".AddonTitle").firstChild.textContent;

      // URL de la extensión
      const url = document.URL;

      // Publisher de la extensión
      let publisher = document.querySelector(".AddonTitle-author a")?.innerText;
      if (publisher == "") { // the author might not have a link
        publisher = document
          .querySelector(".AddonTitle-author")
          .innerText.replace("by ", "");
      }

      // Categoría de la extensión
      const categoryNodes = document.querySelectorAll(
        ".AddonMoreInfo-related-category-link"
      );
      let categories = [];
      categoryNodes.forEach((entry) => categories.push(entry.text));
      let category = categories.join(" , ");

      // Rating de la extensión
      const rating = parseFloat(document.querySelector('.AddonMeta-rating-title').textContent.split(" ")[0]);

      // Nº de reviews de la extensión
      const reviews = parseInt( document.querySelector('.MetadataCard.AddonMeta-overallRating').childNodes[1].firstChild.textContent.replace(",","") )

      // Fecha de última actualización
      const lastUpdated = document.querySelector(".Definition-dd.AddonMoreInfo-last-updated").innerText.match(/\((.*)\)/i)[1]

      // Imagen de la extensión
      const image = document.querySelector('img').src;

      // Nª de veces que la ext. ha sido instalada
      let installs = document.querySelector('.MetadataCard.AddonMeta-overallRating').childNodes[0].firstChild.textContent;
      installs = parseInt(installs);

      // Descripción de la extensión
      let description =  '';
      description = document.querySelector(".AddonDescription-contents")?.innerText
      if (description == ''){ // not found an about box
        description =  document.querySelector(".Addon-summary")?.innerText
      };

      return {
        webstore: 'Firefox Browser Add-Ons',
        name,
        url,
        publisher,
        category,
        rating,
        reviews,
        lastUpdated,
        image,
        installs,
        description,
      };

    });

    extensions.push(extensionDetails);

  });

  /// PROCESO DE INSERTAR URLS A LA QUEUE DEL CLUSTER
  const nUrls = 10; // Número de urls de Firefox a scrapear

  fs.readFile("./firefoxScraper/firefoxLinks.txt", "utf8", (err, data) => {
    // Leer las urls de chrome_ids.txt
    if (err) {
      console.error(err);
      return;
    }
    const urls = data.split(/\r?\n/);
    for (let i = 0; i < nUrls; i++) {
      cluster.queue(urls[i]);
    };
  });

  // Shutdown after everything is done
  await cluster.idle();
  await cluster.close();

  /// PROCESO DE ESCRIBIR LA INFORMACIÓN DE LAS EXTENSIONES EN UN FICHERO JSON
  fs.writeFileSync('./firefoxScraper/firefoxExtensions.json', JSON.stringify(extensions, 0, 2));
})();