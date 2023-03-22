/// CHROME EXTENSION DETAILS

/**
* Función para conseguir los detalles de extensiones de Chrome (nombre, publisher, descripción, ...).
* @param {*} page 
* @returns Objeto extension con los detalles de la extensión de Chrome.
*/
export async function getExtensionDetails(page) {
  try {
    
    await page.waitForSelector("div.e-f-n-Va", { timeout: 3000 }); // TimeoutError

  } catch (e) {

    return {
      webstore: "Chrome Web Store",
      url,
      error: "Extension Not Available",
    };
  }
  
  /// PROCESO DE SCRAPING DE INFORMACIÓN DE EXTENSIÓN DE CHROME
  let extensionDetails = await page.evaluate(() => {
    
    const nameAndImg = document.querySelector(".e-f-n-Va");
    
    // Nombre de la extensión
    const name = nameAndImg.querySelector("h1").textContent;
    
    // URL de la extensión
    const url = document.URL;
    
    // Div que contiene info de publisher, lastUpdate
    const additionalInfo = document.querySelector(".C-b-p-D-J");
    
    // Publisher de la extensión
    const publisher = additionalInfo.children[1].textContent;
    
    // Última vez que la extensión ha sido actualizada
    const lastUpdated = additionalInfo.children[6].textContent;
    
    // Categoría de la extensión
    const category = nameAndImg.querySelector(".e-f-y").textContent;
    
    // Rating (en formato texto) de la extensión
    const rating = nameAndImg.querySelector(".Y89Uic").title;
    
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
    var availability = "Disponible";
    if (document.querySelector(".webstore-test-button-label").textContent != "Añadir a Chrome") {
      availability = "No disponible";
    };
    
    return {
      webstore: "Chrome Web Store",
      name,
      url,
      publisher,
      category,
      rating,
      lastUpdated,
      image,
      installs,
      availability,
      description,
    };
    
  });
  
  return extensionDetails;
}