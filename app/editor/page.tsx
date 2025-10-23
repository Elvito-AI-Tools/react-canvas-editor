'use client';

import React from 'react';
import { EditorProvider,  } from '@/contexts/EditorContext';

import ReactCanvasEditor from '@/components/react-canvas-editor/react-canvas-editor';



export default function EditorPage() {
  return (
    <EditorProvider>
      <ReactCanvasEditor />
    </EditorProvider>
  );
}

