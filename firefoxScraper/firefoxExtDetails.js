// FIREFOX EXTENSION DETAILS

/**
* Función para conseguir los detalles de extensiones de Chrome (nombre, publisher, descripción, ...).
* @param {*} page 
* @returns Objeto extension con los detalles de la extensión de Firefox.
*/
export async function getExtensionDetails(page) {
  try {

    await page.waitForSelector('.Addon-header', { timeout: 3000 });

  } catch (error) {

    const url = await page.url();

    return {
      webstore: "Firefox Browser Add-Ons",
      url,
      error: "Extension Not Available",
    };
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
    let rating = document.querySelector('.AddonMeta-rating-title').textContent
    rating.includes('Not') ? rating = 0 : rating = parseFloat(rating.split(" ")[0]);
    // if (!rating.includes('Not')) {
    //   rating = parseFloat(rating.split(" ")[0]);
    // }

    // Nº de ratings de la extensión
    let ratedBy = document.querySelector('.MetadataCard.AddonMeta-overallRating').childNodes[1].childNodes[1].textContent;
    ratedBy.includes('No') ? ratedBy = 0 : ratedBy = parseInt(document.querySelector('.MetadataCard.AddonMeta-overallRating').childNodes[1].firstChild.textContent.replace(",", ""));
    // if (!ratedBy.includes('No')) {
    //   ratedBy = parseInt(document.querySelector('.MetadataCard.AddonMeta-overallRating').childNodes[1].firstChild.textContent.replace(",", ""));
    // }

    // Fecha de última actualización
    const lastUpdated = document.querySelector(".Definition-dd.AddonMoreInfo-last-updated").innerText.match(/\((.*)\)/i)[1];

    // Imagen de la extensión
    const image = document.querySelector('img').src;

    // Nª de veces que la ext. ha sido instalada
    let installs = document.querySelector('.MetadataCard.AddonMeta-overallRating').childNodes[0].firstChild.textContent;
    installs = installs.replaceAll(",", "");
    if (installs === "") {
      installs = 0;
    }
    else {
      installs = parseInt(installs);
    }

    // Disponibilidad de la extensión
    let availabiltyText = document.querySelector(".InstallButtonWrapper-download");
    let availability;
    if (availabiltyText) {
      availability = "Available";
    }
    else {
      availability = "Unavailable";
    }

    // Descripción de la extensión
    let description = '';
    description = document.querySelector(".AddonDescription-contents")?.innerText
    if (description == '') { // not found an about box
      description = document.querySelector(".Addon-summary")?.innerText
    };

    // Última vez scrapeado
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let lastScraped = `${day}-${month}-${year} ${time}`;

    return {
      webstore: 'Firefox Browser Add-Ons',
      name,
      url,
      publisher,
      category,
      rating,
      ratedBy,
      lastUpdated,
      image,
      installs,
      availability,
      description,
      lastScraped,
    };

  });

  return extensionDetails;
}