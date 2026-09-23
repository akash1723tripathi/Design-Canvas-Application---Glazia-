import React, { useRef, useEffect } from 'react';
import { Text } from 'react-konva';
import Konva from 'konva';
import { CanvasElement } from '../../types/element';

interface TextShapeProps {
  element: CanvasElement;
  onSelect: (id: string) => void;
  onChange: (id: string, partial: Partial<CanvasElement>) => void;
  registerRef?: (id: string, node: Konva.Node | null) => void;
}

export const TextShape: React.FC<TextShapeProps> = ({
  element,
  onSelect,
  onChange,
  registerRef,
}) => {
  const shapeRef = useRef<Konva.Text | null>(null);

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

    const width = Math.max(10, Math.round(node.width() * scaleX));
    const height = Math.max(10, Math.round(node.height() * scaleY));

    onChange(element.id, {
      x: Math.round(node.x()),
      y: Math.round(node.y()),
      width,
      height,
      rotation: Math.round(node.rotation()),
    });
  };

  return (
    <Text
      ref={(node) => {
        shapeRef.current = node;
        if (registerRef) registerRef(element.id, node);
      }}
      x={element.x}
      y={element.y}
      text={element.text || 'Text'}
      fontSize={element.fontSize || 20}
      fill={element.fill}
      rotation={element.rotation || 0}
      width={element.width}
      height={element.height}
      draggable
      onClick={() => onSelect(element.id)}
      onTap={() => onSelect(element.id)}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
    />
  );
};
