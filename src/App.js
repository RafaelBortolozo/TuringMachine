import React, { useState } from 'react'
import Header from './components/Header.jsx'
import './App.css'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Stack from '@material-ui/core/Stack'

const App = () => {
  const title = "Turing Machine"
  const devName = "Rafael Bortolozo"
  const [result, setResult] = useState({ result: "", success: true });
  const [delta, setDelta] = useState([""])
  const [tm, setTm] = useState({
    Q: "",
    sigma: "",
    gama: "",
    q0: "",
    F: "",
    B: ""
  })

  const initialState = () => {
    setTm({
      Q: "",
      sigma: "",
      gama: "",
      q0: "",
      F: "",
      B: ""
    })
    setDelta([""])
    setResult({ result: "", success: null })
  }

  const loadExample = (e) => {
    e.preventDefault()
    setTm({
      Q: "0,1,2",
      sigma: "a,b,c,d,1,2,3,4,▢",
      gama: "abcdabc",
      q0: "0",
      F: "1,2",
      B: "▢"
    })
    setDelta([
      "0,a,0,1,R",
      "0,b,0,2,R",
      "0,c,0,3,R",
      "0,d,2,4,S",
      "0,▢,1,▢,S"
    ])
    setResult({ result: "", success: null })
  }

  const handleNewCommand = (e) => {
    e.preventDefault()
    setDelta([...delta, ""])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      let tmp = createTuringMachine({ ...tm, delta: [...delta] })
      setResult({ result: calculate(tmp), success: true })
    } catch {
      setResult({ result: "não foi possível resolver esta máquina", success: false })
    }
  }

  const stringToArray = (str) => {
    str = str.replace(/\s/g, '')
    if (str.indexOf(",") !== -1) {
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

    for (let i in obj.delta) {
      obj.delta[i] = girininho(obj.delta[i])
    }

    let fita = []
    for (let i = 0; i < 3; i++) fita.push(obj.B)
    fita = fita.concat(obj.gama)
    for (let i = 0; i < 3; i++) fita.push(obj.B)

    return { ...obj, fita }
  }

  const directionToInt = (str) => {
    if (str === "R") return 1
    if (str === "L") return -1
    if (str === "S") return 0
  }

  const machineVerification = (obj) => {
    //verificar estado inicial
    if (!obj.Q.includes(obj.q0)) return false

    //verificar estados finais
    for (let endState of obj.F) {
      if (!obj.Q.includes(endState)) return false
    }

    //verificar caractere vazio
    if (!obj.sigma.includes(obj.B)) return false

    //verificar comandos
    for (let girininho of obj.delta) {
      if (!obj.Q.includes(girininho.read.currentState)) return false
      if (!obj.sigma.includes(girininho.read.char)) return false
      if (!obj.Q.includes(girininho.execute.goState)) return false
      if (!obj.sigma.includes(girininho.execute.write)) return false
      if (!girininho.direction === "R" ||
        !girininho.direction === "L" ||
        !girininho.direction === "S") return false
    }

    return true
  }

  const calculate = (obj) => {
    const error = "Não foi possível resolver esta máquina"
    let ponteiroFita = 3
    let currentStateFita = obj.q0
    let direction

    if (!machineVerification(obj)) return error //verificar dados da maquina

    for (; ;) { //percorre a fita e salva o caractere apontado 
      let currentCharacterFita = obj.fita[ponteiroFita]
      let count = 0

      for (let girininho of obj.delta) { //percorre todos os girininhos, em busca do "read match" 
        if (girininho.read.currentState === currentStateFita && girininho.read.char === currentCharacterFita) { //se encontrar, executa a acao do girininho
          currentStateFita = girininho.execute.goState            //vai para tal estado
          obj.fita[ponteiroFita] = girininho.execute.write         //substitui o caractere
          direction = directionToInt(girininho.execute.direction) //vai para tal direcao
          ponteiroFita = ponteiroFita + direction                 //update no ponteiro

          // Se detectar direction "S" e o estado final informado,
          // o algoritmo termina e retorna a fita
          if (direction === 0 && obj.F.includes(currentStateFita)) {
            let result = obj.fita.toString()
            result = result.replace(/,/g, " ")
            result = "Result: " + result
            return result
          }

          // Caso contrário, apenas continue com o proximo caractere da fita
          break
        }

        count++ //contador para verificar se todos os comandos foram visitados
        if (count === obj.delta.length) return error
      }
    }
  }

  return (
    <>
      <Header title={title} devName={devName} result={result.result} />
      <div className="container">
        <form onSubmit={handleSubmit}>
          <Stack direction="row" spacing={4}>

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

            <Stack spacing={3} className="commandField">
              {delta.map((delt, index) => (
                <>
                  <TextField
                    required
                    key={index}
                    id={index.toString()}
                    placeholder="0,a,1,a,R"
                    label={`ઠ (command ${index + 1})`}
                    margin="dense"
                    value={delt}

                    onChange={(e) => {
                      delta[index] = e.target.value
                      setDelta([...delta])
                    }}
                  />
                </>
              ))}
              <Button
                variant="contained"
                color="success"
                onClick={handleNewCommand}>
                + command
              </Button>
            </Stack>

            <Stack spacing={1}>
              <Button
                variant="contained"
                color="primary"
                type="submit">
                Calculate
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={loadExample}>
                Load Example
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={initialState}>
                Reset
              </Button>
            </Stack>

          </Stack>
        </form>
      </div>
    </>
  )
}

export default App;
