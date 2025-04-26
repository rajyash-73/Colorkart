import type { NextApiRequest, NextApiResponse } from 'next';
import { createCanvas, loadImage } from 'canvas';
import { Color } from '../../client/src/types/Color';
import { hexToRgb, rgbToHex, getColorName } from '../../client/src/lib/colorUtils';

// Default number of colors to extract if not specified
const DEFAULT_COLORS_COUNT = 5;

// Quantize function for color extraction
function quantizeColors(imageData: ImageData, maxColors: number): Color[] {
  const pixels = imageData.data;
  const pixelCount = pixels.length / 4;
  const pixelArray = [];

  // Extract pixels skipping alpha (every 4th value)
  for (let i = 0; i < pixelCount; i++) {
    const offset = i * 4;
    const r = pixels[offset];
    const g = pixels[offset + 1];
    const b = pixels[offset + 2];
    const a = pixels[offset + 3];

    // Only include non-transparent pixels
    if (a >= 125) {
      const color = rgbToHex(r, g, b);
      pixelArray.push({
        hex: color,
        rgb: { r, g, b },
        locked: false
      });
    }
  }

  // Reduce similar colors by quantizing
  const colorMap = new Map<string, { color: Color; count: number }>();
  
  pixelArray.forEach(color => {
    // Create a simplified version of the color to group similar colors
    const r = Math.round(color.rgb.r / 10) * 10;
    const g = Math.round(color.rgb.g / 10) * 10;
    const b = Math.round(color.rgb.b / 10) * 10;
    const simplifiedHex = rgbToHex(r, g, b);
    
    if (colorMap.has(simplifiedHex)) {
      const existing = colorMap.get(simplifiedHex)!;
      existing.count += 1;
    } else {
      colorMap.set(simplifiedHex, { color, count: 1 });
    }
  });

  // Sort by frequency and take the top maxColors
  const sortedColors = Array.from(colorMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, maxColors)
    .map(item => item.color);

  // Enhance the colors with names
  return sortedColors.map(color => ({
    ...color,
    name: getColorName(color.hex)
  }));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageUrl, colorCount } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const count = parseInt(colorCount) || DEFAULT_COLORS_COUNT;
    
    // Load the image
    const image = await loadImage(imageUrl);
    
    // Create a canvas to draw the image and extract pixel data
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    
    // Draw the image to the canvas
    ctx.drawImage(image, 0, 0, image.width, image.height);
    
    // Get the image data
    const imageData = ctx.getImageData(0, 0, image.width, image.height);
    
    // Extract the colors
    const colors = quantizeColors(imageData, count);
    
    // Return the extracted colors
    return res.status(200).json({ colors });
  } catch (error) {
    console.error('Error extracting colors:', error);
    return res.status(500).json({ error: 'Failed to extract colors from image' });
  }
}