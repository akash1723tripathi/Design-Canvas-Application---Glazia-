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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
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
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            backgroundColor:
              statusMessage.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: statusMessage.type === 'success' ? '#15803d' : '#b91c1c',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          {statusMessage.text}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flex: 1,
          height: 'calc(100vh - 60px)',
          position: 'relative',
        }}
      >
        <div style={{ flex: 1, height: '100%' }}>
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
