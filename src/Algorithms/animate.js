import React,{useEffect} from "react";
export default function Animate(visitedNodes, NodesInShortestPath){   
        for (let i = 0; i <= visitedNodes.length; i++) {
            if (i === visitedNodes.length) {
              setTimeout(() => {
                animateShortestPath(NodesInShortestPath);
              }, 10 * i);
              return;
            }
            setTimeout(() => {
              const node = visitedNodes[i];
              const element = document.getElementById(`node-${node.row}-${node.col}`);
              if (element) {
                element.className = 'node node-visited';
              }
            }, 10 * i);
        }
}

const animateShortestPath = (NodesInShortestPath) => {
  for (let i = 0; i < NodesInShortestPath.length; i++) {
    setTimeout(() => {
      const node = NodesInShortestPath[i];
      const element = document.getElementById(`node-${node.row}-${node.col}`);
      if (element) {
        element.className = 'node node-shortest-path';
      }
    }, 50 * i);
  }
};