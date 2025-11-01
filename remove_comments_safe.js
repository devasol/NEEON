const fs = require('fs');
const path = require('path');

// Function to remove comments from JavaScript/JSX files manually
function removeJSComments(content) {
  // This is a simple approach to remove JavaScript comments
  // It handles both single-line (//) and multi-line (/* */) comments
  let inString = false;
  let stringChar = null;
  let inSingleLineComment = false;
  let inMultiLineComment = false;
  let result = '';
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1] || '';
    
    if (inSingleLineComment) {
      if (char === '\n') {
        inSingleLineComment = false;
        result += char;
      }
      continue;
    }
    
    if (inMultiLineComment) {
      if (char === '*' && nextChar === '/') {
        inMultiLineComment = false;
        i++; // Skip next character
        continue;
      }
      continue;
    }
    
    if (!inString && !inSingleLineComment && !inMultiLineComment) {
      if ((char === '"' || char === "'" || char === '`') && content[i - 1] !== '\\') {
        inString = true;
        stringChar = char;
        result += char;
        continue;
      }
      
      if (char === '/' && nextChar === '/') {
        inSingleLineComment = true;
        continue;
      }
      
      if (char === '/' && nextChar === '*') {
        inMultiLineComment = true;
        i++; // Skip next character
        continue;
      }
    }
    
    if (inString) {
      if (char === stringChar && content[i - 1] !== '\\') {
        inString = false;
        stringChar = null;
      }
      result += char;
      continue;
    }
    
    result += char;
  }
  
  return result;
}

// Function to remove comments from CSS files
function removeCSSComments(content) {
  // Remove CSS-style comments (/* */)
  return content.replace(/\/\*[\s\S]*?\*\//g, '');
}

// Function to remove comments from HTML files
function removeHTMLComments(content) {
  // Remove HTML-style comments (<!-- -->)
  return content.replace(/<!--[\s\S]*?-->/g, '');
}

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
const codeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.sass', '.less', '.html', '.htm', '.py', '.java', '.cpp', '.c', '.h', '.cs', '.php', '.go', '.rs'];

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
    let strippedContent = content;
    
    if (ext === '.html' || ext === '.htm') {
      strippedContent = removeHTMLComments(content);
    } else if (ext === '.css' || ext === '.scss' || ext === '.sass' || ext === '.less') {
      strippedContent = removeCSSComments(content);
    } else if (ext === '.js' || ext === '.jsx' || ext === '.ts' || ext === '.tsx') {
      strippedContent = removeJSComments(content);
    } else if (ext === '.py') {
      // For Python, we'll use a simple regex approach to remove # comments
      strippedContent = content.replace(/^\s*#.*$/gm, '');
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