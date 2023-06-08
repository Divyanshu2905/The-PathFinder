export default function Astar(grid,startNode,finishNode){
    const visitedNodes=[];
    startNode.distance=0;
    const unvisitedNodes= new Set();
    unvisitedNodes.add(startNode);
    while(unvisitedNodes.size>0){
        const closestNode=getClosest(unvisitedNodes,finishNode);
        unvisitedNodes.delete(closestNode);
        if (closestNode.isWall) continue;
        if (closestNode.distance === Infinity) return visitedNodes;
        closestNode.isVisited = true;
        visitedNodes.push(closestNode);
        if (closestNode === finishNode) return visitedNodes;
        updateNeighbors(closestNode, grid, unvisitedNodes);
    }
    return visitedNodes;
}
function getClosest(nodes,finishNode){
    let closestNode=null;
    let minTotalCost=Infinity;
    for (const node of nodes) {
        const totalCost = node.distance + heuristics(node, finishNode);
        if (totalCost<minTotalCost) {
            minTotalCost = totalCost;
            closestNode = node;
        }
    }
    for (const node2 of nodes){
        if (minTotalCost===(node2.distance+heuristics(node2,finishNode))){
            if (closestNode.distance<=node2.distance) {
                closestNode=node2;
            }
        }
    }
    return closestNode;
}
function updateNeighbors(closestNode, grid, unvisitedNodes){
    const neighbors=getNeighbors(closestNode,grid);
    for(const neighbor of neighbors){
        if ((closestNode.distance+1)<neighbor.distance) {
            neighbor.distance = closestNode.distance+1;
            neighbor.previousNode = closestNode;
            unvisitedNodes.add(neighbor);
        }
    }
}
function heuristics(node,finishNode){
    const dx=(Math.abs(node.row-finishNode.row));
    const dy=(Math.abs(node.col-finishNode.col));
    // return Math.sqrt((dx*dx)+(dy*dy));
    return (dx+dy);
}
function getNeighbors(node,grid){
    const {row,col}=node;
    const neighbor=[];
    if (row > 0) neighbor.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbor.push(grid[row + 1][col]);
    if (col > 0) neighbor.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbor.push(grid[row][col + 1]);
    return neighbor.filter((neb) => !neb.isVisited);
}

