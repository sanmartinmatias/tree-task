"use client";
import { motion } from "framer-motion";

const TaskNode = ({ node }) => {
  const childCount = node.children?.length || 0;
  const isValid = childCount === 0 || (childCount >= 2 && childCount <= 3);

  return (
    <div className="flex flex-col items-center mt-8">
      {/* XP Window Container */}
      <motion.div
        drag
        dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
        dragElastic={0.6}
        whileTap={{ scale: 0.98, cursor: "grabbing" }}
        className={`w-64 shadow-[4px_4px_0px_rgba(0,0,0,0.3)] rounded-t-lg border-2 overflow-hidden bg-[#ECE9D8] ${
          isValid ? "border-[#0055E3]" : "border-red-600"
        }`}
      >
        {/* XP Title Bar */}
        <div className={`px-2 py-1 flex justify-between items-center ${
          isValid ? "bg-gradient-to-r from-[#0058e3] to-[#2f8cf5]" : "bg-red-600"
        }`}>
          <span className="text-white font-bold text-sm truncate pr-2">
            {node.task}
          </span>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-[#3d95ff] border border-white flex items-center justify-center text-white text-xs shadow-inner">-</div>
            <div className="w-4 h-4 bg-[#ec461d] border border-white flex items-center justify-center text-white text-xs shadow-inner">x</div>
          </div>
        </div>

        {/* Window Content */}
        <div className="p-3 text-sm text-[#333]">
          <p className="line-clamp-3 leading-tight mb-2 italic text-gray-700">
            {node.description || "No description provided."}
          </p>
          {!isValid && (
            <p className="text-[10px] font-bold text-red-600 uppercase">
              Validation Error: {childCount} Children
            </p>
          )}
        </div>
      </motion.div>

      {/* Connection Line */}
      {childCount > 0 && (
        <div className="w-0.5 h-8 bg-[#0055E3]/30" />
      )}

      {/* Recursive Children */}
      {childCount > 0 && (
        <div className="flex flex-row justify-center gap-12 border-t-2 border-[#0055E3]/20 pt-8 px-4">
          {node.children.map((child) => (
            <TaskNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskNode;