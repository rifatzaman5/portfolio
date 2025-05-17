const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const optimizeImage = async (inputPath, outputPath, options = {}) => {
  try {
    await sharp(inputPath)
      .resize(options.width || 800, options.height || null, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80, progressive: true })
      .toFile(outputPath);
    console.log(`Optimized: ${inputPath}`);
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error);
  }
};

const processDirectory = async (dir) => {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await processDirectory(filePath);
    } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
      const outputPath = filePath.replace(
        /\.(jpg|jpeg|png)$/i,
        "-optimized.jpg"
      );
      await optimizeImage(filePath, outputPath);
    }
  }
};

// Process images directory
processDirectory("images")
  .then(() => console.log("Image optimization complete!"))
  .catch(console.error);
