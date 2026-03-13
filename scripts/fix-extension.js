
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../out');

function fixDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      if (file === '_next') {
        const newPath = path.join(dir, 'next');
        if (fs.existsSync(newPath)) {
          fs.rmSync(newPath, { recursive: true });
        }
        fs.renameSync(filePath, newPath);
        fixDirectory(newPath);
      } else {
        fixDirectory(filePath);
      }
    } else if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.css')) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/\/_next\//g, '/next/');
      content = content.replace(/_next\//g, 'next/');
      fs.writeFileSync(filePath, content);
    }
  });
}

console.log('Fixing Chrome Extension folder structure...');
if (fs.existsSync(outDir)) {
  fixDirectory(outDir);
  console.log('Done! You can now load the "out" folder as an unpacked extension.');
} else {
  console.error('Build directory "out" not found. Run "npm run build" first.');
}
