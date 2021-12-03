import React from 'react'
import './App.css'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

const App = () => {
  const title = 'Máquina de Turing'

  return (
    <div className="container">
      <h1>{title}</h1>
        <form>
          <TextField 
            required 
            id="states" 
            placeholder="0,1,2,3,4..." 
            label="Q (states)" />

          <TextField 
            required 
            id="alphabet" 
            placeholder="a,b,c,1,2,3,▢" 
            label="Σ (alphabet)" />

          <TextField 
            required 
            id="test" 
            placeholder="abcabc" 
            label="୮ (word)" />

          <TextField 
            required 
            id="empty" 
            placeholder="▢" 
            label="▢ (Empty)" />

          <TextField 
            required 
            id="initState" 
            placeholder="0" 
            label="q0 (initState)" />
          
          <TextField 
            required 
            id="endState" 
            placeholder="2,4" 
            label="F (endStates)" />
          
          <TextField 
            required 
            id="commands" 
            placeholder="0,a,1,a,R" 
            label="ઠ (commands)" />
          
          <Button variant="contained" color="primary">
            +
          </Button>
          <Button variant="contained" color="primary">
            Calcular
          </Button>
        </form>
    </div>
  )
}

export default App;
