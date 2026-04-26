'use client';

import { indentWithTab } from '@codemirror/commands';
import { cpp } from '@codemirror/lang-cpp';
import { Compartment, EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { useEffect, useRef } from 'react';

const editorTheme = EditorView.theme({
  '&': {
    minHeight: '300px',
    backgroundColor: 'var(--code-bg)',
    color: 'var(--code-text)',
  },
  '&.cm-focused': {
    outline: 'none',
  },
  '.cm-scroller': {
    minHeight: '300px',
    fontFamily: 'var(--font-mono)',
  },
  '.cm-content': {
    padding: '14px 16px',
    fontSize: '0.875rem',
    lineHeight: '1.6',
    caretColor: 'var(--primary)',
  },
  '.cm-lineNumbers': {
    minWidth: '2.5rem',
  },
  '.cm-gutters': {
    borderRight: '1px solid var(--line)',
    backgroundColor: 'var(--surface)',
    color: 'var(--label-a)',
  },
  '.cm-activeLine, .cm-activeLineGutter': {
    backgroundColor: 'color-mix(in srgb, var(--surface) 72%, transparent)',
  },
  '.cm-selectionBackground, ::selection': {
    backgroundColor: 'color-mix(in srgb, var(--primary) 22%, transparent) !important',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: 'var(--primary)',
  },
});

interface CodeEditorProps {
  className?: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  value: string;
}

export function CodeEditor({ className, onChange, readOnly = false, value }: CodeEditorProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const editableCompartmentRef = useRef(new Compartment());
  const readOnlyCompartmentRef = useRef(new Compartment());

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!hostRef.current || viewRef.current) {
      return;
    }

    const editableCompartment = editableCompartmentRef.current;
    const readOnlyCompartment = readOnlyCompartmentRef.current;

    const view = new EditorView({
      state: EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          cpp(),
          keymap.of([indentWithTab]),
          editorTheme,
          editableCompartment.of(EditorView.editable.of(!readOnly)),
          readOnlyCompartment.of(EditorState.readOnly.of(readOnly)),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChangeRef.current(update.state.doc.toString());
            }
          }),
        ],
      }),
      parent: hostRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) {
      return;
    }

    const currentValue = view.state.doc.toString();
    if (currentValue !== value) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: value },
      });
    }
  }, [value]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) {
      return;
    }

    view.dispatch({
      effects: [
        editableCompartmentRef.current.reconfigure(EditorView.editable.of(!readOnly)),
        readOnlyCompartmentRef.current.reconfigure(EditorState.readOnly.of(readOnly)),
      ],
    });
  }, [readOnly]);

  return <div ref={hostRef} className={className} />;
}
