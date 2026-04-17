import { useEffect, useRef } from 'react';

export function useTreePhysics(nodes, setNodes, draggingId, rootId) {
  const requestRef = useRef();

  const animate = () => {
    setNodes(prevNodes => {
      const newNodes = { ...prevNodes };
      const nodeIds = Object.keys(newNodes);

      nodeIds.forEach(idA => {
        const nodeA = newNodes[idA];
        nodeIds.forEach(idB => {
          if (idA === draggingId || idA === idB || idB === draggingId || idB === rootId) return;
          
          const nodeB = newNodes[idB];
          const dx = nodeB.pos.x - nodeA.pos.x;
          const dy = nodeB.pos.y - nodeA.pos.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDistance = 250;

          if (distance < minDistance) {
            const force = (minDistance - distance) / distance * 0.05;
            newNodes[idB].pos.x += dx * force;
            newNodes[idB].pos.y += dy * force;
          }
        });
      });

      // Spring Forces
      nodeIds.forEach(parentId => {
        newNodes[parentId].children?.forEach(childId => {
          const child = newNodes[childId];
          if (!child || childId === draggingId) return;

          const dx = child.pos.x - newNodes[parentId].pos.x;
          const dy = child.pos.y - newNodes[parentId].pos.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (distance - 300) / distance * 0.03;

          newNodes[childId].pos.x -= (dx / distance) * force;
          newNodes[childId].pos.y -= (dy / distance) * force;
        });
      });

      return newNodes;
    });
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [draggingId]); // Re-bind when dragging state changes
}