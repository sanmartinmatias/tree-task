"use client";
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getAncestorPath, getGlobalPos } from '@/utils/TreeUtils';
import taskConfig from '@/data/tasks.json';

const TreeContext = createContext();

export function TreeProvider({ children }) {
    const [nodes, setNodes] = useState(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("my-tree-tasks.12314qdwewef");
            return saved ? JSON.parse(saved) : taskConfig.nodes;
        }
        return taskConfig.nodes;
    });

    const [dimensions, setDimensions] = useState({});
    const [selectedId, setSelectedId] = useState(null);
    const [draggingId, setDraggingId] = useState(null);

    useEffect(() => {
        localStorage.setItem("my-tree-tasks.12314qdwewef", JSON.stringify(nodes));
    }, [nodes]);

    const ancestorPath = useMemo(() => 
        selectedId ? getAncestorPath(nodes, selectedId) : new Set(), 
    [selectedId, nodes]);

    const updateDimensions = (id, w, h) => {
        setDimensions(prev => ({ ...prev, [id]: { width: w, height: h } }));
    };

    const toggleComplete = (id) => {
        setNodes(prev => ({
            ...prev,
            [id]: { ...prev[id], completed: !prev[id].completed }
        }));
    };

    const handlePositionChange = (id, deltaMovement) => {
        setNodes(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                pos: {
                    x: getGlobalPos(prev, id).x + deltaMovement.x,
                    y: getGlobalPos(prev, id).y + deltaMovement.y
                }
            }
        }));
    };

    const value = {
        nodes, setNodes,
        dimensions, updateDimensions,
        selectedId, setSelectedId,
        draggingId, setDraggingId,
        ancestorPath,
        toggleComplete,
        handlePositionChange
    };

    return <TreeContext.Provider value={value}>{children}</TreeContext.Provider>;
}

export const useTree = () => useContext(TreeContext);