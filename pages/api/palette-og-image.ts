import { NextApiRequest, NextApiResponse } from 'next';
import { createCanvas } from 'canvas';
import { hexToRgb } from '../../client/src/lib/colorUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { colors } = req.query;
    
    if (!colors || typeof colors !== 'string') {
      return res.status(400).json({ error: 'Missing colors parameter' });
    }
    
    // Parse the colors query parameter
    const colorArray = colors.split('-');
    
    if (!colorArray.length || colorArray.length > 10) {
      return res.status(400).json({ error: 'Invalid number of colors. Must be between 1 and 10.' });
    }
    
    // Add # prefix to hex values if missing
    const hexColors = colorArray.map(c => c.startsWith('#') ? c : `#${c}`);
    
    // Create canvas for the palette preview
    const width = 1200;
    const height = 630;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);
    
    // Draw the palette colors
    const colorBlockHeight = 300;
    const colorBlockY = 150;
    const colorBlockWidth = width / hexColors.length;
    
    hexColors.forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.fillRect(index * colorBlockWidth, colorBlockY, colorBlockWidth, colorBlockHeight);
    });
    
    // Add a title
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 50px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Color Palette by Coolors.in', width / 2, 80);
    
    // Add hex codes below each color
    ctx.font = '28px monospace';
    hexColors.forEach((color, index) => {
      const x = index * colorBlockWidth + colorBlockWidth / 2;
      const y = colorBlockY + colorBlockHeight + 50;
      
      // Draw a background for the text to ensure readability
      const textWidth = ctx.measureText(color.toUpperCase()).width;
      const textPadding = 10;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(
        x - textWidth / 2 - textPadding,
        y - 30,
        textWidth + textPadding * 2,
        40
      );
      
      // Draw the hex code
      ctx.fillStyle = '#333333';
      ctx.fillText(color.toUpperCase(), x, y);
    });
    
    // Add Coolors.in branding at the bottom
    ctx.fillStyle = '#333333';
    ctx.font = '24px sans-serif';
    ctx.fillText('coolors.in - The super fast color palette generator', width / 2, height - 40);
    
    // Convert canvas to buffer and send as image
    const buffer = canvas.toBuffer('image/png');
    
    // Set caching headers for better performance
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.setHeader('Content-Type', 'image/png');
    res.status(200).send(buffer);
  } catch (error) {
    console.error('Error generating palette image:', error);
    res.status(500).json({ error: 'Failed to generate palette image' });
  }
}