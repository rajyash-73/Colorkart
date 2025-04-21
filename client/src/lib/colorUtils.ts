// Convert hex color to RGB
export function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  // Handle shorthand hex colors (e.g., #fff)
  let processedHex = hex;
  
  // If the hex code is incomplete (less than 7 chars), return the original color's RGB
  if (hex.length < 7) {
    return null;
  }
  
  // Extract r, g, b values
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(processedHex);
  
  if (!result) {
    return null;
  }
  
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
}

// Convert RGB to hex color
export function rgbToHex(r: number, g: number, b: number): string {
  // Ensure values are within range
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

// Generate a random hex color
export function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  
  return color;
}

// Generate a random RGB color
export function getRandomRgb(): { r: number, g: number, b: number } {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256)
  };
}

// Check if a color is light (for determining text color)
export function isLightColor(hexColor: string): boolean {
  const rgb = hexToRgb(hexColor);
  
  if (!rgb) {
    return false;
  }
  
  // Calculate perceived brightness (YIQ formula)
  const yiq = ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
  return yiq >= 128;
}

// Generate a complementary color
export function getComplementaryColor(hexColor: string): string {
  const rgb = hexToRgb(hexColor);
  
  if (!rgb) {
    return '#000000';
  }
  
  // Get the complementary color by inverting RGB values
  const complementary = {
    r: 255 - rgb.r,
    g: 255 - rgb.g,
    b: 255 - rgb.b
  };
  
  return rgbToHex(complementary.r, complementary.g, complementary.b);
}

