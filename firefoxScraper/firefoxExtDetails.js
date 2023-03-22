// FIREFOX EXTENSION DETAILS

/**
* Función para conseguir los detalles de extensiones de Chrome (nombre, publisher, descripción, ...).
* @param {*} page 
* @returns Objeto extension con los detalles de la extensión de Firefox.
*/
export async function getExtensionDetails(page) {
  try {
    
    await page.waitForSelector('.Addon-header', {timeout: 3000});
    
  } catch (error) {
    
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
    
    return extensionDetails;
  }