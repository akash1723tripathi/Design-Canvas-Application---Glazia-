import React, { useRef, useEffect } from 'react';
import { Circle } from 'react-konva';
import Konva from 'konva';
import { CanvasElement } from '../../types/element';

interface CircleShapeProps {
  element: CanvasElement;
  onSelect: (id: string) => void;
  onChange: (id: string, partial: Partial<CanvasElement>) => void;
  registerRef?: (id: string, node: Konva.Node | null) => void;
}

export const CircleShape: React.FC<CircleShapeProps> = ({
  element,
  onSelect,
  onChange,
  registerRef,
}) => {
  const shapeRef = useRef<Konva.Circle | null>(null);

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

    const currentRadius = node.radius();
    const newRadius = Math.max(5, Math.round(currentRadius * Math.max(scaleX, scaleY)));
    const diameter = newRadius * 2;

    onChange(element.id, {
      x: Math.round(node.x()),
      y: Math.round(node.y()),
      width: diameter,
      height: diameter,
      rotation: Math.round(node.rotation()),
    });
  };

  const radius = ((element.width || element.height || 100) / 2);

  return (
    <Circle
      ref={(node) => {
        shapeRef.current = node;
        if (registerRef) registerRef(element.id, node);
      }}
      x={element.x}
      y={element.y}
      radius={radius}
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
