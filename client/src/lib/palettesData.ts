// 150 curated popular palettes with metadata for filtering
export type PaletteEntry = {
  id: string;
  name: string;
  colors: string[];
  likes: number;
  tags: string[];
};

function hex2hsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function autoTags(name: string, colors: string[]): string[] {
  const tags: Set<string> = new Set();
  const hsls = colors.map(c => hex2hsl(c));
  const avgS = hsls.reduce((a, c) => a + c.s, 0) / hsls.length;
  const avgL = hsls.reduce((a, c) => a + c.l, 0) / hsls.length;

  // Brightness
  if (avgL > 70) tags.add('Pastel');
  if (avgL < 30) tags.add('Dark');
  if (avgS > 70 && avgL > 40 && avgL < 70) tags.add('Bright');

  // Temperature
  const warmCount = hsls.filter(h => (h.h <= 60 || h.h >= 330) && h.s > 20).length;
  const coldCount = hsls.filter(h => h.h > 160 && h.h < 280 && h.s > 20).length;
  if (warmCount >= 3) tags.add('Warm');
  if (coldCount >= 3) tags.add('Cold');

  // Monochromatic
  const hueRange = Math.max(...hsls.map(h => h.h)) - Math.min(...hsls.map(h => h.h));
  if (hueRange < 30 && avgS > 10) tags.add('Monochromatic');

  // Color hue tags
  const hueMap: [number, number, string][] = [
    [0, 20, 'Red'], [340, 360, 'Red'],
    [20, 45, 'Orange'],
    [45, 70, 'Yellow'],
    [70, 165, 'Green'],
    [165, 200, 'Turquoise'],
    [200, 255, 'Blue'],
    [255, 300, 'Violet'],
    [300, 340, 'Pink'],
  ];
  hsls.forEach(hsl => {
    if (hsl.l < 10) { tags.add('Black'); return; }
    if (hsl.l > 90 && hsl.s < 10) { tags.add('White'); return; }
    if (hsl.s < 10) { tags.add('Gray'); return; }
    if (hsl.l > 40 && hsl.l < 70 && hsl.s < 20) { tags.add('Brown'); return; }
    hueMap.forEach(([lo, hi, label]) => {
      if (hsl.h >= lo && hsl.h < hi) tags.add(label);
    });
  });

  // Topic tags from name
  const nameLower = name.toLowerCase();
  const topicMap: Record<string, string> = {
    'summer': 'Summer', 'sunset': 'Sunset', 'sunrise': 'Sunset',
    'winter': 'Winter', 'spring': 'Spring', 'autumn': 'Autumn', 'fall': 'Autumn',
    'ocean': 'Nature', 'forest': 'Nature', 'garden': 'Nature', 'jungle': 'Nature',
    'nature': 'Nature', 'botanical': 'Nature', 'leaf': 'Nature',
    'city': 'City', 'neon': 'City', 'night': 'City', 'urban': 'City',
    'food': 'Food', 'caramel': 'Food', 'cream': 'Food', 'honey': 'Food',
    'vintage': 'Vintage', 'retro': 'Vintage', 'antiquity': 'Vintage',
    'gold': 'Gold', 'golden': 'Gold',
    'wedding': 'Wedding', 'blush': 'Wedding', 'rose': 'Wedding',
    'party': 'Party', 'carnival': 'Party', 'fiesta': 'Party',
    'space': 'Space', 'galaxy': 'Space', 'cosmic': 'Space',
    'happy': 'Happy', 'candy': 'Happy', 'fun': 'Happy',
    'christmas': 'Christmas', 'holiday': 'Christmas',
    'halloween': 'Halloween', 'dark': 'Halloween',
    'pride': 'Pride', 'rainbow': 'Rainbow',
  };
  Object.entries(topicMap).forEach(([kw, topic]) => {
    if (nameLower.includes(kw)) tags.add(topic);
  });

  // Gradient tag: high hue variation
  if (hueRange > 120) tags.add('Gradient');

  return Array.from(tags);
}

