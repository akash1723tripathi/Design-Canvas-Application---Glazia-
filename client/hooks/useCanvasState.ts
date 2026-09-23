import { useState, useCallback, useRef } from 'react';
import { CanvasElement, ElementType } from '../types/element';

const MAX_HISTORY = 50;

export function useCanvasState() {
  const [elements, setElementsState] = useState<CanvasElement[]>([]);
  const [past, setPast] = useState<CanvasElement[][]>([]);
  const [future, setFuture] = useState<CanvasElement[][]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [canvasName, setCanvasName] = useState<string>('Untitled Canvas');
  const [currentCanvasId, setCurrentCanvasId] = useState<string | null>(null);

  const elementsRef = useRef(elements);
  elementsRef.current = elements;

  const pushToPast = useCallback((currentElements: CanvasElement[]) => {
    setPast((prev) => {
      const updated = [...prev, currentElements];
      if (updated.length > MAX_HISTORY) {
        return updated.slice(updated.length - MAX_HISTORY);
      }
      return updated;
    });
    setFuture([]);
  }, []);

  const addElement = useCallback(
    (type: ElementType) => {
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

      pushToPast(elementsRef.current);
      setElementsState((prev) => [...prev, newElement]);
      setSelectedId(id);
    },
    [pushToPast]
  );

  const updateElement = useCallback(
    (id: string, partial: Partial<CanvasElement>) => {
      pushToPast(elementsRef.current);
      setElementsState((prev) =>
        prev.map((el) => (el.id === id ? { ...el, ...partial } : el))
      );
    },
    [pushToPast]
  );

  const deleteElement = useCallback(
    (id: string) => {
      pushToPast(elementsRef.current);
      setElementsState((prev) => prev.filter((el) => el.id !== id));
      setSelectedId((prev) => (prev === id ? null : prev));
    },
    [pushToPast]
  );

  const selectElement = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  const setElements = useCallback((newElements: CanvasElement[]) => {
    setElementsState(newElements);
    setSelectedId(null);
    setPast([]);
    setFuture([]);
  }, []);

  const resetCanvas = useCallback(() => {
    setElementsState([]);
    setSelectedId(null);
    setCanvasName('Untitled Canvas');
    setCurrentCanvasId(null);
    setPast([]);
    setFuture([]);
  }, []);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setPast((prev) => prev.slice(0, prev.length - 1));
    setFuture((prev) => [...prev, elementsRef.current]);
    setElementsState(previous);
    setSelectedId((prev) => (previous.some((el) => el.id === prev) ? prev : null));
  }, [past]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[future.length - 1];
    setFuture((prev) => prev.slice(0, prev.length - 1));
    setPast((prev) => {
      const updated = [...prev, elementsRef.current];
      if (updated.length > MAX_HISTORY) {
        return updated.slice(updated.length - MAX_HISTORY);
      }
      return updated;
    });
    setElementsState(next);
    setSelectedId((prev) => (next.some((el) => el.id === prev) ? prev : null));
  }, [future]);

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
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
}
