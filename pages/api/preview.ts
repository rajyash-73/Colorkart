import type { NextApiRequest, NextApiResponse } from 'next';
import { Color } from '../../client/src/types/Color';
import { hexToRgb } from '../../client/src/lib/colorUtils';

type PreviewResponse = {
  colors: Color[];
};

type ErrorResponse = {
  error: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PreviewResponse | ErrorResponse>
) {
  try {
    const { colors } = req.query;
    
    if (!colors || typeof colors !== 'string') {
      return res.status(400).json({ error: 'Missing colors parameter' });
    }
    
    // Parse the colors query parameter - expects format like: colors=FF5733-33FF57-5733FF-F3FF33-FF33F3
    const colorArray = colors.split('-');
    
    if (!colorArray.length || colorArray.length > 10) {
      return res.status(400).json({ error: 'Invalid number of colors. Must be between 1 and 10.' });
    }
    
    // Convert to Color objects
    const paletteColors: Color[] = colorArray.map(hexCode => {
      // Ensure the hex code has a # prefix
      const formattedHex = hexCode.startsWith('#') ? hexCode : `#${hexCode}`;
      
      return {
        hex: formattedHex,
        rgb: hexToRgb(formattedHex) || { r: 0, g: 0, b: 0 },
        locked: false
      };
    });
    
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
    return res.status(200).json({ colors: paletteColors });
  } catch (error) {
    console.error('Error processing preview request:', error);
    return res.status(500).json({ error: 'Failed to process preview request' });
  }
}