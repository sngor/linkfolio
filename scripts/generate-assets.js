/* Generate raster assets from SVGs without overwriting user-edited files. */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const pub = path.join(root, 'public');

async function ensurePngFromSvg(svgPath, outPath, width, height) {
  if (fs.existsSync(outPath)) {
    console.log(`skip: ${path.relative(root, outPath)} exists`);
    return;
  }
  if (!fs.existsSync(svgPath)) {
    console.warn(`warn: source SVG missing ${path.relative(root, svgPath)}`);
    return;
  }
  const svg = fs.readFileSync(svgPath);
  await sharp(svg, { density: 300 })
    .resize(width, height, { fit: 'cover' })
    .png()
    .toFile(outPath);
  console.log(`gen:  ${path.relative(root, outPath)} (${width}x${height})`);
}

async function run() {
  const icon192Svg = path.join(pub, 'icons', 'icon-192.svg');
  const icon512Svg = path.join(pub, 'icons', 'icon-512.svg');
  const icon192Png = path.join(pub, 'icons', 'icon-192.png');
  const icon512Png = path.join(pub, 'icons', 'icon-512.png');
  const ogSvg = path.join(pub, 'og-image.svg');
  const ogPng = path.join(pub, 'og-image.png');
  const appleTouch = path.join(pub, 'apple-touch-icon.png');

  // Generate icons only if PNGs are missing (preserve user edits)
  await ensurePngFromSvg(icon192Svg, icon192Png, 192, 192);
  await ensurePngFromSvg(icon512Svg, icon512Png, 512, 512);

  // Generate OG image 1200x630 if svg exists
  await ensurePngFromSvg(ogSvg, ogPng, 1200, 630);

  // Generate Apple touch icon 180x180 if missing, prefer 512 svg as source
  if (!fs.existsSync(appleTouch)) {
    const srcSvg = fs.existsSync(icon512Svg) ? icon512Svg : (fs.existsSync(icon192Svg) ? icon192Svg : null);
    if (srcSvg) {
      await ensurePngFromSvg(srcSvg, appleTouch, 180, 180);
    } else {
      console.warn('warn: no SVG source found for apple-touch-icon.png');
    }
  } else {
    console.log(`skip: ${path.relative(root, appleTouch)} exists`);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
