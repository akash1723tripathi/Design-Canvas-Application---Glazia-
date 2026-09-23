'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useCanvasState } from '../hooks/useCanvasState';
import { Toolbar } from '../components/Toolbar';
import { PropertiesPanel } from '../components/PropertiesPanel';
import {
  createCanvas,
  updateCanvas,
  listCanvases,
  getCanvas,
} from '../lib/api';

const CanvasEditor = dynamic(() => import('../components/CanvasEditor'), {
  ssr: false,
});

export default function Page() {
  const {
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
  } = useCanvasState();

  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  const showStatus = (text: string, type: 'success' | 'error') => {
    setStatusMessage({ text, type });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (currentCanvasId) {
        await updateCanvas(currentCanvasId, {
          name: canvasName,
          elements,
        });
        showStatus('Canvas updated successfully!', 'success');
      } else {
        const saved = await createCanvas(canvasName, elements);
        if (saved && saved._id) {
          setCurrentCanvasId(saved._id);
        }
        showStatus('Canvas created and saved successfully!', 'success');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save canvas';
      showStatus(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectCanvasToLoad = async (id: string) => {
    try {
      const canvas = await getCanvas(id);
      setElements(canvas.elements || []);
      setCanvasName(canvas.name || 'Loaded Canvas');
      if (canvas._id) {
        setCurrentCanvasId(canvas._id);
      }
      showStatus(`Loaded canvas "${canvas.name}"`, 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load canvas';
      showStatus(msg, 'error');
    }
  };

  const handleDeleteSelected = () => {
    if (selectedId) {
      deleteElement(selectedId);
    }
  };

  const selectedElement =
    elements.find((el) => el.id === selectedId) || null;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <Toolbar
        canvasName={canvasName}
        onCanvasNameChange={setCanvasName}
        onAddElement={addElement}
        onDeleteSelected={handleDeleteSelected}
        hasSelection={!!selectedId}
        onSave={handleSave}
        onLoadList={listCanvases}
        onSelectCanvasToLoad={handleSelectCanvasToLoad}
        onNewCanvas={resetCanvas}
        isSaving={isSaving}
      />

      {statusMessage && (
        <div
          className={`px-4 py-2 text-[13px] font-medium border-b border-border transition-colors duration-200 ${
            statusMessage.type === 'success'
              ? 'bg-success-bg text-success-text'
              : 'bg-error-bg text-error-text'
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <div className="flex flex-1 relative" style={{ height: 'calc(100vh - 56px)' }}>
        <div className="flex-1 h-full">
          <CanvasEditor
            elements={elements}
            selectedId={selectedId}
            onSelectElement={selectElement}
            onUpdateElement={updateElement}
          />
        </div>
        <PropertiesPanel
          selectedElement={selectedElement}
          onUpdateElement={updateElement}
        />
      </div>
    </div>
  );
}
