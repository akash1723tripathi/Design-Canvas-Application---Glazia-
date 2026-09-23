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
      <div className="w-[260px] p-4 bg-panel border-l border-border flex items-center justify-center text-[13px] text-secondary transition-colors duration-200">
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

  const inputClass =
    'px-2 py-1.5 rounded-md border border-border bg-input text-primary text-[13px] w-full outline-none transition-colors duration-150 focus:border-accent font-[inherit]';

  return (
    <div className="w-[260px] p-4 bg-panel border-l border-border flex flex-col text-[13px] overflow-y-auto transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="font-semibold text-primary text-[13px]">Properties</span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-accent/12 text-accent text-[11px] font-semibold uppercase tracking-wide">
          {selectedElement.type}
        </span>
      </div>

      {/* Position */}
      <Section label="Position">
        <div className="grid grid-cols-2 gap-2">
          <Field label="X">
            <input
              type="number"
              value={selectedElement.x}
              onChange={(e) => handleNumberChange('x', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Y">
            <input
              type="number"
              value={selectedElement.y}
              onChange={(e) => handleNumberChange('y', e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      {/* Size */}
      <Section label="Size">
        <div className="grid grid-cols-2 gap-2">
          <Field label="W">
            <input
              type="number"
              value={selectedElement.width ?? 100}
              onChange={(e) => handleNumberChange('width', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="H">
            <input
              type="number"
              value={selectedElement.height ?? 100}
              onChange={(e) => handleNumberChange('height', e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      {/* Rotation */}
      <Section label="Rotation">
        <Field label="°">
          <input
            type="number"
            value={selectedElement.rotation ?? 0}
            onChange={(e) => handleNumberChange('rotation', e.target.value)}
            className={inputClass}
          />
        </Field>
      </Section>

      {/* Fill */}
      <Section label="Fill">
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={selectedElement.fill || '#000000'}
            onChange={(e) => handleChange('fill', e.target.value)}
            className="color-swatch w-8 h-8 rounded-md border border-border cursor-pointer p-0 shrink-0 appearance-none"
          />
          <input
            type="text"
            value={selectedElement.fill || '#000000'}
            onChange={(e) => handleChange('fill', e.target.value)}
            className={`${inputClass} flex-1`}
          />
        </div>
      </Section>

      {/* Text (conditional) */}
      {selectedElement.type === 'text' && (
        <Section label="Text">
          <Field label="Content">
            <input
              type="text"
              value={selectedElement.text ?? ''}
              onChange={(e) => handleChange('text', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Font Size" className="mt-2">
            <input
              type="number"
              value={selectedElement.fontSize ?? 20}
              onChange={(e) => handleNumberChange('fontSize', e.target.value)}
              className={inputClass}
            />
          </Field>
        </Section>
      )}
    </div>
  );
};

/* ── Sub-components ───────────────────────────────────────────────── */

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-3 border-t border-border first:border-t-0 first:pt-0">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-secondary mb-2">
        {label}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="text-[11px] font-medium text-secondary mb-1">{label}</div>
      {children}
    </div>
  );
}
