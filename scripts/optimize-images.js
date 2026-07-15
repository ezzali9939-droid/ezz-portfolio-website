import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectsDir = path.join(__dirname, '../public/assets/projects');

async function optimizeFolder(dir) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await optimizeFolder(fullPath);
    } else {
      const ext = path.extname(item).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        // Skip already small files (e.g. less than 150KB)
        if (stat.size < 150 * 1024) {
          continue;
        }

        console.log(`Optimizing: ${fullPath} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
        try {
          const inputBuffer = fs.readFileSync(fullPath);
          let outputBuffer;

          if (ext === '.png') {
            outputBuffer = await sharp(inputBuffer)
              .png({ quality: 70, palette: true, compressionLevel: 9 })
              .toBuffer();
          } else {
            outputBuffer = await sharp(inputBuffer)
              .jpeg({ quality: 75, progressive: true })
              .toBuffer();
          }

          // Verify if output buffer is smaller than original file size
          if (outputBuffer.length < stat.size) {
            fs.writeFileSync(fullPath, outputBuffer);
            console.log(`  -> Success! New size: ${(outputBuffer.length / 1024 / 1024).toFixed(2)} MB (Saved ${(100 - (outputBuffer.length / stat.size) * 100).toFixed(0)}%)`);
          } else {
            console.log(`  -> Kept original (compressed version was not smaller)`);
          }
        } catch (err) {
          console.error(`  -> Failed to optimize ${item}:`, err);
        }
      }
    }
  }
}

async function run() {
  console.log('Starting image optimization process...');
  await optimizeFolder(projectsDir);
  console.log('Image optimization process finished!');
}

run();
