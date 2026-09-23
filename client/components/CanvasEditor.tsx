'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Transformer } from 'react-konva';
import Konva from 'konva';
import { CanvasElement } from '../types/element';
import { RectShape } from './shapes/RectShape';
import { CircleShape } from './shapes/CircleShape';
import { TextShape } from './shapes/TextShape';

interface CanvasEditorProps {
  elements: CanvasElement[];
  selectedId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, partial: Partial<CanvasElement>) => void;
}

export default function CanvasEditor({
  elements,
  selectedId,
  onSelectElement,
  onUpdateElement,
}: CanvasEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const transformerRef = useRef<Konva.Transformer | null>(null);
  const shapeRefs = useRef<Map<string, Konva.Node>>(new Map());

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight || 600,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const registerRef = useCallback((id: string, node: Konva.Node | null) => {
    if (node) {
      shapeRefs.current.set(id, node);
    } else {
      shapeRefs.current.delete(id);
    }
  }, []);

  useEffect(() => {
    if (!transformerRef.current) return;

    if (selectedId && shapeRefs.current.has(selectedId)) {
      const selectedNode = shapeRefs.current.get(selectedId);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        const layer = transformerRef.current.getLayer();
        if (layer) layer.batchDraw();
      }
    } else {
      transformerRef.current.nodes([]);
      const layer = transformerRef.current.getLayer();
      if (layer) layer.batchDraw();
    }
  }, [selectedId, elements]);

  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      onSelectElement(null);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '500px',
        backgroundColor: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={handleStageMouseDown}
        onTouchStart={handleStageMouseDown}
      >
        <Layer>
          {elements.map((el) => {
            if (el.type === 'rect') {
              return (
                <RectShape
                  key={el.id}
                  element={el}
                  onSelect={onSelectElement}
                  onChange={onUpdateElement}
                  registerRef={registerRef}
                />
              );
            }
            if (el.type === 'circle') {
              return (
                <CircleShape
                  key={el.id}
                  element={el}
                  onSelect={onSelectElement}
                  onChange={onUpdateElement}
                  registerRef={registerRef}
                />
              );
            }
            if (el.type === 'text') {
              return (
                <TextShape
                  key={el.id}
                  element={el}
                  onSelect={onSelectElement}
                  onChange={onUpdateElement}
                  registerRef={registerRef}
                />
              );
            }
            return null;
          })}
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
        </Layer>
      </Stage>
    </div>
  );
}
