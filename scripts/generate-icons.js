import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPng(size, isMaskable = false) {
  const width = size;
  const height = size;

  // RGBA buffer: 1 filter byte per row + 4 bytes per pixel
  const rowLength = 1 + width * 4;
  const rawBuffer = Buffer.alloc(height * rowLength);

  const cx = width / 2;
  const cy = height / 2;
  const outerR = (width / 2) * (isMaskable ? 0.75 : 0.95);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawBuffer[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= outerR) {
        // Spotify Green (#1DB954 -> R:29, G:185, B:84)
        // Draw 3 soundwave arcs in black
        let isArc = false;
        
        // Arc 1 (top): center near (cx, cy + 120), radius around 0.45 * size
        const arc1Dist = Math.sqrt(dx * dx + Math.pow(y - (cy + size * 0.35), 2));
        if (arc1Dist > size * 0.44 && arc1Dist < size * 0.52 && dx > -size * 0.32 && dx < size * 0.32 && y < cy - size * 0.04) {
          isArc = true;
        }

        // Arc 2 (middle)
        const arc2Dist = Math.sqrt(dx * dx + Math.pow(y - (cy + size * 0.28), 2));
        if (arc2Dist > size * 0.42 && arc2Dist < size * 0.49 && dx > -size * 0.28 && dx < size * 0.28 && y >= cy - size * 0.04 && y < cy + size * 0.12) {
          isArc = true;
        }

        // Arc 3 (bottom)
        const arc3Dist = Math.sqrt(dx * dx + Math.pow(y - (cy + size * 0.22), 2));
        if (arc3Dist > size * 0.40 && arc3Dist < size * 0.46 && dx > -size * 0.24 && dx < size * 0.24 && y >= cy + size * 0.12 && y < cy + size * 0.26) {
          isArc = true;
        }

        if (isArc) {
          rawBuffer[pxOffset] = 0;     // R
          rawBuffer[pxOffset + 1] = 0; // G
          rawBuffer[pxOffset + 2] = 0; // B
          rawBuffer[pxOffset + 3] = 255;
        } else {
          rawBuffer[pxOffset] = 29;    // R
          rawBuffer[pxOffset + 1] = 185; // G
          rawBuffer[pxOffset + 2] = 84;  // B
          rawBuffer[pxOffset + 3] = 255;
        }
      } else if (isMaskable) {
        // Maskable safe zone background
        rawBuffer[pxOffset] = 18;
        rawBuffer[pxOffset + 1] = 18;
        rawBuffer[pxOffset + 2] = 18;
        rawBuffer[pxOffset + 3] = 255;
      } else {
        // Transparent outside
        rawBuffer[pxOffset] = 0;
        rawBuffer[pxOffset + 1] = 0;
        rawBuffer[pxOffset + 2] = 0;
        rawBuffer[pxOffset + 3] = 0;
      }
    }
  }

  const deflated = zlib.deflateSync(rawBuffer);

  // Build PNG chunks
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace
  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT
  const idatChunk = createChunk('IDAT', deflated);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = crc32(chunk.subarray(4, 8 + len));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

// CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180));
console.log('Icons generated successfully!');
