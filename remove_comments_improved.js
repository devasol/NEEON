const fs = require('fs');
const path = require('path');
const stripComments = require('strip-comments');

// Function to get all files with specific extensions, excluding node_modules
function getAllFiles(dirPath, exts, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      // Skip node_modules directories
      if (file !== 'node_modules' && file !== '.git') {
        getAllFiles(filePath, exts, arrayOfFiles);
      }
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
const codeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.sass', '.less', '.html', '.htm', '.py', '.java', '.cpp', '.c', '.h', '.cs', '.php', '.go', '.rs', '.yaml', '.yml', '.json', '.md'];

// Get all code files from both frontend and backend directories
const frontendFiles = getAllFiles('./frontend', codeExtensions);
const backendFiles = getAllFiles('./backend', codeExtensions);

const allCodeFiles = frontendFiles.concat(backendFiles);

console.log(`Found ${allCodeFiles.length} code files to process`);

// Process each file
let processedCount = 0;
allCodeFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Determine the appropriate parser based on file extension
    const ext = path.extname(filePath);
    let strippedContent;
    
    if (ext === '.html' || ext === '.htm') {
      // For HTML files, strip HTML comments
      strippedContent = stripComments(content, { 
        language: 'html',
        preserveNewlines: true 
      });
    } else if (ext === '.css' || ext === '.scss' || ext === '.sass' || ext === '.less') {
      // For CSS/SCSS/SASS/LESS files, strip CSS comments
      strippedContent = stripComments(content, { 
        language: 'css',
        preserveNewlines: true 
      });
    } else if (ext === '.py') {
      // For Python files, strip Python-style comments
      strippedContent = stripComments(content, { 
        language: 'python',
        preserveNewlines: true 
      });
    } else if (ext === '.json') {
      // For JSON files, we'll just return the content as is
      // (though technically JSON doesn't support comments)
      strippedContent = content;
    } else {
      // Default to JavaScript-style comments for all other code files
      strippedContent = stripComments(content, { 
        language: 'javascript',
        preserveNewlines: true 
      });
    }
    
    // Only write the file if content actually changed
    if (strippedContent !== content) {
      fs.writeFileSync(filePath, strippedContent);
      console.log(`Stripped comments from: ${filePath}`);
    } else {
      console.log(`No comments to strip in: ${filePath}`);
    }
    
    processedCount++;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

console.log(`Comment removal completed! Processed ${processedCount} files.`);