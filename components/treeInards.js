"use client";
import { useState, useEffect } from 'react';
import TreeCanvas from '@/components/TreeCanvas';
import TreeLines from '@/components/TreeLines';
import TaskNode from '@/components/TaskNode';
import taskConfig from '@/data/tasks.json';
import { useTreePhysics } from '@/hooks/useTreePhysics';
import { createNewNode } from '@/utils/TreeUtils';
import { TreeProvider, useTree } from '@/context/treeContext';

function TreeInards({ zoom }) {
  const { nodes, setNodes, draggingId } = useTree();
  
  // Physics still runs here as it needs the rootId from config
  useTreePhysics(nodes, setNodes, draggingId, taskConfig.rootId);

  const calculateProgress = (nodes) => {
    const allNodes = Object.values(nodes);
    const taskNodes = allNodes.filter(n => n.id !== taskConfig.rootId);
    const completedCount = taskNodes.filter(n => n.completed).length;

    return {
      percentage: taskNodes.length > 0 ? Math.round((completedCount / taskNodes.length) * 100) : 0,
      total: taskNodes.length,
      done: completedCount
    };
  };

  const progress = calculateProgress(nodes);

  return (
    <>
      <div className="fixed top-4 left-4 z-50 bg-white/80 p-4 border-2 border-[#0055E3] shadow-[4px_4px_0px_#000]">
        <h2 className="text-xs font-bold uppercase text-[#0055E3]">Project Progress</h2>
        <div className="w-48 h-4 bg-gray-200 mt-2 border border-gray-400">
          <div
            className="h-full bg-green-500 transition-all duration-1000"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        <p className="text-[10px] mt-1 font-mono">{progress.percentage}% ({progress.done}/{progress.total} Tasks)</p>
      </div>

      <TreeCanvas zoom={zoom} svgContent={<TreeLines nodes={nodes} />}>
        {Object.values(nodes).map(node => (
          <TaskNode key={node.id} node={node} /> 
        ))}
      </TreeCanvas>
    </>
  );
}

export default function Home() {
  const [hasMounted, setHasMounted] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => { setHasMounted(true); }, []);

  if (!hasMounted) return <main className="h-screen w-screen bg-[#ffffff]" />;

  return (
    <TreeProvider>
      <main 
        className="h-screen w-screen bg-[#3a6ea5] overflow-hidden relative"
        onWheel={(e) => {
          if (e.metaKey || e.ctrlKey) {
            setZoom(prev => Math.max(0.1, Math.min(prev - e.deltaY * 0.002, 3)));
          }
        }}
      >
        <TreeInards zoom={zoom} />
      </main>
    </TreeProvider>
  );
}