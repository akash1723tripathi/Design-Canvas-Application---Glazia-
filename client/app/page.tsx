'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useCanvasState } from '../hooks/useCanvasState';
import { useDebouncedCallback } from '../hooks/useDebouncedCallback';
import { Toolbar } from '../components/Toolbar';
import { PropertiesPanel } from '../components/PropertiesPanel';
import type { CanvasEditorRef } from '../components/CanvasEditor';
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
  const canvasEditorRef = useRef<CanvasEditorRef>(null);

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
  const [autosaveStatus, setAutosaveStatus] = useState<'saving' | 'saved' | null>(null);

  const prevCanvasIdRef = useRef<string | null>(currentCanvasId);
  const isInitialMount = useRef(true);
  const savedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        setAutosaveStatus('saved');
      } else {
        const saved = await createCanvas(canvasName, elements);
        if (saved && saved._id) {
          setCurrentCanvasId(saved._id);
        }
        showStatus('Canvas created and saved successfully!', 'success');
        setAutosaveStatus('saved');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save canvas';
      showStatus(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const performAutosave = async () => {
    if (!currentCanvasId) return;
    if (savedTimeoutRef.current) {
      clearTimeout(savedTimeoutRef.current);
    }
    setAutosaveStatus('saving');
    try {
      await updateCanvas(currentCanvasId, {
        name: canvasName,
        elements,
      });
      setAutosaveStatus('saved');
      showStatus('Canvas auto-saved!', 'success');
      savedTimeoutRef.current = setTimeout(() => {
        setAutosaveStatus(null);
      }, 3000);
    } catch (err) {
      console.error('Autosave failed:', err);
      setAutosaveStatus(null);
      const msg = err instanceof Error ? err.message : 'Autosave failed';
      showStatus(msg, 'error');
    }
  };

  const debouncedAutosave = useDebouncedCallback(performAutosave, 2000);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevCanvasIdRef.current = currentCanvasId;
      return;
    }

    if (prevCanvasIdRef.current !== currentCanvasId) {
      prevCanvasIdRef.current = currentCanvasId;
      setAutosaveStatus(null);
      return;
    }

    if (currentCanvasId) {
      setAutosaveStatus(null);
      debouncedAutosave();
    }
  }, [elements, canvasName, currentCanvasId]);

  const handleExportPNG = () => {
    if (!canvasEditorRef.current) return;
    const dataUrl = canvasEditorRef.current.exportToPNG();
    if (!dataUrl) return;

    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const blob = new Blob([u8arr], { type: mime });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${canvasName || 'canvas'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
        onExportPNG={handleExportPNG}
        onLoadList={listCanvases}
        onSelectCanvasToLoad={handleSelectCanvasToLoad}
        onNewCanvas={resetCanvas}
        isSaving={isSaving}
        autosaveStatus={autosaveStatus}
      />

      {statusMessage && (
        <div className="fixed bottom-5 right-5 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-panel text-primary shadow-2xl text-xs font-semibold transition-all duration-200 max-w-xs sm:max-w-sm">
          {statusMessage.type === 'success' ? (
            <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle size={18} className="text-rose-500 shrink-0" />
          )}
          <span className="flex-1">{statusMessage.text}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-secondary hover:text-primary p-0.5 rounded-md hover:bg-accent/10 transition-colors cursor-pointer"
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="flex flex-1 relative" style={{ height: 'calc(100vh - 56px)' }}>
        <div className="flex-1 h-full">
          <CanvasEditor
            ref={canvasEditorRef}
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
