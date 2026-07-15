import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcRoot = path.join(__dirname, '../../our work');
const destRoot = path.join(__dirname, '../public/assets/projects');

const folderMap = {
  'bite right': 'bite-right',
  'Engineers Syndicate Elections': 'engineers-elections',
  'flayer & poster': 'flayer-poster',
  'hypnos': 'hypnos',
  'plantify': 'plantify',
  'steel gate': 'steel-gate',
  'website': 'website',
  'logo': 'logo',
  'menu': 'menu',
  'cards': 'cards'
};

function syncMissing() {
  if (!fs.existsSync(srcRoot)) {
    console.error('Source root directory not found:', srcRoot);
    return;
  }

  for (const [srcFolder, destSlug] of Object.entries(folderMap)) {
    const srcDir = path.join(srcRoot, srcFolder);
    const destDir = path.join(destRoot, destSlug);

    if (!fs.existsSync(srcDir)) continue;
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const files = fs.readdirSync(srcDir);
    for (const file of files) {
      const srcFile = path.join(srcDir, file);
      const destFile = path.join(destDir, file);

      // Skip directories (if any) and the cover photo reference
      if (fs.statSync(srcFile).isDirectory()) continue;

      if (!fs.existsSync(destFile)) {
        console.log(`Restoring missing asset: ${file} to ${destSlug}`);
        fs.copyFileSync(srcFile, destFile);
      }
    }
  }
}

syncMissing();
console.log('Sync complete!');
