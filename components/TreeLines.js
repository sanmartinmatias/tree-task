import { useTree } from '@/context/treeContext';
import { getGlobalPos } from '@/utils/TreeUtils';

export default function TreeLines({ nodes }) {

    const { ancestorPath } = useTree();
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {Object.values(nodes).map(node =>
                node.children.map(childId => {
                    const child = nodes[childId];
                    if (!child) return null;

                    // A line is highlighted if BOTH the parent and child are in the path
                    const isHighlighted = ancestorPath.has(node.id) && ancestorPath.has(childId);

                    return (
                        <line
                            key={`${node.id}-${childId}`}
                            x1={getGlobalPos(nodes, node.id).x + 128} // Center (w-64 = 256px / 2)
                            y1={getGlobalPos(nodes, node.id).y + 50}
                            x2={getGlobalPos(nodes, childId).x + 128}
                            y2={getGlobalPos(nodes, childId).y + 0} // Top of child
                            stroke={isHighlighted ? "#a25953" : "#1f1f1f"}
                            strokeWidth={isHighlighted ? "4" : "2"}
                            style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
                        />
                    );
                })
            )}
        </svg>
    );
}