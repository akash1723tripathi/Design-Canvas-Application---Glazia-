'use client';

import React, { useState } from 'react';
import { ElementType, Canvas } from '../types/element';

interface ToolbarProps {
  canvasName: string;
  onCanvasNameChange: (name: string) => void;
  onAddElement: (type: ElementType) => void;
  onDeleteSelected: () => void;
  hasSelection: boolean;
  onSave: () => void;
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
  onLoadList,
  onSelectCanvasToLoad,
  onNewCanvas,
  isSaving,
}) => {
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

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 16px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        flexWrap: 'wrap',
      }}
    >
      <input
        type="text"
        value={canvasName}
        onChange={(e) => onCanvasNameChange(e.target.value)}
        placeholder="Canvas Name"
        style={{
          padding: '6px 10px',
          borderRadius: '4px',
          border: '1px solid #cbd5e1',
          fontSize: '14px',
          fontWeight: 600,
          marginRight: '12px',
        }}
      />

      <button onClick={() => onAddElement('rect')} style={buttonStyle}>
        Add Rectangle
      </button>
      <button onClick={() => onAddElement('circle')} style={buttonStyle}>
        Add Circle
      </button>
      <button onClick={() => onAddElement('text')} style={buttonStyle}>
        Add Text
      </button>

      <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0', margin: '0 4px' }} />

      <button
        onClick={onDeleteSelected}
        disabled={!hasSelection}
        style={{
          ...buttonStyle,
          backgroundColor: hasSelection ? '#ef4444' : '#f1f5f9',
          color: hasSelection ? '#ffffff' : '#94a3b8',
          cursor: hasSelection ? 'pointer' : 'not-allowed',
        }}
      >
        Delete Selected
      </button>

      <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0', margin: '0 4px' }} />

      <button
        onClick={onSave}
        disabled={isSaving}
        style={{ ...buttonStyle, backgroundColor: '#2563eb', color: '#ffffff' }}
      >
        {isSaving ? 'Saving...' : 'Save'}
      </button>

      <div style={{ position: 'relative' }}>
        <button onClick={handleOpenLoad} style={buttonStyle}>
          Load Canvas
        </button>
        {showLoadDropdown && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '4px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 50,
              minWidth: '200px',
              maxHeight: '250px',
              overflowY: 'auto',
              padding: '4px 0',
            }}
          >
            {loadingList ? (
              <div style={{ padding: '8px 12px', fontSize: '13px', color: '#64748b' }}>
                Loading...
              </div>
            ) : savedCanvases.length === 0 ? (
              <div style={{ padding: '8px 12px', fontSize: '13px', color: '#64748b' }}>
                No saved canvases
              </div>
            ) : (
              savedCanvases.map((c) => (
                <div
                  key={c._id}
                  onClick={() => c._id && handleSelectCanvas(c._id)}
                  style={{
                    padding: '8px 12px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f1f5f9',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#f8fafc')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                >
                  {c.name || 'Untitled Canvas'}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <button onClick={onNewCanvas} style={buttonStyle}>
        New Canvas
      </button>
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: '4px',
  border: '1px solid #cbd5e1',
  backgroundColor: '#ffffff',
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer',
};
