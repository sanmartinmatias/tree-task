"use client";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const TaskNode = ({ node, parentCoords }) => {
  const containerRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const childCount = node.children?.length || 0;
  const isValid = childCount === 0 || (childCount >= 2 && childCount <= 3);

  const updateCoords = () => {
    if (containerRef.current) {
      // We use offsetLeft/Top because getBoundingClientRect changes with Zoom/Scale
      const el = containerRef.current;
      setCoords({
        x: el.offsetLeft + el.offsetWidth / 2,
        y: el.offsetTop
      });
    }
  };

  useEffect(() => {
    updateCoords();
  }, []);

  return (
    <div className="relative flex flex-col items-center">
      {/* The Connecting Lines */}
      {parentCoords && (
        <svg className="absolute top-0 left-0 w-[2000px] h-[2000px] pointer-events-none -translate-x-1/2 -translate-y-full overflow-visible">
          <line
            x1={parentCoords.x}
            y1={parentCoords.y}
            x2={coords.x}
            y2={coords.y}
            stroke="#39FF14" // Neon Green for visibility
            strokeWidth="4"
          />
        </svg>
      )}

      <motion.div
        ref={containerRef}
        drag
        dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
        dragElastic={0.5}
        onDrag={updateCoords}
        className={`w-64 shadow-[4px_4px_0px_rgba(0,0,0,0.4)] rounded-t-lg border-2 bg-[#ECE9D8] z-10 ${
          isValid ? "border-[#0055E3]" : "border-red-600"
        }`}
      >
        {/* XP Header */}
        <div className={`px-2 py-1 flex justify-between items-center ${
          isValid ? "bg-gradient-to-r from-[#0058e3] to-[#2f8cf5]" : "bg-red-600"
        }`}>
          <span className="text-white font-bold text-xs truncate uppercase">{node.task}</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-[#ec461d] border border-white" />
          </div>
        </div>

        {/* XP Body */}
        <div className="p-4 bg-white m-[2px] border border-gray-400 min-h-[80px]">
          <p className="text-[11px] text-gray-800 leading-tight">{node.description}</p>
        </div>
      </motion.div>

      {/* Recursive Children */}
      {childCount > 0 && (
        <div className="flex flex-row justify-center gap-24 mt-20">
          {node.children.map((child) => (
            <TaskNode 
              key={child.id} 
              node={child} 
              parentCoords={{ x: coords.x, y: coords.y + 120 }} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskNode;