// EDGE EXTENSION DETAILS

/**
 * Función para recuperar la información principal de una extensión desde su página.
 * Nombre, creador, categoría, rating, description, imagen, instalaciones activas.
 * @returns Objeto extension con los detalles de la extensión de Edge.
 */
export async function getExtensionDetails(page) {
  try {
    // Esperamos a que toda la información que queremos cargue en la página
    await page.waitForSelector("div [role=main] img", { timeout: 2000 });

    let extensionInfo = await page.evaluate(() => {
      /* Información principal */
      try {
        document.querySelector("#readMore").click(); // Hacer click para poder conseguir todo el texto de la descripción
      } catch (error) {
        console.log("La descripción no es muy grande.");
      }

      const infoDiv = document.querySelector("[role=main]").children[1]; // Guardar la referencia al div que contiene información importante de la extensión
      const name = infoDiv.querySelector("h1").textContent; // Nombre de la extensión
      const url = document.URL;
      const publisher = document.querySelector(".c0146").firstChild.textContent // Nombre del publisher
      const category = infoDiv.querySelector("#categoryText").textContent.toLowerCase(); // Categoría de la extensión
      const rating = parseInt(infoDiv.querySelectorAll("div")[5].getAttribute("aria-label").split(" ")[1]); // Rating de la extensión
      const ratedBy = parseInt(infoDiv.querySelectorAll("div")[5].getAttribute("aria-label").split(" ")[7]); // Nº personas que han valorado
      const description = document.querySelector("pre").textContent; // Descripción de la extensión
      const image = infoDiv.querySelector("img").src; // Guardar el src de la imagen de la extensión

      let installsText = infoDiv.querySelector("#activeInstallText").textContent.replaceAll(/([a-zA-Z\s])/g, ""); // Número de instalaciones activas
      let installs = installsText.replace(",", "");
      installs = installs.replaceAll(/[\u{0080}-\u{FFFF}]/gu, "");
      installs = parseInt(installs);

      let availability;
      try {
        availability = document.querySelector(".c01100").textContent;
        if (availability.includes("Get")) {
          availability = "Available";
        }
        else {
          availability = "Unavailable";
        }
      }

      catch (error) {
        availability = "AVAILABILITY ERROR";
      }

      // Última vez actualizado
      const lastUpdated = document.querySelector("span#lastUpdatedOnHeader").textContent;

      // Última vez scrapeado
      const date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      var time =
        date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

      let lastScraped = `${day}-${month}-${year} ${time}`;

      const extension = {
        webstore: "Microsoft Edge",
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
      return extension;
    });

    return extensionInfo;
  } catch (error) {
    const url = await page.url();
    return {
      webstore: "Microsoft Edge Store",
      url,
      error: "Extension Not Available",
    };
  }
}
