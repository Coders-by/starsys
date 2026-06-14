import AdmZip from 'adm-zip';
import * as fs from 'fs';
import * as path from 'path';

try {
  console.log('Starting extraction of RPG.zip...');
  const zip = new AdmZip('RPG.zip');
  
  // Create output directory
  const destDir = './RPG_extracted';
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  zip.extractAllTo(destDir, true);
  console.log('Extraction completed successfully to ./RPG_extracted.');
  
  // Recursively list files to understand the contents
  function listFiles(dir: string, indent = '') {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        console.log(`${indent}📁 ${file}/`);
        listFiles(fullPath, indent + '  ');
      } else {
        console.log(`${indent}📄 ${file} (${stat.size} bytes)`);
      }
    }
  }
  
  console.log('\n--- Extracted File Structure ---');
  listFiles(destDir);
} catch (error) {
  console.error('Error extracting zip:', error);
}
