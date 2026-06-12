// Nearest-named-color lookup, ported from client/src/lib/colorUtils.ts getColorName().
// Kept in sync manually — used to surface searchable color names in share metadata.
export const NAMED_COLORS = [
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
  { name: "White", hex: "#FFFFFF" },
];

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function colorDistance(hex1, hex2) {
  const a = hexToRgb(hex1);
  const b = hexToRgb(hex2);
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

/** @param {string} hex - hex color, with or without leading '#' */
export function getColorName(hex) {
  const normalized = (hex.startsWith('#') ? hex : `#${hex}`).toUpperCase();
  const exact = NAMED_COLORS.find(c => c.hex === normalized);
  if (exact) return exact.name;

  let closest = NAMED_COLORS[0];
  let closestDistance = colorDistance(normalized, closest.hex);
  for (let i = 1; i < NAMED_COLORS.length; i++) {
    const d = colorDistance(normalized, NAMED_COLORS[i].hex);
    if (d < closestDistance) {
      closestDistance = d;
      closest = NAMED_COLORS[i];
    }
  }
  return closest.name;
}
