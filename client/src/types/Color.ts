export type Color = {
  hex: string;
  rgb: {
    r: number;
    g: number;
    b: number;
  };
  locked: boolean;
  name?: string; // Optional color name property
};