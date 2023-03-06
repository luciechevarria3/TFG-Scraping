// AQUÍ SE CREARÁN LOS MÉTODOS RELACIONADOS CON EL SCRAPEO DE ATRIBUTOS DE EXTENSIONES DE EDGE:
// Nombre, creador, categoría, rating, about, imagen, disponibilidad

/**
 * Función para recuperar la información principal de una extensión desde su página.
 * Nombre, creador, categoría, rating, about, imagen, instalaciones activas.
 * @returns Objeto extension con información más relevante de la extensión.
 */
export async function getExtensionInfo(page) {
  try {

    // Esperamos a que toda la información que queremos cargue en la página
    await page.waitForSelector('div [role=main] img', {timeout: 4000});

    let extensionInfo = await page.evaluate(() => {
      /* Información principal */
      document.querySelector('#readMore').click();  // Hacer click para poder conseguir todo el texto de la descripción
      const infoDiv = document.querySelector('[role=main]').children[1];  // Guardar la referencia al div que contiene información importante de la extensión
      const name = infoDiv.querySelector('h1').textContent; // Nombre de la extensión
      const publisher = infoDiv.querySelector('#PublisherWebsiteUri1').textContent; // Nombre del publisher
      const category = infoDiv.querySelector('#categoryText').textContent;  // Categoría de la extensión
      const rating = infoDiv.querySelectorAll('div')[1].querySelector('div').querySelector('div').querySelector('div').getAttribute('aria-label');  // Rating de la extensión
      const about = document.querySelector('[role=main]').children[3].querySelector('div').children[1].querySelector('div').querySelector('pre').textContent; // Descripción de la extensión
      const img = infoDiv.querySelector('img').src; // Guardar el src de la imagen de la extensión
      const activeInstalls = infoDiv.querySelector('#activeInstallText').textContent; // Número de instalaciones activas
      const extension = {
        name: name,
        publisher: publisher,
        category: category,
        rating: rating,
        about: about,
        imageURL: img,
        activeInstalls: activeInstalls
      };
      return extension;
    });

    extensionInfo = JSON.stringify(extensionInfo, 0, 2);

    return extensionInfo;

  } catch (error) {
    console.error("ERROR: extensionsAttributes.js - getExtensionInfo().");
    return '{"null": "error null"}'
  }
}