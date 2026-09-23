'use client';

import React, { useState } from 'react';
import {
  Square,
  Circle,
  Type,
  Trash2,
  Save,
  FolderOpen,
  FilePlus,
  Sun,
  Moon,
  Download,
} from 'lucide-react';
import { useTheme } from '../context/ThemeProvider';
import { ElementType, Canvas } from '../types/element';

interface ToolbarProps {
  canvasName: string;
  onCanvasNameChange: (name: string) => void;
  onAddElement: (type: ElementType) => void;
  onDeleteSelected: () => void;
  hasSelection: boolean;
  onSave: () => void;
  onExportPNG: () => void;
  onLoadList: () => Promise<Canvas[]>;
  onSelectCanvasToLoad: (id: string) => void;
  onNewCanvas: () => void;
  isSaving?: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  canvasName,
  onCanvasNameChange,
  onAddElement,
  onDeleteSelected,
  hasSelection,
  onSave,
  onExportPNG,
  onLoadList,
  onSelectCanvasToLoad,
  onNewCanvas,
  isSaving,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [showLoadDropdown, setShowLoadDropdown] = useState(false);
  const [savedCanvases, setSavedCanvases] = useState<Canvas[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  const handleOpenLoad = async () => {
    if (!showLoadDropdown) {
      setLoadingList(true);
      try {
        const list = await onLoadList();
        setSavedCanvases(list);
      } catch (err) {
        console.error('Failed to load canvas list', err);
      } finally {
        setLoadingList(false);
      }
    }
    setShowLoadDropdown((prev) => !prev);
  };

  const handleSelectCanvas = (id: string) => {
    onSelectCanvasToLoad(id);
    setShowLoadDropdown(false);
  };

  const btnBase =
    'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-transparent text-primary text-xs font-medium cursor-pointer whitespace-nowrap transition-colors duration-150 hover:bg-accent/10 hover:text-accent disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-secondary';

  return (
    <div className="flex items-center gap-1 px-3 py-2 bg-toolbar border-b border-border transition-colors duration-200">
      {/* Canvas name */}
      <input
        type="text"
        value={canvasName}
        onChange={(e) => onCanvasNameChange(e.target.value)}
        placeholder="Canvas Name"
        className="px-2.5 py-1.5 rounded-md border border-border bg-input text-primary text-sm font-semibold w-40 outline-none transition-colors duration-150 focus:border-accent"
      />

      {/* Divider */}
      <div className="w-px h-6 bg-border mx-1.5 shrink-0" />

      {/* Add shapes */}
      <button onClick={() => onAddElement('rect')} className={btnBase}>
        <Square size={14} />
        <span className="hidden sm:inline">Rectangle</span>
      </button>
      <button onClick={() => onAddElement('circle')} className={btnBase}>
        <Circle size={14} />
        <span className="hidden sm:inline">Circle</span>
      </button>
      <button onClick={() => onAddElement('text')} className={btnBase}>
        <Type size={14} />
        <span className="hidden sm:inline">Text</span>
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-border mx-1.5 shrink-0" />

      {/* Delete */}
      <button
        onClick={onDeleteSelected}
        disabled={!hasSelection}
        className={`${btnBase} ${hasSelection ? 'text-danger hover:bg-danger/10 hover:text-danger' : ''}`}
      >
        <Trash2 size={14} />
        <span className="hidden sm:inline">Delete</span>
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-border mx-1.5 shrink-0" />

      {/* Save */}
      <button
        onClick={onSave}
        disabled={isSaving}
        className={`${btnBase} bg-accent text-white border-accent hover:bg-accent/85 hover:text-white`}
      >
        <Save size={14} />
        {isSaving ? 'Saving…' : 'Save'}
      </button>

      {/* Export PNG */}
      <button onClick={onExportPNG} className={btnBase}>
        <Download size={14} />
        <span className="hidden sm:inline">Export PNG</span>
      </button>

      {/* Load */}
      <div className="relative">
        <button onClick={handleOpenLoad} className={btnBase}>
          <FolderOpen size={14} />
          <span className="hidden sm:inline">Load</span>
        </button>
        {showLoadDropdown && (
          <div className="absolute top-full left-0 mt-1.5 bg-panel border border-border rounded-xl shadow-lg z-50 min-w-[220px] max-h-[260px] overflow-y-auto p-1 transition-colors duration-200">
            {loadingList ? (
              <div className="px-3 py-2 text-[13px] text-secondary">Loading…</div>
            ) : savedCanvases.length === 0 ? (
              <div className="px-3 py-2 text-[13px] text-secondary">No saved canvases</div>
            ) : (
              savedCanvases.map((c) => (
                <div
                  key={c._id}
                  onClick={() => c._id && handleSelectCanvas(c._id)}
                  className="px-3 py-2 text-[13px] text-primary cursor-pointer rounded-md transition-colors duration-100 hover:bg-dropdown-hover"
                >
                  {c.name || 'Untitled Canvas'}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* New canvas */}
      <button onClick={onNewCanvas} className={btnBase}>
        <FilePlus size={14} />
        <span className="hidden sm:inline">New</span>
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className={`${btnBase} p-1.5`}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
      </button>
    </div>
  );
};
