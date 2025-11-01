const fs = require('fs');
const path = require('path');
const stripComments = require('strip-comments');

// Function to get all files with specific extensions
function getAllFiles(dirPath, exts, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, exts, arrayOfFiles);
    } else {
      const ext = path.extname(file);
      if (exts.includes(ext)) {
        arrayOfFiles.push(filePath);
      }
    }
  });

  return arrayOfFiles;
}

// Extensions that may contain comments to strip
const codeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.html', '.py', '.java', '.cpp'];

// Get all code files
const allCodeFiles = getAllFiles('./frontend', codeExtensions)
  .concat(getAllFiles('./backend', codeExtensions));

console.log(`Found ${allCodeFiles.length} code files to process`);

// Process each file
allCodeFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Determine the appropriate parser based on file extension
    const ext = path.extname(filePath);
    let strippedContent;
    
    if (ext === '.html') {
      // For HTML files, strip HTML comments
      strippedContent = stripComments(content, { 
        language: 'html',
        preserveNewlines: true 
      });
    } else if (ext === '.css' || ext === '.scss') {
      // For CSS/SCSS files, strip CSS comments
      strippedContent = stripComments(content, { 
        language: 'css',
        preserveNewlines: true 
      });
    } else {
      // For JavaScript and other code files, strip JS-style comments
      strippedContent = stripComments(content, { 
        language: 'javascript',
        preserveNewlines: true 
      });
    }
    
    // Write the stripped content back to the file
    fs.writeFileSync(filePath, strippedContent);
    console.log(`Stripped comments from: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

console.log('Comment removal completed!');