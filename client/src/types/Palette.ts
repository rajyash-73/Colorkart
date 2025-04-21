import { Color } from './Color';

export type Palette = {
  id: string;
  name: string;
  colors: Color[];
  userId?: string;
  createdAt?: Date;
};