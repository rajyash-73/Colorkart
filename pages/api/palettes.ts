import type { NextApiRequest, NextApiResponse } from 'next';
import { getRandomColor } from '../../client/src/lib/colorUtils';
import { hexToRgb } from '../../client/src/lib/colorUtils';
import { Color } from '../../client/src/types/Color';
import { Palette } from '../../client/src/types/Palette';

// For SSR prefetching of popular palettes
const POPULAR_PALETTES: Palette[] = [
  {
    id: 'popular-1',
    name: 'Ocean Breeze',
    colors: [
      { hex: '#05445E', rgb: hexToRgb('#05445E') || { r: 5, g: 68, b: 94 }, locked: false, name: 'Navy Blue' },
      { hex: '#189AB4', rgb: hexToRgb('#189AB4') || { r: 24, g: 154, b: 180 }, locked: false, name: 'Blue Green' },
      { hex: '#75E6DA', rgb: hexToRgb('#75E6DA') || { r: 117, g: 230, b: 218 }, locked: false, name: 'Turquoise' },
      { hex: '#D4F1F4', rgb: hexToRgb('#D4F1F4') || { r: 212, g: 241, b: 244 }, locked: false, name: 'Pale Blue' },
      { hex: '#FFFFFF', rgb: hexToRgb('#FFFFFF') || { r: 255, g: 255, b: 255 }, locked: false, name: 'White' },
    ]
  },
  {
    id: 'popular-2',
    name: 'Sunset Vibes',
    colors: [
      { hex: '#F0A500', rgb: hexToRgb('#F0A500') || { r: 240, g: 165, b: 0 }, locked: false, name: 'Yellow' },
      { hex: '#CF7500', rgb: hexToRgb('#CF7500') || { r: 207, g: 117, b: 0 }, locked: false, name: 'Orange' },
      { hex: '#E74646', rgb: hexToRgb('#E74646') || { r: 231, g: 70, b: 70 }, locked: false, name: 'Red' },
      { hex: '#591C77', rgb: hexToRgb('#591C77') || { r: 89, g: 28, b: 119 }, locked: false, name: 'Purple' },
      { hex: '#1D1CE5', rgb: hexToRgb('#1D1CE5') || { r: 29, g: 28, b: 229 }, locked: false, name: 'Blue' },
    ]
  },
];

type ErrorResponse = {
  error: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Palette[] | Palette | ErrorResponse>
) {
  switch (req.method) {
    case 'GET':
      // Return precalculated popular palettes or generate random ones
      if (req.query.type === 'popular') {
        return res.status(200).json(POPULAR_PALETTES);
      } else {
        // Generate a random palette
        const colors: Color[] = Array.from({ length: 5 }, () => {
          const hex = getRandomColor();
          return {
            hex,
            rgb: hexToRgb(hex) || { r: 0, g: 0, b: 0 },
            locked: false
          };
        });
        
        return res.status(200).json({
          id: `random-${Date.now()}`,
          name: 'Random Palette',
          colors
        });
      }
      
    case 'POST':
      try {
        // Save a palette - in a real app this would go to a database
        const { name, colors } = req.body;
        
        if (!Array.isArray(colors) || !name) {
          return res.status(400).json({ error: 'Invalid palette data' });
        }
        
        // In a real implementation, this would be saved to a database
        const newPalette: Palette = {
          id: `${Date.now()}`,
          name,
          colors,
          createdAt: new Date()
        };
        
        // For now we just return the created palette
        return res.status(201).json(newPalette);
      } catch (error) {
        console.error('Error creating palette:', error);
        return res.status(500).json({ error: 'Failed to create palette' });
      }
      
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}