const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateSplashScreen() {
  const svgBuffer = fs.readFileSync(
    path.join(__dirname, '../public/splash.svg')
  );

  // Generate splash screen for different devices
  const sizes = [
    { width: 2048, height: 2048, name: 'splash.png' },
    { width: 1668, height: 2388, name: 'splash-ipad-pro.png' },
    { width: 1536, height: 2048, name: 'splash-ipad.png' },
    { width: 1125, height: 2436, name: 'splash-iphone-x.png' },
    { width: 1242, height: 2208, name: 'splash-iphone-plus.png' },
    { width: 750, height: 1334, name: 'splash-iphone.png' },
  ];

  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size.width, size.height)
      .png()
      .toFile(path.join(__dirname, '../public', size.name));

    console.log(`Generated ${size.name}`);
  }
}

generateSplashScreen().catch(console.error);
