export function dijkstra(grid,startNode,finishNode){
    const visitedNodes=[];
    startNode.distance=0;
    const unvisitedNodes= new Set();
    unvisitedNodes.add(startNode);
    while(unvisitedNodes.size>0){
        const closestNode=getClosest(unvisitedNodes);
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
function getClosest(nodes){
    let closestNode=null;
    for (const node of nodes) {
        if (!closestNode || node.distance < closestNode.distance) {
            closestNode = node;
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
function getNeighbors(node,grid){
    const {row,col}=node;
    const neighbor=[];
    if (row > 0) neighbor.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbor.push(grid[row + 1][col]);
    if (col > 0) neighbor.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbor.push(grid[row][col + 1]);
    return neighbor.filter((neb) => !neb.isVisited);
}

export function getNodesInShortestPath(finishNode){
    const nodesInWay=[];  
    let currentNode=finishNode;
    while (currentNode !== null) {
        nodesInWay.unshift(currentNode); //for adding in reverse order
        currentNode = currentNode.previousNode;
    }
    return nodesInWay
}

