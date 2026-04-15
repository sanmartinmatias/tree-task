"use client";

import { useState, useEffect, useRef } from 'react';
import TreeCanvas from '@/components/TreeCanvas.js';
import TreeLines from '@/components/TreeLines';
import TaskNode from '@/components/TaskNode';
import taskConfig from '@/data/tasks.json';
import { foreignObject } from 'framer-motion/client';

export default function Home() {
  const [nodes, setNodes] = useState(taskConfig.nodes);
  const [zoom, setZoom] = useState(1);
  const requestRef = useRef();
  const [draggingId, setDraggingId] = useState(null);

  const handlePositionChange = (id, deltaMovement) => {
    setNodes(prev => {
      return { ...prev, [id]: { ...prev[id], pos: { x: getGlobalPos(prev, id).x + deltaMovement.x, y: getGlobalPos(prev, id).y + deltaMovement.y } } };
    });
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const getGlobalPos = (nodes, id) => {
    let current = nodes[id];
    let x = current.pos.x;
    let y = current.pos.y;
    return { x, y };
  };




  const handleDoubleClick = (setNodes,e) => {
    // Only spawn if clicking the background, not a card
    if (e.target !== e.currentTarget) return;

    const rect = e.currentTarget.getBoundingClientRect();

    // Adjust for current zoom and pan
    const mouseX = (e.clientX - rect.left) / zoom;
    const mouseY = (e.clientY - rect.top) / zoom;


    const newId = `node-${Date.now()}`;
    const newNode = {
      id: newId,
      task: "New Task",
      description: "Edit this description...",
      pos: { x: mouseX - 128, y: mouseY },
      children: []
    };

    setNodes(prev => ({
      ...prev,
      [newId]: newNode
    }));
  };

  const animate = () => {
    setNodes(prevNodes => {
      // Create a shallow copy of the state
      const newNodes = { ...prevNodes };
      const nodeIds = Object.keys(newNodes);

      // 1. Calculate Repulsion (Avoid overlap)
      nodeIds.forEach(idA => {
        const nodeA = newNodes[idA];

        nodeIds.forEach(idB => {
          // Skip if same node, or if we are trying to move the node currently being dragged
          if (idA === draggingId || idA === idB || idB === draggingId || idB === taskConfig.rootId) return;

          const nodeB = newNodes[idB];
          const dx = nodeB.pos.x - nodeA.pos.x;
          const dy = nodeB.pos.y - nodeA.pos.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDistance = 250;

          if (distance < minDistance) {
            // Push nodeB away from nodeA
            const force = (minDistance - distance) / distance * 0.05;
            newNodes[idB] = {
              ...newNodes[idB],
              pos: {
                x: newNodes[idB].pos.x + dx * force,
                y: newNodes[idB].pos.y + dy * force
              }
            };
          }
        });
      });

      // 2. Calculate Spring Force (Connections)
      nodeIds.forEach(parentId => {
        const parent = newNodes[parentId];

        parent.children.forEach(childId => {
          const child = newNodes[childId];
          // Skip if child is missing or if child is the one being manually dragged
          if (!child || childId === draggingId) return;

          const dx = child.pos.x - parent.pos.x;
          const dy = child.pos.y - parent.pos.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const idealDist = 300;

          const force = (distance - idealDist) / distance * 0.03;


          const nx = dx / distance;
          const ny = dy / distance;

          newNodes[childId] = {
            ...newNodes[childId],
            pos: {
              x: child.pos.x - nx * force,
              y: child.pos.y - ny * force
            }
          };
        });
      });

      return newNodes;
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  return (
    <main className="h-screen w-screen bg-[#3a6ea5] overflow-hidden relative">
      <TreeCanvas
        zoom={zoom}
        svgContent={
        <TreeLines 
        nodes={nodes}
          onDoubleClick={(e) =>{ handleDoubleClick(setNodes)}}
          getGlobalPos={getGlobalPos}
        />
        }
      >
        {Object.values(nodes).map((node) => {
          // Find the parent of this specific node
          const parentId = Object.keys(nodes).find(key =>
            nodes[key].children && nodes[key].children.includes(node.id)
          );
          const parentY = parentId ? nodes[parentId].pos.y + 100 : undefined;
          return (<TaskNode
            key={node.id}
            node={node}
            ParentY={parentY}
            onPositionChange={handlePositionChange}
            setDraggingId={(nodeId) => setDraggingId(nodeId)}
          />
          )
        })};
      </TreeCanvas>

      <div className="fixed inset-0 pointer-events-none"
        onWheel={(e) => {
          if (e.metaKey || e.ctrlKey) {
            setZoom(prev => Math.max(0.1, Math.min(prev - e.deltaY * 0.002, 3)));
          }
        }}
      />
    </main>
  );
}