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
        }, []); 
    
    const handleMouseClick=(row,col)=>{
        if (startMoving===false &&finishMoving===false) {
            if (row===startNodePos.row && col===startNodePos.col) {
                setstartMoving(true);
            }else if(row===finishNodePos.row && col===finishNodePos.col){
                setfinishMoving(true);
            }
            
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
        for (let row = 0; row <20; row++) {
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
        for (let row = 0; row <20; row++) { 
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
        for (let row = 0; row <20; row++) { 
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
        Animate(visitedNodes,NodesInShortestPath);
    };

    const visualize = () => {
        clearPath();
        const startNode = grid[startNodePos.row][startNodePos.col];
        const finishNode = grid[finishNodePos.row][finishNodePos.col];
        const visitedNodes = dijkstra(grid, startNode, finishNode);
        const NodesInShortestPath = getNodesInShortestPath(finishNode);
        Animate(visitedNodes,NodesInShortestPath);
    };

        return(
        <div>
            <div className="bg">
            <h1 className="main-heading">The Path Finder</h1>

                <div className="options">
                    <input type="radio" name="slider" id="initial"></input> 
                    <input type="radio" name="slider" id="Visualise-Dijkstra"></input>
                    <input type="radio" name="slider" id="Visualise-A"></input>
                    <input type="radio" name="slider" id="Clear-Path"></input>
                    <input type="radio" name="slider" id="Clear-All"></input>
                    <nav>
                        <ul>
                            <li><button onClick={visualize}><label for="Visualise-Dijkstra" className="Visualise-Dijkstra">Visualise Dijkstra</label></button></li>
                            <li><button onClick={visualizeAstar}><label for="Visualise-A" className="Visualise-A">Visualise A*</label></button></li>
                            <li><button onClick={clearPath}><label for="Clear-Path" className="Clear-Path">Clear Path</label></button></li>
                            <li><button onClick={reset}><label for="Clear-All" className="Clear-All">Clear All</label></button></li>
                        </ul>    
                        <div class="slider"></div>
                    </nav>
                </div>
            </div>
            <div className="wrapper">
            <a href="#modalbox"><i className="fa-solid fa-info"></i></a>
            </div>

            <div id="modalbox" className="modal">
                <div className="modalcontent">
                    <h1>info</h1>
                    <ul>
                        <li>start node <i className="fa-solid fa-square" value="1"></i>, finish node <i className="fa-solid fa-square" value="2"></i>, wall node <i className="fa-solid fa-square" value="3"></i></li>
                        <li>to create wall, click and drag mouse around the grid</li>
                        <li>to move start/end point click on respective node and then on any other node</li>
                    </ul>
                    <a href="#" className="modalclose">&times;</a>
                </div>
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