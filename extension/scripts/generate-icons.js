// 生成 MultiPub 扩展图标
// 使用方法: node generate-icons.js

const fs = require('fs');
const path = require('path');

// 简单的 PNG 生成器（无依赖）
// 生成纯色背景 + 文字的 PNG 图标

function createPNG(size, text, filename) {
  // PNG 文件头
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // 创建简单的 8-bit PNG
  const width = size;
  const height = size;

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 2;  // color type (RGB)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdrData);

  // 创建图像数据（紫色背景）
  const rawData = [];
  const bgColor = { r: 102, g: 126, b: 234 }; // #667eea

  for (let y = 0; y < height; y++) {
    rawData.push(0); // filter byte
    for (let x = 0; x < width; x++) {
      // 圆形裁剪
      const cx = width / 2;
      const cy = height / 2;
      const r = width / 2 - 2;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);

      if (dist <= r) {
        // 渐变效果
        const gradient = Math.min(1, dist / r);
        const r2 = Math.round(bgColor.r + (118 - bgColor.r) * gradient);
        const g2 = Math.round(bgColor.g + (75 - bgColor.g) * gradient);
        const b2 = Math.round(bgColor.b + (162 - bgColor.b) * gradient);
        rawData.push(r2, g2, b2);
      } else {
        // 透明（白色占位）
        rawData.push(255, 255, 255);
      }
    }
  }

  // 压缩数据（使用 zlib）
  const zlib = require('zlib');
  const compressed = zlib.deflateSync(Buffer.from(rawData));

  const idatChunk = createChunk('IDAT', compressed);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  // 组合 PNG
  const png = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);

  fs.writeFileSync(filename, png);
  console.log(`✓ Created ${filename}`);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type);
  const crcData = Buffer.concat([typeBuffer, data]);

  const crc = crc32(crcData);
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);

  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

// CRC32 计算
function crc32(buffer) {
  let crc = 0xFFFFFFFF;
  const table = getCRC32Table();

  for (let i = 0; i < buffer.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buffer[i]) & 0xFF];
  }

  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function getCRC32Table() {
  const table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table.push(c);
  }
  return table;
}

// 生成三种尺寸的图标
const iconsDir = path.join(__dirname, '..', 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

createPNG(16, 'M', path.join(iconsDir, 'icon16.png'));
createPNG(48, 'M', path.join(iconsDir, 'icon48.png'));
createPNG(128, 'M', path.join(iconsDir, 'icon128.png'));

console.log('\n✅ All icons generated successfully!');
