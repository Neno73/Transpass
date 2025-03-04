#\!/usr/bin/env node

/**
 * Script to clean API keys and credentials from old test files
 */

const fs = require('fs');
const path = require('path');
const oldTestsDir = path.join(__dirname, '..', 'old-tests');

// The API key pattern to look for
const apiKeyPattern = /AIzaSyBJ_036GDtfufZG4WUSjw6wa3lDhaKFb5g/g;
const projectIdPattern = /q-project-97c6f/g;
const appIdPattern = /1:1047562197624:web:516b930ead757f4b7deb8d/g;
const messagingSenderIdPattern = /1047562197624/g;

try {
  if (\!fs.existsSync(oldTestsDir)) {
    console.log('old-tests directory does not exist. Nothing to clean.');
    process.exit(0);
  }

  // Read all files in the old-tests directory
  const files = fs.readdirSync(oldTestsDir);
  
  let filesUpdated = 0;
  
  files.forEach(file => {
    const filePath = path.join(oldTestsDir, file);
    
    // Skip directories
    if (fs.statSync(filePath).isDirectory()) {
      return;
    }
    
    // Read file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace API key with placeholder
    const originalContent = content;
    content = content.replace(apiKeyPattern, 'your-firebase-api-key');
    content = content.replace(projectIdPattern, 'your-project-id');
    content = content.replace(appIdPattern, 'your-app-id');
    content = content.replace(messagingSenderIdPattern, 'your-messaging-sender-id');
    
    // If content changed, write it back to the file
    if (content \!== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated file: ${file}`);
      filesUpdated++;
    }
  });
  
  console.log(`\nCredential cleanup complete. Updated ${filesUpdated} files.`);
  console.log('IMPORTANT: These changes only affect your local files. You still need to:');
  console.log('1. Commit these changes to the repository');
  console.log('2. Revoke the exposed API key in Google Cloud Console');
  console.log('3. Generate a new API key for your application');
} catch (error) {
  console.error('Error cleaning credentials:', error);
  process.exit(1);
}
