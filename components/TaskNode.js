"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function TaskNode({ node, onPositionChange, setDraggingId, ParentY }) {
  const topConstraint = ParentY !== undefined ? ParentY : -10000;
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={{
        top: topConstraint,
      }}
      animate={{
        x: node.pos.x,
        y: node.pos.y
      }}
      // 2. Use a transition of 0 or a very high stiffness spring 
      // so it doesn't "lag" behind the physics calculation
      transition={{ type: "tween", duration: 0 }}
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
        if (ParentY !== undefined && nextY < ParentY) {
            constrainedDeltaY = ParentY - node.pos.y;
        }

        onPositionChange(node.id, {
          x: info.delta.x,
          y: constrainedDeltaY
        });
        setDraggingId(node.id)
      }}


      className="w-64 bg-[#ECE9D8] border-2 border-[#0055E3] shadow-[3px_3px_0px_#000] rounded-t-lg z-20 select-none"
    >

      <div className="bg-[#0058e3] px-2 py-1 flex justify-between cursor-move">
        <span className="text-white font-bold text-[10px] uppercase">{node.task}</span>
      </div>
      <div className="p-3 bg-white m-[1px] border border-gray-400 min-h-[60px]">
        <p className="text-[11px] text-gray-800">{node.description}</p>
      </div>
    </motion.div>
  );
}