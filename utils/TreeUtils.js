export const getGlobalPos = (nodes, id) => ({
  x: nodes[id].pos.x,
  y: nodes[id].pos.y
});

export const createNewNode = (mouseX, mouseY) => ({
  id: `node-${Date.now()}`,
  task: "New Task",
  description: "Edit this description...",
  pos: { x: mouseX - 128, y: mouseY },
  children: []
});

/**
 * Recursively finds the IDs of all parent nodes up to the root.
 */
export const getAncestorPath = (nodes, targetId) => {
  const path = new Set([targetId]);
  let currentId = targetId;

  // We find the parent by looking for the node that contains currentId in its children
  while (true) {
    const parentId = Object.keys(nodes).find(key => 
      nodes[key].children && nodes[key].children.includes(currentId)
    );

    if (parentId) {
      path.add(parentId);
      currentId = parentId;
    } else {
      break; // Reached root
    }
  }
  return path;
};