import { Cluster } from 'puppeteer-cluster';
import fs from 'fs';

(async () => {
  /// CREATE A CLUSTER
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 4,
    puppeteerOptions: {headless: false},
  });

  const extensions = [];  // Lista con la información de todas las extensiones

  /// DEFINIR UNA TASK: IR A LA PÁGINA Y SCRAPEAR ATRIBUTOS DE LA EXTENSIÓN
  await cluster.task(async ({ page, data: url}) => {
    try { // Intenta ir a la página de la extensión
      await page.goto(url);
    } catch (error) {
      extensions.push({
        webstore: "Chrome Web Store",
        url,
        error: "Página no disponible",
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
      const rating = parseFloat(document.querySelector('.AddonMeta-rating-title').textContent.split(" ")[0])

      // Fecha de última actualización
      const lastUpdated = document.querySelector(".Definition-dd.AddonMoreInfo-last-updated").innerText.match(/\((.*)\)/i)[1]

      // Imagen de la extensión
      const image = document.querySelector('img').src;

      // Nª de veces que la ext. ha sido instalada
      const installs = document.querySelector('.MetadataCard.AddonMeta-overallRating').childNodes[0].firstChild.textContent

      // Disponibilidad de la extensión
    })
  })

})()