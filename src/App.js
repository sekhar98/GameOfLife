import './App.css';
import React, { useCallback, useRef, useState } from "react";
import { produce } from "immer";

const numRows=28; 
const numCols=59; 
const operations = [
  [1,0],
  [-1,0], 
  [0,1],
  [0,-1],
  [-1,1],
  [1,1],
  [1,-1],
  [-1,-1]
]


function App() {
   // State to store the selected input value
   const [selectedValue, setSelectedValue] = useState('2');
   const [selectedValue1, setSelectedValue1] = useState('3');

   // Function to handle dropdown change
   const handleDropdownChange = (event) => {
     setSelectedValue(event.target.value);
   };

   const handleDropdownChange1 = (event) => {
    setSelectedValue1(event.target.value);
   }

   //Function to empty the grid 
   const emptyGrid = () => {
    const rows = []; 
    for(let i = 0; i < numRows; i++)
    {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows; 
   }

  const [grid, setGrid] = useState(()=>{
    const rows=[]; 
    for(let i=0;i<numRows;i++)
    {
      rows.push(Array.from(Array(numCols), ()=>0)) 
    }

    return rows; 
  });

  const [running,setRunning] = useState(false);

  const runningRef = useRef(running); 
  runningRef.current=running;
  const runSimulation = useCallback(() => {
    if(!runningRef.current)
      return;
    
    setGrid((currentGrid)=> {
      return produce(currentGrid,(gridCopy) => {
        for(let i=0;i<numRows;i++)
        {
          for(let j=0;j<numCols;j++)
          {
            let neighbors = 0; 
            operations.forEach(([x,y])=> {
            const newI = (i+x+numRows)%numRows;
            const newJ = (j+y+numCols)%numCols; 
            neighbors += currentGrid[newI][newJ];
          }); 
          if(currentGrid[i][j]===1 &&(neighbors<selectedValue||neighbors>selectedValue1)) 
            gridCopy[i][j]=0; 
          else if(currentGrid[i][j]===0 && neighbors===3) 
            gridCopy[i][j]=1; 

          }
        }


      }); 

    });
  
    

    
    setTimeout(runSimulation, 500);
  },[selectedValue, selectedValue1]);
  return (
    <>
    <button style={{fontWeight:700}} onClick={()=> {
      setRunning(!running);
      if(!running)
      {
        runningRef.current = true;
        runSimulation();
      }
    }
    }>
      {running ? "Stop" : "Start"}
    </button>
    
    <button style={{fontWeight:700}} onClick={()=> {setGrid(emptyGrid);}}>
      Clear
    </button> 

    
      <label class="dropdown" style={{ marginLeft: '550px' }}>Under Population condition : </label>
      <select class="dropdown" id="number-select" value={selectedValue} style={{ marginLeft: '5px' }} onChange={handleDropdownChange}>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
  
      <label class="dropdown" style={{ marginLeft: '70px' }} htmlFor="number-select">Over Population condition : </label>
      <select class="dropdown" id="number-select" value={selectedValue1} style={{ marginLeft: '5px' }} onChange={handleDropdownChange1}>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
  <div class="container"> 
  

    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${numCols},20px)`
    }}

    >
        {grid.map((rows, i) => rows.map((cols, j) => (
          <div
            key={`${i}-${j}`}
            onClick={() => {
              const newGrid = produce(grid, gridCopy => {
                gridCopy[i][j] = gridCopy[i][j] ? 0 : 1;
              });

              setGrid(newGrid);
            } }
            style={{
              width: 20,
              height: 20,
              backgroundColor: grid[i][j] ? 'green' : undefined,
              border: "solid 1px red"
            }} />
        ))
        )}

      </div>
      <div class = "Rules">    
      <h2 style={{ marginLeft: '20px', textDecoration : 'underline' }}>Rules: </h2>
      <ul class="rules-list">
        <li>Rule 1: Any live cell with fewer than two live neighbors dies, as if by underpopulation.</li>
        <li>Rule 2: Any live cell with two or three live neighbors lives on to the next generation.</li>
        <li>Rule 3: Any live cell with more than three live neighbors dies, as if by overpopulation.</li>
        <li>Rule 4: Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.</li>
   
      </ul>
  </div>
      </div></>
    
  );
}

export default App;
