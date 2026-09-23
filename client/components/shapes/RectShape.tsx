import React, { useRef, useEffect } from 'react';
import { Rect } from 'react-konva';
import Konva from 'konva';
import { CanvasElement } from '../../types/element';

interface RectShapeProps {
  element: CanvasElement;
  onSelect: (id: string) => void;
  onChange: (id: string, partial: Partial<CanvasElement>) => void;
  registerRef?: (id: string, node: Konva.Node | null) => void;
}

export const RectShape: React.FC<RectShapeProps> = ({
  element,
  onSelect,
  onChange,
  registerRef,
}) => {
  const shapeRef = useRef<Konva.Rect | null>(null);

  useEffect(() => {
    if (registerRef) {
      registerRef(element.id, shapeRef.current);
    }
  }, [element.id, registerRef]);

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    onChange(element.id, {
      x: Math.round(e.target.x()),
      y: Math.round(e.target.y()),
    });
  };

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    const width = Math.max(5, Math.round(node.width() * scaleX));
    const height = Math.max(5, Math.round(node.height() * scaleY));

    onChange(element.id, {
      x: Math.round(node.x()),
      y: Math.round(node.y()),
      width,
      height,
      rotation: Math.round(node.rotation()),
    });
  };

  return (
    <Rect
      ref={(node) => {
        shapeRef.current = node;
        if (registerRef) registerRef(element.id, node);
      }}
      x={element.x}
      y={element.y}
      width={element.width || 100}
      height={element.height || 100}
      fill={element.fill}
      rotation={element.rotation || 0}
      draggable
      onClick={() => onSelect(element.id)}
      onTap={() => onSelect(element.id)}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
    />
  );
};
