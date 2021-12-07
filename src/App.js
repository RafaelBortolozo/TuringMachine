import React, { useState, Row } from 'react'
import './App.css'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Stack from '@material-ui/core/Stack'

const App = () => {
  const title = 'Máquina de Turing'
  const initialState={
    commands: [""]
  }

  const [tm, setTm] = useState({})
  const [commands, setCommands] = useState([""])

  const handleInputCommand = (e) => {
    e.preventDefault()

    setCommands([...commands, ""])
  }

  const stringToArray = (str) => {
    str = str.replace(/\s/g, '')
    if (str.indexOf(",") != -1) {
      str = str.split(",")
    } else {
      str = str.split("")
    }
    return str
  }

  const girininho = (str) => {
    const array = stringToArray(str)
    return {
      read: {
        currentState: array[0],
        char: array[1],
      },
      execute: {
        goState: array[2],
        write: array[3],
        direction: array[4].toUpperCase()
      }
    }
  }

  const createTuringMachine = (obj) => {
    obj.Q = stringToArray(obj.Q)
    obj.sigma = stringToArray(obj.sigma)
    obj.gama = stringToArray(obj.gama)
    obj.F = stringToArray(obj.F)

    let fita = []
    for (let i = 0; i < 3; i++) fita.push(obj.B)
    fita = fita.concat(obj.gama)
    for (let i = 0; i < 3; i++) fita.push(obj.B)

    return { ...obj, fita }
  }

  const directionToInt = (str) => {
    if (str == "R") return 1
    if (str == "L") return -1
    if (str == "S") return 0
  }

  const calculate = (tm) => {
    const error = "\n\tNão foi possível resolver a máquina de Turing!\n"
    let ponteiroFita = 3
    let currentStateFita = tm.q0
    let direction

    if (!machineVerification(tm)) return error //verificar dados da maquina

    for (; ;) { //percorre a fita e salva o caractere apontado 
      let currentCharacterFita = tm.fita[ponteiroFita]
      let count = 0

      for (let girininho of tm.delta) { //percorre todos os girininhos, em busca do "read match" 
        if (girininho.read.currentState == currentStateFita && girininho.read.char == currentCharacterFita) { //se encontrar, executa a acao do girininho
          currentStateFita = girininho.execute.goState            //vai para tal estado
          tm.fita[ponteiroFita] = girininho.execute.write         //substitui o caractere
          direction = directionToInt(girininho.execute.direction) //vai para tal direcao
          ponteiroFita = ponteiroFita + direction                 //update no ponteiro

          // Se detectar direction "S" e o estado final informado,
          // o algoritmo termina e retorna a fita
          if (direction == 0 && tm.F.includes(currentStateFita)) {
            let result = tm.fita.toString()
            result = result.replace(/,/g, " ")
            result = "\nResult: " + result
            return result
          }

          // Caso contrário, apenas continue com o proximo caractere da fita
          break
        }

        count++ //contador para verificar se todos os comandos foram visitados
        if (count == tm.delta.length) return error
      }
    }
  }

  const machineVerification = (tm) => {
    //verificar estado inicial
    if (!tm.Q.includes(tm.q0)) return false

    //verificar estados finais
    for (let endState of tm.F) {
      if (!tm.Q.includes(endState)) return false
    }

    //verificar caractere vazio
    if (!tm.sigma.includes(tm.B)) return false

    //verificar comandos
    for (let girininho of tm.delta) {
      if (!tm.Q.includes(girininho.read.currentState)) return false
      if (!tm.sigma.includes(girininho.read.char)) return false
      if (!tm.Q.includes(girininho.execute.goState)) return false
      if (!tm.sigma.includes(girininho.execute.write)) return false
      if (!girininho.direction == "R" ||
        !girininho.direction == "L" ||
        !girininho.direction == "S") return false
    }

    return true
  }

  return (
    <>
      <h1>{title}</h1>
      <div className="container">
        <Stack direction="row" spacing={2}>
          <Stack spacing={3}>
            <TextField
              required
              id="states"
              placeholder="0,1,2,3,4..."
              label="Q (states)"
              margin="dense"
              value={tm.Q}
              onChange={(event) => {
                setTm({ ...tm, Q: event.target.value })
              }}
            />

            <TextField
              required
              id="alphabet"
              placeholder="a,b,c,1,2,3,▢"
              label="Σ (alphabet)"
              margin="dense"
              value={tm.sigma}
              onChange={(event) => {
                setTm({ ...tm, sigma: event.target.value })
              }}
            />

            <TextField
              required
              id="test"
              placeholder="abcabc"
              label="୮ (word)"
              margin="dense"
              value={tm.gama}
              onChange={(event) => {
                setTm({ ...tm, gama: event.target.value })
              }}
            />

            <TextField
              required
              id="empty"
              placeholder="▢"
              label="▢ (Empty)"
              margin="dense"
              value={tm.B}
              onChange={(event) => {
                setTm({ ...tm, B: event.target.value })
              }}
            />

            <TextField
              required
              id="initState"
              placeholder="0"
              label="q0 (initState)"
              margin="dense"
              value={tm.q0}
              onChange={(event) => {
                setTm({ ...tm, q0: event.target.value })
              }}
            />

            <TextField
              required
              id="endStates"
              placeholder="2,4"
              label="F (endStates)"
              margin="dense"
              value={tm.F}
              onChange={(event) => {
                setTm({ ...tm, F: event.target.value })
              }}
            />
          </Stack>
          <Stack spacing={3}>
            {commands.map((commands, index) => (
              <TextField
                id={index}
                placeholder="0,a,1,a,R"
                label={`ઠ (command ${index + 1})`}
                margin="dense"
                value={commands[index]}
                onChange={(e, index) => {
                  commands[index] = e.target.value
                  setCommands([...commands])
                }}
              />

            ))}

            <Button
              variant="contained"
              color="success"
              onClick={handleInputCommand}>
              + command
            </Button>
          </Stack>

          <Stack spacing={1}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                calculate(tm)
              }}>
              Calculate
            </Button>

            <Button
              variant="contained"
              color="primary">
              Load Example
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setTm(initialState)
                setCommands([""])
              }}>
              Clear fields
            </Button>
          </Stack>
        </Stack>
      </div>
    </>
  )
}

export default App;
