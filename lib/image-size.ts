import fs from "node:fs";
import path from "node:path";

export function readPublicImageSize(
  src: string,
): { width: number; height: number } | null {
  if (!src.startsWith("/") || src.startsWith("//")) return null;

  const root = path.resolve(process.cwd(), "public");
  const file = path.resolve(root, decodeURIComponent(src).replace(/^\/+/, ""));
  if (file !== root && !file.startsWith(root + path.sep)) return null;

  let data: Buffer;
  try {
    data = fs.readFileSync(file);
  } catch {
    return null;
  }

  return pngSize(data) ?? jpegSize(data);
}

function pngSize(data: Buffer): { width: number; height: number } | null {
  if (data.length < 24 || data.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
    return null;
  }
  return {
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20),
  };
}

function jpegSize(data: Buffer): { width: number; height: number } | null {
  if (data.length < 4 || data[0] !== 0xff || data[1] !== 0xd8) return null;

  let i = 2;
  while (i + 9 < data.length) {
    if (data[i] !== 0xff) {
      i += 1;
      continue;
    }
    const marker = data[i + 1]!;
    if (marker === 0xd8 || marker === 0x01) {
      i += 2;
      continue;
    }
    if (marker === 0xd9) return null;
    const length = data.readUInt16BE(i + 2);
    const isStartOfFrame =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;
    if (isStartOfFrame) {
      return {
        height: data.readUInt16BE(i + 5),
        width: data.readUInt16BE(i + 7),
      };
    }
    i += 2 + length;
  }

  return null;
}
