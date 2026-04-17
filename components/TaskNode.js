"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTree } from "@/context/treeContext";


export default function TaskNode({node}) {
 // const topConstraint = ParentY !== undefined ? ParentY : -10000;
  const {selectedId,setSelectedId, draggingId, setDraggingId,onPositionChange,toggleComplete} = useTree();

  const isSelected = selectedId === node.id;
  return (
    <motion.div
      drag
      dragMomentum={false}
      onClick={(e) => {
        e.stopPropagation(); // Don't trigger canvas clicks
        setSelectedId(node.id);
      }}
      dragConstraints={{
       // top: topConstraint,
      }}
      animate={{
        x: node.pos.x,
        y: node.pos.y
      }}
      // 2. Use a transition of 0 or a very high stiffness spring 
      // so it doesn't "lag" behind the physics calculation
      transition={{ type: "tween", duration: 0.333 }}
      style={{
        position: "absolute",
        left: 0, // Ensure starting point is 0,0 relative to parent
        top: 0,
      }}

      onDragStart={() => {
        setDraggingId(node.id)
      }}

      onDragEnd={(e, info) => {
        onPositionChange(node.id, {
          x: info.delta.x,
          y: info.delta.y
        });
        setDraggingId(null)
      }}

      onDrag={(e, info) => {
        const nextY = node.pos.y + info.delta.y;

        let constrainedDeltaY = info.delta.y;
      

        onPositionChange(node.id, {
          x: info.delta.x,
          y: constrainedDeltaY
        });
        setDraggingId(node.id)
      }}
    
    className={`w-64 bg-[#ECE9D8] border-2 shadow-[3px_3px_0px_#000] rounded-t-lg z-20 
    ${isSelected ? 'border-[#ffea00] ring-2 ring-yellow-400' : 'border-[#0055E3]'} 
    ${node.completed ? 'opacity-40 grayscale-[20%]' : 'opacity-100'} 
    transition-opacity duration-500`}>

      <div className="bg-[#0058e3] px-2 py-1 flex justify-between cursor-move">
        <span className="text-white font-bold text-[10px] uppercase">{node.task}</span>
      </div>
      <input 
          type="checkbox" 
          checked={!!node.completed} 
          onChange={() => toggleComplete(node.id)}
          className="cursor-pointer"
        />
      <div className="p-3 bg-white m-[1px] border border-gray-400 min-h-[60px]">
        <p className="text-[11px] text-gray-800">{node.description}</p>
      </div>
    </motion.div>
  );
}