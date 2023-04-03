import mongojs from "mongojs";

/**
 * Función para añadir los detalles de una extensión a la BBDD.
 * @param {*} details Los detalles de la extensión (objeto JS).
 */
export const addDetails = (details) => {
  const db = mongojs('extensionsDetails');
  const mycollection = db.collection('extensions');
  mycollection.insert(details, async (err, result) => {
    
    if (err) {
      console.log("ERROR: inserción a BBDD: " + err);
    } 
    
    else {
      console.log("Extensión insertada correctamente: " + JSON.stringify(details['name']));
    }
    
    await db.close();
  });
};

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
      db.extensions.update({webstore: webstore, url: url}, {$set: {name: newDetail}}, function() {
        db.close();
      });
      break;
      
    case 'url':
      db.extensions.update({webstore: webstore, url: url}, {$set:{url: newDetail}}, function() {
        db.close();
      });
      break;

    case 'publisher':
      db.extensions.update({webstore: webstore, url: url}, {$set:{publisher: newDetail}}, function() {
        db.close();
      });
      break;
    
    case 'category':
      db.extensions.update({webstore: webstore, url: url}, {$set:{category: newDetail}}, function() {
          db.close();
      });
      break;
    
    case 'rating':
      db.extensions.update({webstore: webstore, url: url}, {$set:{rating: newDetail}}, function() {
          db.close();
      });
      break;
    
    case 'lastUpdated':
      db.extensions.update({webstore: webstore, url: url}, {$set:{lastUpdated: newDetail}}, function() {
          db.close();
      });
      break;
    
    case 'image':
      db.extensions.update({webstore: webstore, url: url}, {$set:{image: newDetail}}, function() {
          db.close();
      });
      break;
    
    case 'installs':
      db.extensions.update({webstore: webstore, url: url}, {$set:{installs: newDetail}}, function() {
          db.close();
      });
      break;
    
    case 'description':
      db.extensions.update({webstore: webstore, url: url}, {$set:{description: newDetail}}, function() {
          db.close();
      });
      break;
    
    case 'lastScraped':
      db.extensions.update({webstore: webstore, url: url}, {$set:{lastScraped: newDetail}}, function() {
          db.close();
      });
      break;
    
    case 'availability':
      db.extensions.update({webstore: webstore, url: url}, {$set:{availability: newDetail}}, function() {
          db.close();
      });
      break;
    
    case 'reviews':
      db.extensions.update({webstore: webstore, url: url}, {$set:{reviews: newDetail}}, function() {
          db.close();
      });
      break;
      
    default:
      break;
  }
  console.log(detailName + " actualizado.");
}

/**
* Función para buscar cambios en los detalles de la extensión.
* Se comparan los detalles de la última vez que fue scrapeada y los detalles el scrape actual.
* Si se encuentran cambios, se actualizarán.
*/
export const lookForChanges = (details) => {
  const properties = Object.getOwnPropertyNames(details);
  const webstore = details['webstore'];
  const url = details['url'];
  const db = mongojs("extensionsDetails", ["extensions"]);
  db.extensions.findOne({webstore: webstore, url: details['url']}, 
    async (err, doc) => {
      if (err) {
        console.log(err);
      }

      else {
        console.log("EXTENSIÓN: " + doc['name']);
        for (let property of properties) {

          /// CASO EN EL QUE LA EXTENSIÓN SE HA ACTUALIZADO
          if (details[property] != doc[property]) {
            // Actualizar la información de la BBDD
            updateDetails(webstore, url, property, details[property])
          }

        }
      }
      console.log("TRAY 1");
      await db.close();
    }
  );
}


// const ext = getDetailsFromDB("Microsoft Edge Store", "Infinity New Tab");
const details = {
  webstore: "Microsoft Edge Store",
  name: "Infinity New Tab",
  url: "https://microsoftedge.microsoft.com/addons/detail/infinity-new-tab/aadnmeanpbokjjahcnikajejglihibpd",
  publisher: "Technology of Starlab Plus",
  category: "Productivity, Fun",
  rating: "Rated 5 out of 5 stars by 406 users.",
  lastUpdated: "Updated March 16, 2023",
  image: "https://store-images.s-microsoft.com/image/apps.7522.ce528673-9e28-43d7-b697-2a90dc5a3b6f.6cfb0ef7-7f80-4d33-91ff-cb0e18875007.a43817aa-66b2-434a-afc7-d0727ed4fe41?mode=scale&h=100&q=90&w=100",
  installs: 100,
  description: "Enhance the homepage and new tab page in a simpler way. Include: website icons,HD wallpapers, bookmarks, weather,notes,to-do,etc.\nThe Infinity New Tab is a world-renowned browser extension that can replace the default start page and new tab page of the browser, and provides a high degree of freedom and customizable options.\n\nAfter the installation is complete, you can make full use of icons, wallpapers, and widgets to manage your new tab page.\n\nFeatures:\n\n-Website icon: You can save the important websites that you visit frequently to the new tab page, just click the website icon to access.\n\n-Search engine: Easily switch mainstream search engines (Google, Baidu, Bing, etc.), additional additional search engines can also help you find search results from multiple engines at once.\n\n-Wallpaper: Open Infinity, you will see our carefully selected homepage wallpaper. You can choose from a rich wallpaper library (Bing wallpaper, Unsplash, etc.) or upload it locally.\n\n-Weather: Automatically obtain local weather and provide real-time feedback on the icon. Support to add weather for multiple cities and view the weather forecast within five days.\n\n-To-do list: task record list, you can set reminder time, it is your excellent task management efficiency tool.\n\n-Notes: Simple and clear notes, supports inserting pictures and hyperlinks, and can be saved in real time.\n\n-Bookmarks: Quickly access and manage bookmarks saved on the browser.\n\n-History management: view, search, and clear browser history\n\n-Extension management: View, enable, disable, and uninstall extensions that have been installed in the browser.\n\n-Gmail email notification: After linking the account with Gmail in the Infinity New Tab, a corner indicator of the number of unread emails will appear on the icon, accompanied by a sound reminder.\n\n-Personalized customization: The icons, search box, wallpaper, etc. on the new tab page all support personalized customization, and the size, color, shape, layout, etc. can be adjusted according to your preferences.\n\n-Cloud synchronization: After logging in, you can automatically synchronize data between different devices, and you can automatically or manually back up data to the cloud, without worrying about changing devices or data loss.\n\nFast, beautiful, efficient, and customizable! If you like it, don't forget to give Infinity a five-point positive review on the new tab page.\n\nDescription of required permissions:\n\nactiveTab: Get the title and url of the current page and add them to the icons of this extension\n\nstorage: store local data, such as wallpapers and weather\n\nunlimitedStorage: Obtain a larger storage space to store locally uploaded wallpaper information\n\nbackground: Respond to reminders of to-do items in the background, while enabling the extension to open faster\n\nPrivacy policy address: https://api.infinitynewtab.com/privacy/basic/edge/zh/privacy.html\n\nFeedback contact:\n\nQQ group: 1061365679\n\nEmail: infinitynewtab@gmail.com",
  lastScraped: "Right Now"
}

lookForChanges(details);