import { useState, useCallback } from 'react';
import { CanvasElement, ElementType } from '../types/element';

export function useCanvasState() {
  const [elements, setElementsState] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [canvasName, setCanvasName] = useState<string>('Untitled Canvas');
  const [currentCanvasId, setCurrentCanvasId] = useState<string | null>(null);

  const addElement = useCallback((type: ElementType) => {
    const id = crypto.randomUUID();
    let newElement: CanvasElement;

    if (type === 'rect') {
      newElement = {
        id,
        type: 'rect',
        x: 200,
        y: 200,
        width: 100,
        height: 100,
        rotation: 0,
        fill: '#3b82f6',
      };
    } else if (type === 'circle') {
      newElement = {
        id,
        type: 'circle',
        x: 250,
        y: 250,
        width: 100,
        height: 100,
        rotation: 0,
        fill: '#ef4444',
      };
    } else {
      newElement = {
        id,
        type: 'text',
        x: 200,
        y: 200,
        width: 120,
        height: 40,
        rotation: 0,
        fill: '#1e293b',
        text: 'Text',
        fontSize: 20,
      };
    }

    setElementsState((prev) => [...prev, newElement]);
    setSelectedId(id);
  }, []);

  const updateElement = useCallback((id: string, partial: Partial<CanvasElement>) => {
    setElementsState((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...partial } : el))
    );
  }, []);

  const deleteElement = useCallback((id: string) => {
    setElementsState((prev) => prev.filter((el) => el.id !== id));
    setSelectedId((prev) => (prev === id ? null : prev));
  }, []);

  const selectElement = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  const setElements = useCallback((newElements: CanvasElement[]) => {
    setElementsState(newElements);
    setSelectedId(null);
  }, []);

  const resetCanvas = useCallback(() => {
    setElementsState([]);
    setSelectedId(null);
    setCanvasName('Untitled Canvas');
    setCurrentCanvasId(null);
  }, []);

  return {
    elements,
    selectedId,
    canvasName,
    setCanvasName,
    currentCanvasId,
    setCurrentCanvasId,
    addElement,
    updateElement,
    deleteElement,
    selectElement,
    setElements,
    resetCanvas,
  };
}
