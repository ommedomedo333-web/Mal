import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'full-products-data.json');
const products = JSON.parse(process.argv[2]);

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
data.products = data.products.concat(products);
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log(`Added ${products.length} products.`);
