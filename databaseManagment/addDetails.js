import mongojs from "mongojs";

/// FUNCIÓN PARA AÑADIR DETALLES DE EXTENSIÓN A LA BBDD
export const addDetails = (details, browser) => {
  // insert the document
  const db = mongojs('extensionsDetails');
  const mycollection = db.collection(browser);
  mycollection.insert(details, async (err, result) => {

    if (err) {
      console.log("ERROR: inserción a BBDD: " + err);
    } else {
      console.log("Extensión insertada correctamente: " + JSON.stringify(details['name']));
    }
    
    await db.close();
  });
};