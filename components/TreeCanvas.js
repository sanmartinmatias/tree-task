"use client";
import { motion } from "framer-motion";

export default function TreeCanvas({ zoom, children, svgContent ,handleDoubleClick}) {
    
  return (
    <div className="h-full w-full overflow-auto custom-scrollbar">
      {/* We set a large fixed width/height here so position: absolute 
          has a coordinate plane to live on.
      */}
      <motion.div 
        onDoubleClick={handleDoubleClick}
        style={{ scale: zoom, transformOrigin: 'center top' }}
        className="relative w-[3000px] h-[3000px] bg-[#3a6ea5]"
      >
        {svgContent}
        {children}
      </motion.div>
    </div>
  );
}