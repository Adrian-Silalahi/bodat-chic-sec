const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputDir = "./public/images";

async function compressImages() {
  const files = fs.readdirSync(inputDir);
  const imageFiles = files.filter((f) => /\.(jpg|jpeg|png)$/i.test(f));

  console.log(`Found ${imageFiles.length} images...`);

  for (const file of imageFiles) {
    const filePath = path.join(inputDir, file);
    const tempPath = path.join(inputDir, `temp_${file}`);

    await sharp(filePath)
      .resize(800, 800, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 75 })
      .toFile(tempPath);

    fs.unlinkSync(filePath);
    fs.renameSync(tempPath, filePath);

    const before = fs.statSync(filePath).size;
    console.log(`✅ Compressed: ${file} → ${(before / 1024).toFixed(0)}KB`);
  }

  console.log("🎉 Semua gambar berhasil dikompres!");
}

compressImages();
