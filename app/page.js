"use client";
import TaskNode from '@/components/TaskNode';
import taskData from '@/data/tasks.json';
import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const [scale, setScale] = useState(1);

  return (
    <main className="h-screen w-screen bg-[#3a6ea5] overflow-hidden relative font-sans">
      {/* Zoom Controls */}
      <div className="fixed bottom-5 right-5 z-50 flex gap-2">
        <button 
          onClick={() => setScale(s => Math.min(s + 0.1, 2))}
          className="bg-[#ECE9D8] border-2 border-[#0055E3] px-4 py-2 font-bold shadow-md active:shadow-inner"
        >
          Zoom In (+)
        </button>
        <button 
          onClick={() => setScale(s => Math.max(s - 0.1, 0.3))}
          className="bg-[#ECE9D8] border-2 border-[#0055E3] px-4 py-2 font-bold shadow-md active:shadow-inner"
        >
          Zoom Out (-)
        </button>
      </div>

      {/* Draggable Canvas */}
      <motion.div 
        drag 
        dragMomentum={false}
        style={{ scale }}
        className="cursor-move min-w-[3000px] min-h-[3000px] flex justify-center pt-[500px]"
      >
        <TaskNode node={taskData} />
      </motion.div>
    </main>
  );
}