const rawPalettes = [
  { name: "Ocean Drift", colors: ["#69D2E7", "#A7DBD8", "#E0E4CC", "#F38630", "#FA6900"] },
  { name: "Rose Petal", colors: ["#FE4365", "#FC9D9A", "#F9CDAD", "#C8C8A9", "#83AF9B"] },
  { name: "Autumn Rust", colors: ["#ECD078", "#D95B43", "#C02942", "#542437", "#53777A"] },
  { name: "Tropical Punch", colors: ["#556270", "#4ECDC4", "#C7F464", "#FF6B6B", "#C44D58"] },
  { name: "Desert Sand", colors: ["#774F38", "#E08E79", "#F1D4AF", "#ECE5CE", "#C5E0DC"] },
  { name: "Deep Forest", colors: ["#E8DDCB", "#CDB380", "#036564", "#033649", "#031634"] },
  { name: "Golden Harvest", colors: ["#490A3D", "#BD1550", "#E97F02", "#F8CA00", "#8A9B0F"] },
  { name: "Lagoon", colors: ["#594F4F", "#547980", "#45ADA8", "#9DE0AD", "#E5FCC2"] },
  { name: "Terra Cotta", colors: ["#00A0B0", "#6A4A3C", "#CC333F", "#EB6841", "#EDC951"] },
  { name: "Dusty Rose", colors: ["#E94E77", "#D68189", "#C6A49A", "#C6E5D9", "#F4EAD5"] },
  { name: "Candy Pop", colors: ["#3FB8AF", "#7FC7AF", "#DAD8A7", "#FF9E9D", "#FF3D7F"] },
  { name: "Warm Stone", colors: ["#D9CEB2", "#948C75", "#D5DED9", "#7A6A53", "#99B2B7"] },
  { name: "Citrus Burst", colors: ["#FF4E50", "#FC913A", "#F9D423", "#EDE574", "#E1F5C4"] },
  { name: "Soft Autumn", colors: ["#99B898", "#FECEA8", "#FF847C", "#E84A5F", "#2A363B"] },
  { name: "Espresso", colors: ["#655643", "#80BCA3", "#F6F7BD", "#E6AC27", "#BF4D28"] },
  { name: "Aqua Splash", colors: ["#00A8C6", "#40C0CB", "#F9F2E7", "#AEE239", "#8FBE00"] },
  { name: "Midnight Plum", colors: ["#351330", "#424254", "#64908A", "#E8CAA4", "#CC2A41"] },
  { name: "Olive Garden", colors: ["#554236", "#F77825", "#D3CE3D", "#F1EFA5", "#60B99A"] },
  { name: "Mountain Fog", colors: ["#5D4157", "#838689", "#A8CABA", "#CAD7B2", "#EBE3AA"] },
  { name: "Sunbaked", colors: ["#8C2318", "#5E8C6A", "#88A65E", "#BFB35A", "#F2C45A"] },
  { name: "Flame Tail", colors: ["#FAD089", "#FF9C5B", "#F5634A", "#ED303C", "#3B8183"] },
  { name: "Dusk Blush", colors: ["#F8B195", "#F67280", "#C06C84", "#6C5B7B", "#355C7D"] },
  { name: "Fern Valley", colors: ["#1B676B", "#519548", "#88C425", "#BEF202", "#EAFDE6"] },
  { name: "Amber Glow", colors: ["#5E412F", "#FCEBB6", "#78C0A8", "#F07818", "#F0A830"] },
  { name: "Berry Crush", colors: ["#BCBDAC", "#CFBE27", "#F27435", "#F02475", "#3B2D38"] },
  { name: "Peach Orchard", colors: ["#452632", "#91204D", "#E4844A", "#E8BF56", "#E2F7CE"] },
  { name: "Prairie Wheat", colors: ["#EEE6AB", "#C5BC8E", "#696758", "#45484B", "#36393B"] },
  { name: "Jungle Canopy", colors: ["#2A044A", "#0B2E59", "#0D6759", "#7AB317", "#A0C55F"] },
  { name: "Coral Reef", colors: ["#F04155", "#FF823A", "#F2F26F", "#FFF7BD", "#95CFB7"] },
  { name: "Slate & Stone", colors: ["#B9D7D9", "#668284", "#2A2829", "#493736", "#7B3B3B"] },
  { name: "Spring Blossom", colors: ["#B3CC57", "#ECF081", "#FFBE40", "#EF746F", "#AB3E5B"] },
  { name: "Harvest Moon", colors: ["#A3A948", "#EDB92E", "#F85931", "#CE1836", "#009989"] },
  { name: "Velvet Underground", colors: ["#300030", "#480048", "#601848", "#C04848", "#F07241"] },
  { name: "Sage Morning", colors: ["#AAB3AB", "#C4CBB7", "#EBEFC9", "#EEE0B7", "#E8CAAF"] },
  { name: "Carnival Lights", colors: ["#E8D5B7", "#0E2430", "#FC3A51", "#F5B349", "#E8D5B9"] },
  { name: "Wild Rose", colors: ["#AB526B", "#BCA297", "#C5CEAE", "#F0E2A4", "#F4EBC3"] },
  { name: "Botanical", colors: ["#607848", "#789048", "#C0D860", "#F0F0D8", "#604848"] },
  { name: "Cotton Candy", colors: ["#A8E6CE", "#DCEDC2", "#FFD3B5", "#FFAAA6", "#FF8C94"] },
  { name: "Noir Cinema", colors: ["#3E4147", "#FFFEDF", "#DFBA69", "#5A2E2E", "#2A2C31"] },
  { name: "Neon Tropics", colors: ["#FC354C", "#29221F", "#13747D", "#0ABFBC", "#FCF7C5"] },
  { name: "Fiesta", colors: ["#CC0C39", "#E6781E", "#C8CF02", "#F8FCC1", "#1693A7"] },
  { name: "Rainforest", colors: ["#1C2130", "#028F76", "#B3E099", "#FFEAAD", "#D14334"] },
  { name: "Moody Blues", colors: ["#A7C5BD", "#E5DDCB", "#EB7B59", "#CF4647", "#524656"] },
  { name: "Storm Cloud", colors: ["#DAD6CA", "#1BB0CE", "#4F8699", "#6A5E72", "#563444"] },
  { name: "Eucalyptus", colors: ["#EDEBE6", "#D6E1C7", "#94C7B6", "#403B33", "#D3643B"] },
  { name: "Sunflower Field", colors: ["#FDF1CC", "#C6D6B8", "#987F69", "#E3AD40", "#FCD036"] },
  { name: "Electric Night", colors: ["#230F2B", "#F21D41", "#EBEBBC", "#BCE3C5", "#82B3AE"] },
  { name: "Blush Garden", colors: ["#B9D3B0", "#81BDA4", "#B28774", "#F88F79", "#F6AA93"] },
  { name: "Dark Moss", colors: ["#3A111C", "#574951", "#83988E", "#BCDEA5", "#E6F9BC"] },
  { name: "Sandstone", colors: ["#5E3929", "#CD8C52", "#B7D1A3", "#DEE8BE", "#FCF7D3"] },
  { name: "Summer Sunset", colors: ["#FF9671", "#FFC75F", "#F9F871", "#D65DB1", "#845EC2"] },
  { name: "Ocean Breeze", colors: ["#1A535C", "#4ECDC4", "#F7FFF7", "#FF6B6B", "#FFE66D"] },
  { name: "Forest Vibes", colors: ["#2D6A4F", "#40916C", "#52B788", "#74C69D", "#95D5B2"] },
  { name: "Retro Wave", colors: ["#2B2D42", "#8D99AE", "#EDF2F4", "#EF233C", "#D90429"] },
  { name: "Pastel Dream", colors: ["#CDB4DB", "#FFC8DD", "#FFAFCC", "#BDE0FE", "#A2D2FF"] },
  { name: "Nordic Night", colors: ["#2E3440", "#3B4252", "#434C5E", "#4C566A", "#88C0D0"] },
  { name: "Lavender Mist", colors: ["#6C63FF", "#7D6AFF", "#9C87FF", "#B8A9FF", "#D4CBFF"] },
  { name: "Earth Tones", colors: ["#8B4513", "#A0522D", "#CD853F", "#DEB887", "#F5DEB3"] },
  { name: "Neon Nights", colors: ["#0D0D0D", "#1A1A2E", "#16213E", "#0F3460", "#E94560"] },
  { name: "Pink Whisper", colors: ["#382F32", "#FFEAF2", "#FCD9E5", "#FBC5D8", "#F1396D"] },
  { name: "Seafoam Dreams", colors: ["#E3DFBA", "#C8D6BF", "#93CCC6", "#6CBDB5", "#1A1F1E"] },
  { name: "Coastal Blue", colors: ["#1B325F", "#9CC4E4", "#E9F2F9", "#3A89C9", "#F26C4F"] },
  { name: "Tropical Sunrise", colors: ["#A1DBB2", "#FEE5AD", "#FACA66", "#F7A541", "#F45D4C"] },
  { name: "Bluebell", colors: ["#5E9FA3", "#DCD1B4", "#FAB87F", "#F87E7B", "#B05574"] },
  { name: "Peach Blossom", colors: ["#8DCCAD", "#988864", "#FEA6A2", "#F9D6AC", "#FFE9AF"] },
  { name: "Deep Sea", colors: ["#2D2D29", "#215A6D", "#3CA2A2", "#92C7A3", "#DFECE6"] },
  { name: "Neon Punk", colors: ["#413D3D", "#040004", "#C8FF00", "#FA023C", "#4B000F"] },
  { name: "Sage & Slate", colors: ["#EFF3CD", "#B2D5BA", "#61ADA0", "#248F8D", "#605063"] },
  { name: "Linen", colors: ["#FFEFD3", "#FFFEE4", "#D0ECEA", "#9FD6D2", "#8B7A5E"] },
  { name: "Purple Haze", colors: ["#4E395D", "#827085", "#8EBE94", "#CCFC8E", "#DC5B3E"] },
  { name: "Teal & Gold", colors: ["#046D8B", "#309292", "#2FB8AC", "#93A42A", "#ECBE13"] },
  { name: "Nautical", colors: ["#4E4D4A", "#353432", "#94BA65", "#2790B0", "#2B4E72"] },
  { name: "Peach Fuzz", colors: ["#4D3B3B", "#DE6262", "#FFB88C", "#FFD0B3", "#F5E0D3"] },
  { name: "Sherbet", colors: ["#FFFBB7", "#A6F6AF", "#66B6AB", "#5B7C8D", "#4F2958"] },
  { name: "Driftwood", colors: ["#9D7E79", "#CCAC95", "#9A947C", "#748B83", "#5B756C"] },
  { name: "Terracotta", colors: ["#9CDDC8", "#BFD8AD", "#DDD9AB", "#F7AF63", "#633D2E"] },
  { name: "Neon City", colors: ["#AAFF00", "#FFAA00", "#FF00AA", "#AA00FF", "#00AAFF"] },
  { name: "Berry Tart", colors: ["#D1313D", "#E5625C", "#F9BF76", "#8EB2C5", "#615375"] },
  { name: "Jungle Jade", colors: ["#73C8A9", "#DEE1B6", "#E1B866", "#BD5532", "#373B44"] },
  { name: "Pine Forest", colors: ["#379F7A", "#78AE62", "#BBB749", "#E0FBAC", "#1F1C0D"] },
  { name: "Electric Lime", colors: ["#CAFF42", "#EBF7F8", "#D0E0EB", "#88ABC2", "#49708A"] },
  { name: "Periwinkle Sky", colors: ["#75616B", "#BFCFF7", "#DCE4F7", "#F8F3BF", "#D34017"] },
  { name: "Blood Orange", colors: ["#1C0113", "#6B0103", "#A30006", "#C21A01", "#F03C02"] },
  { name: "Creamsicle", colors: ["#9DC9AC", "#FFFEC7", "#F56218", "#FF9D2E", "#919167"] },
  { name: "Soft Jade", colors: ["#F38A8A", "#55443D", "#A0CAB5", "#CDE9CA", "#F1EDD0"] },
  { name: "Tropical Flame", colors: ["#A70267", "#F10C49", "#FB6B41", "#F6D86B", "#339194"] },
  { name: "Neon Rainbow", colors: ["#FF003C", "#FF8A00", "#FABE28", "#88C100", "#00C176"] },
  { name: "Ember", colors: ["#FFEDBF", "#F7803C", "#F54828", "#2E0D23", "#F8E4C1"] },
  { name: "Bamboo", colors: ["#0CA5B0", "#4E3F30", "#FEFEEB", "#F8F4E4", "#A5B3AA"] },
  { name: "Moss & Bark", colors: ["#EDF6EE", "#D1C089", "#B3204D", "#412E28", "#151101"] },
  { name: "Morning Frost", colors: ["#FCFEF5", "#E9FFE1", "#CDCFB7", "#D6E6C3", "#FAFBE3"] },
  { name: "Dark Water", colors: ["#30261C", "#403831", "#36544F", "#1F5F61", "#0B8185"] },
  { name: "Vanilla Cream", colors: ["#FFE181", "#EEE9E5", "#FAD3B2", "#FFBA7F", "#FF9C97"] },
  { name: "Blush Almond", colors: ["#805841", "#DCF7F3", "#FFFCDD", "#FFD8D8", "#F5A2A2"] },
  { name: "Rustic Claret", colors: ["#C2412D", "#D1AA34", "#A7A844", "#A46583", "#5A1E4A"] },
  { name: "Gradient Sky", colors: ["#7F7FD5", "#86A8E7", "#91EAE4"] },
  { name: "Sunset Gold", colors: ["#F7971E", "#FFD200"] },
  { name: "Frozen Berry", colors: ["#4776E6", "#8E54E9"] },
  { name: "Fresh Mint", colors: ["#00B09B", "#96C93D"] },
  { name: "Cherry Blossom", colors: ["#FDA085", "#F6D365"] },
  { name: "Purple Dream", colors: ["#654EA3", "#EAAFc8"] },
  { name: "Cool Slate", colors: ["#373B44", "#4286F4"] },
  { name: "Peach Sunset", colors: ["#ED4264", "#FFEDBC"] },
  { name: "Moonlight Blue", colors: ["#2980B9", "#2C3E50"] },
  { name: "Honey Dew", colors: ["#F7FF00", "#DB36A4"] },
  { name: "Mango Tango", colors: ["#F09819", "#EDDE5D"] },
  { name: "Aquamarine", colors: ["#1A2980", "#26D0CE"] },
  { name: "Royal Crimson", colors: ["#8E0E00", "#1F1C18"] },
  { name: "Melon Punch", colors: ["#FF8008", "#FFC837"] },
  { name: "Storm Grey", colors: ["#B8C6DB", "#F5F7FA"] },
  { name: "Orchid", colors: ["#DA22FF", "#9733EE"] },
  { name: "Lime Zest", colors: ["#A8E063", "#56AB2F"] },
  { name: "Indigo Night", colors: ["#360033", "#0B8793"] },
  { name: "Warm Flame", colors: ["#FF9A9E", "#FAD0C4", "#FFD1FF"] },
  { name: "Near Moon", colors: ["#5EE7DF", "#B490CA"] },
  { name: "Wild Apple", colors: ["#D299C2", "#FEF9D7"] },
  { name: "Lady Lips", colors: ["#FF9A9E", "#FECFEF"] },
  { name: "Winter Neva", colors: ["#A1C4FD", "#C2E9FB"] },
  { name: "Heavy Rain", colors: ["#CFD9DF", "#E2EBF0"] },
  { name: "Strong Bliss", colors: ["#F78CA0", "#F9748F", "#FD868C", "#FE9A8B"] },
  { name: "Fresh Milk", colors: ["#FDDB92", "#D1FDFF"] },
  { name: "Snow Again", colors: ["#E6DEE9", "#FFFFFF"] },
  { name: "February Ink", colors: ["#13547A", "#80D0C7"] },
  { name: "Kind Steel", colors: ["#E9DEFA", "#FBFCDB"] },
  { name: "Soft Grass", colors: ["#C1DFC4", "#DEECDD"] },
  { name: "Grown Early", colors: ["#0BA360", "#3CBA92"] },
  { name: "Sharp Blues", colors: ["#00C6FB", "#005BEA"] },
  { name: "Shady Water", colors: ["#74EBD5", "#9FACE6"] },
  { name: "Dirty Beauty", colors: ["#6A3093", "#A044FF"] },
  { name: "Great Whale", colors: ["#A3BDED", "#6991C7"] },
  { name: "Teen Notebook", colors: ["#9795F0", "#FBC8D4"] },
  { name: "Polite Rumors", colors: ["#A7A6CB", "#8989BA", "#8989BA"] },
  { name: "Sweet Period", colors: ["#3F51B1", "#5A55AE", "#7B5EA7", "#8F6AAE", "#A86AA4"] },
  { name: "Wide Matrix", colors: ["#FAD961", "#F76B1C"] },
  { name: "Soft Cherish", colors: ["#DBDCD8", "#DDDCD8", "#E2DBD9", "#E9D8D4", "#EDD5CF"] },
  { name: "Red Salvation", colors: ["#F43B47", "#453A94"] },
  { name: "Burning Spring", colors: ["#4E65FF", "#92EFFD"] },
  { name: "Noble Lead", colors: ["#456EFE", "#0099F7"] },
  { name: "Cool Blues", colors: ["#2193B0", "#6DD5ED"] },
  { name: "Whirl Pool", colors: ["#CAC531", "#F3F9A7"] },
  { name: "Slick Carbon", colors: ["#323232", "#0F0C29"] },
  { name: "Aqua Marine", colors: ["#1A2980", "#26D0CE"] },
  { name: "Mean Fruit", colors: ["#EC9F05", "#FF4E00"] },
  { name: "Deep Blue", colors: ["#6A11CB", "#2575FC"] },
  { name: "Ripe Malinka", colors: ["#F093FB", "#F5576C"] },
  { name: "Cloudy Knoxville", colors: ["#FDFBFB", "#EBEDEE"] },
  { name: "Malibu Beach", colors: ["#4568DC", "#B06AB3"] },
  { name: "New Life", colors: ["#43E97B", "#38F9D7"] },
  { name: "True Sunset", colors: ["#FA709A", "#FEE140"] },
  { name: "Morpheus Den", colors: ["#30001A", "#7B4397"] },
  { name: "Rare Wind", colors: ["#A8EDEA", "#FED6E3"] },
  { name: "Near Moon 2", colors: ["#5EE7DF", "#B490CA", "#6F4E96"] },
  { name: "Wild Oranges", colors: ["#F7971E", "#FFD200", "#ED213A"] },
  { name: "Forest Dream", colors: ["#5A3F37", "#2C7744"] },
  { name: "Rich Metal", colors: ["#D4B483", "#C1A05C"] },
  { name: "Juicy Cake", colors: ["#E14FAD", "#601566"] },
  { name: "Smart Indigo", colors: ["#B224EF", "#7579FF"] },
  { name: "Sand Strike", colors: ["#F7F0AC", "#AC733C"] },
  { name: "Norse Beauty", colors: ["#EC77AB", "#7873F5"] },
  { name: "Aqua Guidance", colors: ["#007EE5", "#38EF7D"] },
  { name: "Sun Veggie", colors: ["#20E2D7", "#F9FEA5"] },
  { name: "Sea Lord", colors: ["#2CD8D5", "#6B8DD6", "#8E37D7"] },
  { name: "Black Sea", colors: ["#2CD8D5", "#C5C1FF", "#FFBAC3"] },
  { name: "Grass Shampoo", colors: ["#DFFFCD", "#90F9C4", "#39F3BB"] },
  { name: "Landing Aircraft", colors: ["#5D9FFF", "#B8DCFF", "#6BBBFF"] },
  { name: "Witch Dance", colors: ["#A8BFFF", "#884D80"] },
  { name: "Sleepless Night", colors: ["#5433FF", "#20BDFF", "#A5FECB"] },
  { name: "Angel Care", colors: ["#FFE29F", "#FFA99F", "#FF719A"] },
  { name: "Crystal Clear", colors: ["#155799", "#159957"] },
  { name: "Mello Yellow", colors: ["#F8FF00", "#3AD59F"] },
  { name: "Red Blue Gradient", colors: ["#2980B9", "#FC4445"] },
  { name: "Colorful Peach", colors: ["#ED4264", "#FFEDBC"] },
  { name: "Aqua Splash 2", colors: ["#13547A", "#80D0C7"] },
  { name: "Spiky Naga", colors: ["#505285", "#585E92", "#65689F", "#7474B0", "#7E7EBB"] },
  { name: "Love Kiss", colors: ["#FF0844", "#FFB199"] },
  { name: "Clean Mirror", colors: ["#93A5CF", "#E4EFE9"] },
  { name: "Premium Dark", colors: ["#434343", "#000000"] },
  { name: "Cold Evening", colors: ["#0C3483", "#A2B6DF", "#6B8CCE", "#A2B6DF"] },
  { name: "Cochiti Lake", colors: ["#93A5CF", "#E4EFE9"] },
  { name: "Summer Games", colors: ["#92FE9D", "#00C9FF"] },
  { name: "Passionate Bed", colors: ["#FF758C", "#FF7EB3"] },
  { name: "Mountain Rock", colors: ["#868F96", "#596164"] },
  { name: "Desert Hump", colors: ["#C79081", "#DFA579"] },
  { name: "Jungle Day", colors: ["#8BAAAA", "#AE3F3F"] },
];

// Build the final dataset with auto-generated tags and likes
let likeCounter = 2800;
export const POPULAR_PALETTES: PaletteEntry[] = rawPalettes.map((p, i) => ({
  id: `static-${i}`,
  name: p.name,
  colors: p.colors,
  likes: Math.max(50, likeCounter - i * 13),
  tags: autoTags(p.name, p.colors),
}));

// Color tag to hue ranges for smart filtering
export const COLOR_HUE_RANGES: Record<string, [number, number][]> = {
  Red:       [[0, 20], [340, 360]],
  Orange:    [[20, 45]],
  Yellow:    [[45, 70]],
  Green:     [[70, 165]],
  Turquoise: [[165, 200]],
  Blue:      [[200, 255]],
  Violet:    [[255, 300]],
  Pink:      [[300, 340]],
};
