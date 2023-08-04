import mongojs from "mongojs";

/**
 * Función para actualizar los detalles de una extensión de la BBDD.
 * @param {*} webstore Webstore de la extensión
 * @param {*} url Url de la extensión
 * @param {*} detailName Nombre del detalle a actualizar
 * @param {*} newDetail Nuevo valor con el que se va a actualizar la BBDD.
 */
const updateDetails = (webstore, url, detailName, newDetail) => {
  const db = mongojs("extensionsDetails", ["extensions"]);
  switch (detailName) {
    case 'name':
      db.extensions.update({ webstore: webstore, url: url }, { $set: { name: newDetail } }, function () {
        db.close();
      });
      break;

    case 'url':
      db.extensions.update({ webstore: webstore, url: url }, { $set: { url: newDetail } }, function () {
        db.close();
      });
      break;

    case 'publisher':
      db.extensions.update({ webstore: webstore, url: url }, { $set: { publisher: newDetail } }, function () {
        db.close();
      });
      break;

    case 'category':
      db.extensions.update({ webstore: webstore, url: url }, { $set: { category: newDetail } }, function () {
        db.close();
      });
      break;

    case 'rating':
      db.extensions.update({ webstore: webstore, url: url }, { $set: { rating: newDetail } }, function () {
        db.close();
      });
      break;

    case 'lastUpdated':
      db.extensions.update({ webstore: webstore, url: url }, { $set: { lastUpdated: newDetail } }, function () {
        db.close();
      });
      break;

    case 'image':
      db.extensions.update({ webstore: webstore, url: url }, { $set: { image: newDetail } }, function () {
        db.close();
      });
      break;

    case 'installs':
      db.extensions.update({ webstore: webstore, url: url }, { $set: { installs: newDetail } }, function () {
        db.close();
      });
      break;

    case 'description':
      db.extensions.update({ webstore: webstore, url: url }, { $set: { description: newDetail } }, function () {
        db.close();
      });
      break;

    case 'lastScraped':
      db.extensions.update({ webstore: webstore, url: url }, { $set: { lastScraped: newDetail } }, function () {
        db.close();
      });
      break;

    case 'availability':
      db.extensions.update({ webstore: webstore, url: url }, { $set: { availability: newDetail } }, function () {
        db.close();
      });
      break;

    case 'reviews':
      db.extensions.update({ webstore: webstore, url: url }, { $set: { reviews: newDetail } }, function () {
        db.close();
      });
      break;

    default:
      break;
  }
}

/**
* Función para buscar cambios en los detalles de la extensión.
* Se comparan los detalles de la última vez que fue scrapeada y los detalles del scrape actual.
* Si se encuentran cambios, se actualizarán.
* @param {*} details Los detalles de la extensión (objeto JS).
*/
const lookForChanges = (details) => {
  const properties = Object.getOwnPropertyNames(details);
  const webstore = details['webstore'];
  const url = details['url'];
  const db = mongojs("extensionsDetails", ["extensions"]);
  db.extensions.findOne({ webstore: webstore, url: details['url'] },
    async (err, doc) => {
      if (err) {
        console.log("TRAY ERROR 3 " + err);
      }

      else {
        console.log("EXTENSIÓN: " + doc['name']);
        let updated = 0;
        for (let property of properties) {

          /// CASO EN EL QUE LA EXTENSIÓN SE HA ACTUALIZADO
          if (details[property] != doc[property]) {
            // Actualizar la información de la BBDD
            updateDetails(webstore, url, property, details[property]);
            updated++;
          }

        }
        if (updated == 0) {
          console.log("No se ha actualizado nada.");
        }

        else {
          console.log("Extensión actualizada.");

        }
      }
      await db.close();
    }
  );
}

/**
 * Función para añadir detalles de extensión a la BBDD
 * @param {*} details Los detalles de la extensión (Objeto JS).
 */
const addDetailsToDB = (details) => {
  const db = mongojs("extensionsDetails", ["extensions"]);
  db.extensions.insert(details, async (err, result) => {

    if (err) {
      console.log("TRAY ERROR 2 " + err);
    }

    else {
      console.log("Extensión insertada: " + JSON.stringify(details['name']));
    }

    await db.close();
  });
}

/**
 * Función para añadir o actualizar detalles de una extensión de la BBDD
 * @param {*} details Los detalles de la extensión (objeto JS).
 */
export const addDetails = (details) => {
  const db = mongojs("extensionsDetails", ["extensions"]);

  /// BUSCAR SI LA EXTENSIÓN EXISTE EN LA BBDD
  db.extensions.findOne({ url: details['url'] }, async (err, doc) => {
    if (err) {
      console.log("TRAY ERROR 1 " + err);
    }

    else {
      if (doc == null) {  // Si no existe la extensión en la BBDD...
        addDetailsToDB(details);
      }

      else {            // Si la extensión existe en la BBDD...
        lookForChanges(details);
      }
    }
    await db.close();
  })
};