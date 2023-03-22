// AQUÍ SE CREARÁN LOS MÉTODOS RELACIONADOS CON EL SCRAPEO DE ATRIBUTOS DE EXTENSIONES DE EDGE:
// Nombre, creador, categoría, rating, description, imagen, disponibilidad

/**
 * Función para recuperar la información principal de una extensión desde su página.
 * Nombre, creador, categoría, rating, description, imagen, instalaciones activas.
 * @returns Objeto extension con información más relevante de la extensión.
 */
export async function getExtensionInfo(page) {
  try {

    // Esperamos a que toda la información que queremos cargue en la página
    await page.waitForSelector('div [role=main] img', {timeout: 2000});

    let extensionInfo = await page.evaluate(() => {
      /* Información principal */
      try {
        document.querySelector('#readMore').click();  // Hacer click para poder conseguir todo el texto de la descripción
      } catch (error) {
        console.log("La descripción no es muy grande.");
      }
      const infoDiv = document.querySelector('[role=main]').children[1];  // Guardar la referencia al div que contiene información importante de la extensión
      const name = infoDiv.querySelector('h1').textContent; // Nombre de la extensión
      const url = document.URL;
      const publisher = infoDiv.querySelectorAll('div')[2].children[0].textContent; // Nombre del publisher
      const category = infoDiv.querySelector('#categoryText').textContent;  // Categoría de la extensión
      const rating = infoDiv.querySelectorAll('div')[1].querySelector('div').querySelector('div').querySelector('div').getAttribute('aria-label');  // Rating de la extensión
      const description = document.querySelector('pre').textContent; // Descripción de la extensión
      const image = infoDiv.querySelector('img').src; // Guardar el src de la imagen de la extensión
      const installs = infoDiv.querySelector('#activeInstallText').textContent.replace(/[\u202A\u202C]/g,''); // Número de instalaciones activas
      const extension = {
        webstore: 'Microsoft Edge Store',
        name,
        url,
        publisher,
        category,
        rating,
        image,
        installs,
        description,
      };
      return extension;
    });

    return extensionInfo;

  } catch (error) {
    const pageURL = await page.url()
    console.error("ERROR: extensionsAttributes.js - getExtensionInfo(). - " + pageURL);
    return {errorPage: pageURL + " PÁGINA NO DISPONIBLE"}
  }
}