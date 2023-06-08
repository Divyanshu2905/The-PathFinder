import React,{useState,useEffect} from 'react';
import Node from "./Node/Node"
import { dijkstra,getNodesInShortestPath} from '../Algorithms/Dijkstra';
import "./Pathfinding.css";
import Animate from '../Algorithms/animate'
import Astar from '../Algorithms/Astar';

let isMouseDown = false;

export default function Pathfinder(){
    const [grid, setGrid] = useState([]);
    const [startNodePos, setStartNodePos] = useState({ row: 5, col: 10 });
    const [finishNodePos, setFinishNodePos] = useState({ row: 7, col: 30});
    const [startMoving, setstartMoving]=useState(false);
    const [finishMoving, setfinishMoving]=useState(false);

    useEffect(() => {
        const initialGrid = getGrid();
        setGrid(initialGrid);
        }, []); //empty dependency is used when it is to be used once (only the time of initial render)
    
    const handleMouseClick=(row,col)=>{
        if (startMoving===false &&finishMoving===false) {
            if (row===startNodePos.row && col===startNodePos.col) {
                setstartMoving(true);
            }else if(row===finishNodePos.row && col===finishNodePos.col){
                setfinishMoving(true);
            }
            // else{
            //     const newGrid = newGridWithWall(grid, row, col);
            //     setGrid(newGrid);
            // }
        }else if(startMoving===true && finishMoving===false){
            const newGrid=newStartGrid(grid,row,col);
            setGrid(newGrid);
            setstartMoving(false);
        }else if (startMoving===false && finishMoving===true) {
            const newGrid=newfinishGrid(grid,row,col);
            setGrid(newGrid);
            setfinishMoving(false);
        } 
    }

    const handleMouseDown=(row, col)=>{
        const newGrid = newGridWithWall(grid, row, col);
        setGrid(newGrid);
        isMouseDown = true;
    };
    const handleMouseEnter=(row, col)=>{
        if (isMouseDown) {
            const newGrid = newGridWithWall(grid, row, col);
            setGrid(newGrid);
        }
    };
    const handleMouseUp = () => {
        isMouseDown = false;
    };

    useEffect(() => {
    const handleMouseDown = () => {
        isMouseDown = true;
    };
    
    const handleMouseUp = () => {
        isMouseDown = false;
    };
    
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mouseup', handleMouseUp);
    };
    }, []);

    const getGrid=()=>{
        const grid=[];
        for (let row = 0; row <19; row++) {
            const currentRow = [];   
            for (let col = 0; col <60; col++) {
                currentRow.push(createNode(row,col));
                }
        grid.push(currentRow);
        }
        return grid;
    }
    const newGridWithWall=(grid,row,col)=>{
        const newgrid=grid.slice();  //create copy of original grid
        if (row===finishNodePos.row &&col===finishNodePos.col) {
            return newgrid;
        }else if(row===startNodePos.row &&col===startNodePos.col){
            return newgrid;
        }else{
            const node=newgrid[row][col];
            const newNode = {
            ...node, //spread opeerator
            isWall: !node.isWall,
            };
            newgrid[row][col]=newNode;
        } 
        return newgrid;
    }
    const newStartGrid=(grid,rows,cols)=>{
        const newgrid=grid.slice();
        const node=newgrid[rows][cols];
        const newNode = {
            ...node, //spread opeerator
            isWall: false,
            isStart: true,
        };
        const node2=newgrid[startNodePos.row][startNodePos.col];
        const newNode2 = {
            ...node2, //spread opeerator
            isStart: false,
        };
        newgrid[rows][cols]=newNode;
        newgrid[startNodePos.row][startNodePos.col]=newNode2;
        setStartNodePos({row: rows, col: cols})
        return newgrid;
    }
    const newfinishGrid=(grid,rows,cols)=>{
        const newgrid=grid.slice();
        const node=newgrid[rows][cols];
        const newNode = {
            ...node, //spread opeerator
            isWall: false,
            isFinish: true,
        };
        const node2=newgrid[finishNodePos.row][finishNodePos.col];
        const newNode2 = {
            ...node2, //spread opeerator
            isFinish: false,
        };
        newgrid[rows][cols]=newNode;
        newgrid[finishNodePos.row][finishNodePos.col]=newNode2;
        setFinishNodePos({row: rows, col: cols})
        return newgrid;
    }


    const clearPath = () => {
        for (let row = 0; row <19; row++) { 
            for (let col = 0; col <60; col++) {
                const element = document.getElementById(`node-${row}-${col}`);
                if (row===startNodePos.row && col===startNodePos.col) {
                    element.className = 'node StartNode';
                }else if(row===finishNodePos.row && col ===finishNodePos.col){
                    element.className = 'node FinishNode';
                }else if(grid[row][col].isWall){
                    element.className = 'node WallNode';
                }else{
                    element.className = 'node';
                }
            }
        }
        const newGrid = grid.map(row => {
          return row.map(node => {
            return {
              ...node,
              distance: Infinity,
              isVisited: false,
              previousNode: null,
            };
          });
        });
        setGrid(newGrid);
    };
    
    function reset(){
        for (let row = 0; row <19; row++) { 
            for (let col = 0; col <60; col++) {
                const element = document.getElementById(`node-${row}-${col}`);
                if (row===startNodePos.row && col===startNodePos.col) {
                    element.className = 'node StartNode';
                }else if(row===finishNodePos.row && col ===finishNodePos.col){
                    element.className = 'node FinishNode';
                }else{
                    element.className = 'node';
                }
            }
        }
        const newgrid=getGrid();
        setGrid(newgrid); 
    }
    const createNode=(row,col)=>{
        return{
            col,
            row,
            distance: Infinity,
            isVisited: false,
            isWall: false,
            isStart: row ===startNodePos.row &&col ===startNodePos.col,
            isFinish: row===finishNodePos.row && col ===finishNodePos.col,
            previousNode: null,
            Nodeclass: 'node',
        };
    };
    const visualizeAstar = () => {
        clearPath();
        const startNode = grid[startNodePos.row][startNodePos.col];
        const finishNode = grid[finishNodePos.row][finishNodePos.col];
        const visitedNodes = Astar(grid, startNode, finishNode);
        const NodesInShortestPath = getNodesInShortestPath(finishNode);
        console.log('Visited Nodes:', visitedNodes);
        console.log('Nodes in Shortest Path:', NodesInShortestPath);
        Animate(visitedNodes,NodesInShortestPath);
    };

    const visualize = () => {
        clearPath();
        const startNode = grid[startNodePos.row][startNodePos.col];
        const finishNode = grid[finishNodePos.row][finishNodePos.col];
        const visitedNodes = dijkstra(grid, startNode, finishNode);
        const NodesInShortestPath = getNodesInShortestPath(finishNode);
        console.log('Visited Nodes:', visitedNodes);
        console.log('Nodes in Shortest Path:', NodesInShortestPath);
        Animate(visitedNodes,NodesInShortestPath);
    };

        return(
        <div>
            <div className='Navbar'>
            <div className='headnrule'>
                <h1 className='title'>The PathFinder</h1>
                <div className='rules'>
                    <div className='rule'>⫸StartNode:  <div className='samplestart rule1'></div> FinishNode:  <div className='samplefinish rule1'></div> WallNode:  <div className='samplewall rule1'></div></div>
                    <div className='rule'>⫸To Create Walls click and drag mouse around the grid</div>
                    <div className='rule'>⫸To move start/end point click on respective node and then on any other Node</div>
                </div>
            </div>
                <ul>
                    <li><button onClick={clearPath}>Clear Path</button></li>
                    <li><button onClick={visualizeAstar}>Visualise A*</button></li>
                    <li><button onClick={visualize}>Visualise Dijkstra</button></li>
                    <li><button onClick={reset}>Clear All</button></li>
                </ul>
            </div>
            <div className= "struct">
                {grid.map((row, rowIndex) => {
                    return (<div key={rowIndex} className="divison">
                        {row.map((node,nodeindex) =>
                        <Node key={nodeindex} 
                        col={node.col} 
                        isStart={node.isStart} 
                        row={node.row} 
                        isFinish={node.isFinish} 
                        isWall={node.isWall}
                        Nodeclass={node.Nodeclass} 
                        onClick={()=> handleMouseClick(node.row, node.col)}
                        onMouseDown={() => handleMouseDown(node.row, node.col)}
                        onMouseEnter={() => handleMouseEnter(node.row, node.col)}
                        onMouseUp={handleMouseUp}></Node>)}
                    </div>)
                })}
            </div>
        </div>);
}