import type { Node, Edge } from 'reactflow';

export interface ValidationResult {
  sortedNodes: Node[];
  error?: string;
}

export function validateAndSortFlow(nodes: Node[], edges: Edge[]): ValidationResult {
  if (nodes.length === 0) {
    return { sortedNodes: [] };
  }

  if (nodes.length === 1) {
    return { sortedNodes: nodes };
  }

  const adjList = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  nodes.forEach(n => {
    adjList.set(n.id, []);
    inDegree.set(n.id, 0);
  });

  for (const edge of edges) {
    if (!adjList.has(edge.source) || !adjList.has(edge.target)) continue;
    
    adjList.get(edge.source)!.push(edge.target);
    inDegree.set(edge.target, inDegree.get(edge.target)! + 1);
  }

  const queue: string[] = [];
  let startNodeCount = 0;

  nodes.forEach(n => {
    if (inDegree.get(n.id) === 0) {
      queue.push(n.id);
      startNodeCount++;
    }
  });

  // Check for floating / disconnected islands
  if (startNodeCount > 1) {
    return { 
      sortedNodes: [], 
      error: "You have unconnected nodes on the canvas. Please connect all nodes into a single flow path." 
    };
  }

  if (queue.length === 0) {
    return { 
      sortedNodes: [], 
      error: "Your flow has an infinite loop but no starting point! Please ensure there is a clear start node." 
    };
  }

  const sortedIds: string[] = [];
  
  // Kahn's Algorithm for Topological Sort
  while (queue.length > 0) {
    const current = queue.shift()!;
    sortedIds.push(current);

    for (const neighbor of adjList.get(current)!) {
      const newInDegree = inDegree.get(neighbor)! - 1;
      inDegree.set(neighbor, newInDegree);
      if (newInDegree === 0) {
        queue.push(neighbor);
      }
    }
  }

  // Check for internal cycles
  if (sortedIds.length !== nodes.length) {
    return { 
      sortedNodes: [], 
      error: "Your flow contains a circular loop! Please remove it before generating a link." 
    };
  }

  // Reconstruct sorted array
  const nodeMap = new Map<string, Node>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  const sortedNodes = sortedIds.map(id => nodeMap.get(id)!);

  return { sortedNodes };
}
