import React from 'react';
import TopToolbar from './components/top-toolbar/top-toolbar';
import LeftSidebar from './components/layers-toolbars/left-sidebar/left-sidebar';
import Canvas from './components/canvas/canvas';


const ReactCanvasEditor = () => {
  return (
    <div className="flex flex-col h-screen w-screen bg-background text-foreground">
      <TopToolbar />
      <div className="flex flex-1 min-h-0">
        <LeftSidebar />
        <Canvas />
        {/* <RightSidebar /> */}
      </div>
    </div>
  );
};

export default ReactCanvasEditor;