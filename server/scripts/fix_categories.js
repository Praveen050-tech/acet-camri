import fs from 'fs';

const dbPath = 'd:/ACET CAMRI/server/data/database.json';
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const categoryMap = {
  'decor': 'home-decor',
  'academic': 'engineering-models',
  'keychains': 'college-merch',
  'custom-prints': 'alumni-gifting',
  'merch': 'event-merch'
};

data.products = data.products.map(p => {
  if (categoryMap[p.category]) {
    p.category = categoryMap[p.category];
  }
  return p;
});

fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Categories updated!');
