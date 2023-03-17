import fs from 'fs';

const urls = 3;

const lineas = fs.readFileSync('./chromeScraper/chrome_ids.txt', 'utf8', (err, data) => {
  if (err) {
    console.log("Error al intentar leer ./chrome_ids.txt");
    return;
  }
  return data;
});

const lines = lineas.split(/\r?\n/);
console.log(lines);