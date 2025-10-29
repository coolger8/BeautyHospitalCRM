const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const fs = require('fs');

// Define the directories
const protoDir = path.join(__dirname, 'src/proto');
const outputDir = path.join(__dirname, 'src/generated');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to generate TypeScript interfaces from proto files
async function generateInterfaces() {
  const protoFiles = fs.readdirSync(protoDir).filter(file => file.endsWith('.proto'));
  
  for (const protoFile of protoFiles) {
    const packageDefinition = protoLoader.loadSync(
      path.join(protoDir, protoFile),
      {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      }
    );
    
    const packageName = path.basename(protoFile, '.proto');
    const outputFile = path.join(outputDir, `${packageName}.ts`);
    
    // Extract service and message definitions
    const packageObject = grpc.loadPackageDefinition(packageDefinition);
    const serviceDefinition = packageObject[packageName];
    
    // Generate TypeScript interfaces
    let tsContent = `// Automatically generated TypeScript interfaces for ${packageName}\n\n`;
    
    // Add imports
    tsContent += `import { Observable } from 'rxjs';\n\n`;
    
    // Generate interfaces for messages
    tsContent += `// Message interfaces\n`;
    
    // This is a simplified approach - in a real implementation, you would parse the proto file
    // to extract message definitions and generate proper TypeScript interfaces
    tsContent += `// Note: These interfaces are simplified and would need to be expanded based on actual proto definitions\n\n`;
    
    // Generate service interfaces
    tsContent += `// Service interfaces\n`;
    tsContent += `export interface ${packageName.charAt(0).toUpperCase() + packageName.slice(1)}Service {\n`;
    
    // Add service methods (simplified)
    tsContent += `  // Service methods would be defined here based on the proto file\n`;
    tsContent += `  // This is a placeholder - actual methods would be generated from the proto definition\n`;
    tsContent += `}\n\n`;
    
    // Write to file
    fs.writeFileSync(outputFile, tsContent);
    console.log(`Generated ${outputFile}`);
  }
}

// Run the generation
generateInterfaces().catch(console.error);