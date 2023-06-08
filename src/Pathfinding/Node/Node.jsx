import React,{useState} from 'react';
import './Node.css';
export default function Node({ isStart,isFinish,isWall,row,col,onMouseDown,onMouseEnter,onMouseUp,Nodeclass,onClick}){
    if (isStart) {
        Nodeclass='node StartNode';
    }else if(isFinish){
        Nodeclass='node FinishNode';
    }else if(isWall){
        Nodeclass='node WallNode';
    }
    
    return(<div id= {`node-${row}-${col}`} className={Nodeclass} 
    onMouseDown={() => onMouseDown(row, col)}
    onMouseEnter={() => onMouseEnter(row, col)}
    onMouseUp={() => onMouseUp()}
    onClick={()=> onClick(row, col)}
    ></div>) 
}
