/// CHROME EXTENSION DETAILS

/**
* Función para conseguir los detalles de extensiones de Chrome (nombre, publisher, descripción, ...).
* @param {*} page 
* @returns Objeto extension con los detalles de la extensión de Chrome.
*/
export async function getExtensionDetails(page) {
  try {

    await page.waitForSelector("div.e-f-n-Va", { timeout: 5000 }); // TimeoutError

  } catch (e) {

    const url = await page.url();

    return {
      webstore: "Chrome Web Store",
      url,
      error: "Extension Not Available",
    };
  }

  /// PROCESO DE SCRAPING DE INFORMACIÓN DE EXTENSIÓN DE CHROME
  await page.waitForSelector(".webstore-test-button-label")
  let extensionDetails = await page.evaluate(() => {

    const nameAndImg = document.querySelector(".e-f-n-Va");

    // Nombre de la extensión
    const name = nameAndImg.querySelector("h1").textContent;

    // URL de la extensión
    const url = document.URL;

    // Div que contiene info de publisher, lastUpdate
    const additionalInfo = document.querySelector(".C-b-p-D-J");

    // Publisher de la extensión
    let publisher = additionalInfo.querySelector('.C-b-p-D-Xe').textContent;
    if (!isNaN(parseFloat(publisher))) {
      publisher = document.querySelector('.e-f-Ri-G .e-f-y').textContent;
    }
    // const publisher = additionalInfo.children[1].textContent;

    // Última vez que la extensión ha sido actualizada
    const lastUpdated = additionalInfo.querySelector('.C-b-p-D-Xe.h-C-b-p-D-xh-hh').textContent;

    // Categoría de la extensión
    const category = document.querySelector('.e-f-yb-w .e-f-y').textContent;

    // Rating (en formato texto) de la extensión
    const ratingArray = nameAndImg.querySelector(".Y89Uic").title.split(" ");

    // Normalizacion del rating para la BBDD
    const checkingRating = parseInt(ratingArray[2]);
    let rating;
    isNaN(checkingRating) ? rating = 0 : rating = checkingRating;

    const ratedBy = parseInt(nameAndImg.querySelector(".nAtiRe").textContent);

    // Descripción de la extensión
    let description = document.querySelector("[itemprop=description");
    description = description.textContent + description.nextSibling.textContent;

    // URL de la imagen de la extensión
    const image = document.querySelector("img").src;

    // Número total de descargas de la extensión
    let installs;
    try {
      installs = document
        .querySelector(".e-f-ih")
        .textContent.match(/\d+\+?/g)
        .join(".");
    } catch (error) {
      installs = 'Unavailable';
    }

    // Disponibilidad de la extensión
    let availability;
    document.querySelector(".webstore-test-button-label").textContent.includes("Add to Chrome") ? availability = "Available" : availability = "Not available";

    // Última vez scrapeado
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let lastScraped = `${day}-${month}-${year} ${time}`;

    return {
      webstore: "Chrome Web Store",
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