export type ElementType = 'rect' | 'circle' | 'text';

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation: number;
  fill: string;
  text?: string;
  fontSize?: number;
}

export interface Canvas {
  _id?: string;
  name: string;
  elements: CanvasElement[];
}
