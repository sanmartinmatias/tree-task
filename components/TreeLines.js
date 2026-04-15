"use client";

export default function TreeLines({ nodes ,getGlobalPos}) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      {Object.values(nodes).map(node => 
        node.children.map(childId => {
          const child = nodes[childId];
          if (!child) return null;

          return (
            <line 
              key={`${node.id}-${childId}`}
              x1={getGlobalPos(nodes, node.id).x + 150} // Center-bottom of parent
              y1={getGlobalPos(nodes, node.id).y + 50}
              x2={getGlobalPos(nodes, childId).x} // Center-top of child
              y2={getGlobalPos(nodes, childId).y}
              stroke="#0728ff" 
              strokeWidth="2"
            />
          );
        })
      )}
    </svg>
  );
}