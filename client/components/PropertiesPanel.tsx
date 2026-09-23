'use client';

import React from 'react';
import { CanvasElement } from '../types/element';

interface PropertiesPanelProps {
  selectedElement: CanvasElement | null;
  onUpdateElement: (id: string, partial: Partial<CanvasElement>) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  onUpdateElement,
}) => {
  if (!selectedElement) {
    return (
      <div
        style={{
          width: '260px',
          padding: '16px',
          backgroundColor: '#ffffff',
          borderLeft: '1px solid #e2e8f0',
          fontSize: '14px',
          color: '#64748b',
        }}
      >
        No element selected
      </div>
    );
  }

  const handleChange = (field: keyof CanvasElement, value: string | number) => {
    onUpdateElement(selectedElement.id, { [field]: value });
  };

  const handleNumberChange = (field: keyof CanvasElement, valStr: string) => {
    const val = parseFloat(valStr);
    if (!isNaN(val)) {
      handleChange(field, val);
    }
  };

  return (
    <div
      style={{
        width: '260px',
        padding: '16px',
        backgroundColor: '#ffffff',
        borderLeft: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        fontSize: '14px',
      }}
    >
      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>
        Properties ({selectedElement.type.toUpperCase()})
      </h3>

      <div style={fieldGroupStyle}>
        <label style={labelStyle}>X</label>
        <input
          type="number"
          value={selectedElement.x}
          onChange={(e) => handleNumberChange('x', e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={fieldGroupStyle}>
        <label style={labelStyle}>Y</label>
        <input
          type="number"
          value={selectedElement.y}
          onChange={(e) => handleNumberChange('y', e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={fieldGroupStyle}>
        <label style={labelStyle}>Width</label>
        <input
          type="number"
          value={selectedElement.width ?? 100}
          onChange={(e) => handleNumberChange('width', e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={fieldGroupStyle}>
        <label style={labelStyle}>Height</label>
        <input
          type="number"
          value={selectedElement.height ?? 100}
          onChange={(e) => handleNumberChange('height', e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={fieldGroupStyle}>
        <label style={labelStyle}>Rotation (°)</label>
        <input
          type="number"
          value={selectedElement.rotation ?? 0}
          onChange={(e) => handleNumberChange('rotation', e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={fieldGroupStyle}>
        <label style={labelStyle}>Fill Color</label>
        <input
          type="color"
          value={selectedElement.fill || '#000000'}
          onChange={(e) => handleChange('fill', e.target.value)}
          style={{ ...inputStyle, padding: '2px', height: '36px', cursor: 'pointer' }}
        />
      </div>

      {selectedElement.type === 'text' && (
        <>
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Text Content</label>
            <input
              type="text"
              value={selectedElement.text ?? ''}
              onChange={(e) => handleChange('text', e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Font Size</label>
            <input
              type="number"
              value={selectedElement.fontSize ?? 20}
              onChange={(e) => handleNumberChange('fontSize', e.target.value)}
              style={inputStyle}
            />
          </div>
        </>
      )}
    </div>
  );
};

const fieldGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 500,
  color: '#64748b',
};

const inputStyle: React.CSSProperties = {
  padding: '6px 8px',
  borderRadius: '4px',
  border: '1px solid #cbd5e1',
  fontSize: '13px',
  width: '100%',
  boxSizing: 'border-box',
};
