/**
 * Generates a simplified perceptual hash (pHash) for an image.
 * 1. Resize to 8x8
 * 2. Grayscale
 * 3. Average luminosity
 * 4. Generate 64-bit string (1 if pixel > average, else 0)
 */
export async function generatePHash(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 8;
      canvas.height = 8;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Could not get canvas context");

      // Draw and resize
      ctx.drawImage(img, 0, 0, 8, 8);
      const imageData = ctx.getImageData(0, 0, 8, 8);
      const data = imageData.data;

      // Convert to grayscale and find average
      const grayValues = [];
      let total = 0;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const gray = Math.floor(0.299 * r + 0.587 * g + 0.114 * b);
        grayValues.push(gray);
        total += gray;
      }
      const average = total / 64;

      // Build bitstring
      const hash = grayValues.map((val) => (val >= average ? "1" : "0")).join("");
      resolve(hash);
    };
    img.onerror = () => reject("Failed to load image");
    img.src = imageUrl;
  });
}

/**
 * Calculates similarity between two hashes using Hamming distance.
 * Returns a value between 0 and 1.
 */
export function compareHashes(hash1: string, hash2: string): number {
  if (hash1.length !== hash2.length) return 0;
  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) distance++;
  }
  return 1 - distance / hash1.length;
}
