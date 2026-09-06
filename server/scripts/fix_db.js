import fs from 'fs';

const dbPath = 'd:/ACET CAMRI/server/data/database.json';
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

data.products = data.products.map(p => {
  if (p.category === 'academic' || p.category === 'CSE Academic Models') {
    p.category = 'engineering-models';
  }
  return p;
});

// String replacement for any residual labels
let strData = JSON.stringify(data, null, 2);
strData = strData.replace(/CSE Academic Models/g, 'Engineering Models');

fs.writeFileSync(dbPath, strData, 'utf8');
console.log('Database cleaned and updated!');