// Named color map with common colors and their hex values
export const namedColors = [
  { name: "Red", hex: "#FF0000" },
  { name: "Dark Red", hex: "#8B0000" },
  { name: "Crimson", hex: "#DC143C" },
  { name: "Maroon", hex: "#800000" },
  { name: "Tomato", hex: "#FF6347" },
  { name: "Coral", hex: "#FF7F50" },
  { name: "Indian Red", hex: "#CD5C5C" },
  { name: "Firebrick", hex: "#B22222" },
  { name: "Orange Red", hex: "#FF4500" },
  { name: "Orange", hex: "#FFA500" },
  { name: "Dark Orange", hex: "#FF8C00" },
  { name: "Gold", hex: "#FFD700" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Khaki", hex: "#F0E68C" },
  { name: "Olive", hex: "#808000" },
  { name: "Yellow Green", hex: "#9ACD32" },
  { name: "Lime Green", hex: "#32CD32" },
  { name: "Lime", hex: "#00FF00" },
  { name: "Green", hex: "#008000" },
  { name: "Forest Green", hex: "#228B22" },
  { name: "Spring Green", hex: "#00FF7F" },
  { name: "Medium Spring Green", hex: "#00FA9A" },
  { name: "Teal", hex: "#008080" },
  { name: "Cyan", hex: "#00FFFF" },
  { name: "Light Cyan", hex: "#E0FFFF" },
  { name: "Turquoise", hex: "#40E0D0" },
  { name: "Medium Turquoise", hex: "#48D1CC" },
  { name: "Dark Turquoise", hex: "#00CED1" },
  { name: "Aquamarine", hex: "#7FFFD4" },
  { name: "Cadet Blue", hex: "#5F9EA0" },
  { name: "Steel Blue", hex: "#4682B4" },
  { name: "Corn Flower Blue", hex: "#6495ED" },
  { name: "Deep Sky Blue", hex: "#00BFFF" },
  { name: "Dodger Blue", hex: "#1E90FF" },
  { name: "Light Blue", hex: "#ADD8E6" },
  { name: "Sky Blue", hex: "#87CEEB" },
  { name: "Light Sky Blue", hex: "#87CEFA" },
  { name: "Midnight Blue", hex: "#191970" },
  { name: "Navy", hex: "#000080" },
  { name: "Dark Blue", hex: "#00008B" },
  { name: "Medium Blue", hex: "#0000CD" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Royal Blue", hex: "#4169E1" },
  { name: "Blue Violet", hex: "#8A2BE2" },
  { name: "Indigo", hex: "#4B0082" },
  { name: "Dark Slate Blue", hex: "#483D8B" },
  { name: "Slate Blue", hex: "#6A5ACD" },
  { name: "Medium Slate Blue", hex: "#7B68EE" },
  { name: "Medium Purple", hex: "#9370DB" },
  { name: "Dark Magenta", hex: "#8B008B" },
  { name: "Dark Violet", hex: "#9400D3" },
  { name: "Dark Orchid", hex: "#9932CC" },
  { name: "Medium Orchid", hex: "#BA55D3" },
  { name: "Purple", hex: "#800080" },
  { name: "Thistle", hex: "#D8BFD8" },
  { name: "Plum", hex: "#DDA0DD" },
  { name: "Violet", hex: "#EE82EE" },
  { name: "Magenta", hex: "#FF00FF" },
  { name: "Orchid", hex: "#DA70D6" },
  { name: "Medium Violet Red", hex: "#C71585" },
  { name: "Pale Violet Red", hex: "#DB7093" },
  { name: "Deep Pink", hex: "#FF1493" },
  { name: "Hot Pink", hex: "#FF69B4" },
  { name: "Light Pink", hex: "#FFB6C1" },
  { name: "Pink", hex: "#FFC0CB" },
  { name: "Antique White", hex: "#FAEBD7" },
  { name: "Beige", hex: "#F5F5DC" },
  { name: "Bisque", hex: "#FFE4C4" },
  { name: "Blanched Almond", hex: "#FFEBCD" },
  { name: "Wheat", hex: "#F5DEB3" },
  { name: "Corn Silk", hex: "#FFF8DC" },
  { name: "Lemon Chiffon", hex: "#FFFACD" },
  { name: "Light Golden Rod Yellow", hex: "#FAFAD2" },
  { name: "Light Yellow", hex: "#FFFFE0" },
  { name: "Saddle Brown", hex: "#8B4513" },
  { name: "Sienna", hex: "#A0522D" },
  { name: "Chocolate", hex: "#D2691E" },
  { name: "Peru", hex: "#CD853F" },
  { name: "Sandy Brown", hex: "#F4A460" },
  { name: "Burly Wood", hex: "#DEB887" },
  { name: "Tan", hex: "#D2B48C" },
  { name: "Rosy Brown", hex: "#BC8F8F" },
  { name: "Moccasin", hex: "#FFE4B5" },
  { name: "Navajo White", hex: "#FFDEAD" },
  { name: "Peach Puff", hex: "#FFDAB9" },
  { name: "Misty Rose", hex: "#FFE4E1" },
  { name: "Lavender Blush", hex: "#FFF0F5" },
  { name: "Linen", hex: "#FAF0E6" },
  { name: "Old Lace", hex: "#FDF5E6" },
  { name: "Papaya Whip", hex: "#FFEFD5" },
  { name: "Sea Shell", hex: "#FFF5EE" },
  { name: "Mint Cream", hex: "#F5FFFA" },
  { name: "Slate Gray", hex: "#708090" },
  { name: "Light Slate Gray", hex: "#778899" },
  { name: "Light Steel Blue", hex: "#B0C4DE" },
  { name: "Lavender", hex: "#E6E6FA" },
  { name: "Floral White", hex: "#FFFAF0" },
  { name: "Alice Blue", hex: "#F0F8FF" },
  { name: "Ghost White", hex: "#F8F8FF" },
  { name: "Honeydew", hex: "#F0FFF0" },
  { name: "Ivory", hex: "#FFFFF0" },
  { name: "Azure", hex: "#F0FFFF" },
  { name: "Snow", hex: "#FFFAFA" },
  { name: "Black", hex: "#000000" },
  { name: "Dim Gray", hex: "#696969" },
  { name: "Gray", hex: "#808080" },
  { name: "Dark Gray", hex: "#A9A9A9" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Light Gray", hex: "#D3D3D3" },
  { name: "Gainsboro", hex: "#DCDCDC" },
  { name: "White Smoke", hex: "#F5F5F5" },
  { name: "White", hex: "#FFFFFF" }
];

// Calculates color distance based on RGB values (Euclidean distance in RGB space)
function colorDistance(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  
  if (!rgb1 || !rgb2) return Infinity;
  
  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) + 
    Math.pow(rgb1.g - rgb2.g, 2) + 
    Math.pow(rgb1.b - rgb2.b, 2)
  );
}

// Get the name of the closest matching color
export function getColorName(hexColor: string): string {
  // Normalize the hex color
  hexColor = hexColor.toUpperCase();
  
  // Add # if missing
  if (!hexColor.startsWith('#')) {
    hexColor = '#' + hexColor;
  }
  
  // If exact match exists
  const exactMatch = namedColors.find(c => c.hex.toUpperCase() === hexColor);
  if (exactMatch) return exactMatch.name;
  
  // Find closest match
  let closestMatch = namedColors[0];
  let closestDistance = colorDistance(hexColor, closestMatch.hex);
  
  for (let i = 1; i < namedColors.length; i++) {
    const distance = colorDistance(hexColor, namedColors[i].hex);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestMatch = namedColors[i];
    }
  }
  
  return closestMatch.name;
}
