//*************** FUNCTIONS ********************* */
const stringToArray = (str) => {
  str = str.replace(/\s/g, '')
  if(str.indexOf(",") != -1){
    str = str.split(",")
  }else{
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
  for(let i=0; i<3; i++) fita.push(obj.B)
  fita = fita.concat(obj.gama)                
  for(let i=0; i<3; i++) fita.push(obj.B)

  return {...obj, fita}
}

const directionToInt = (str) => {
  if(str == "R") return 1
  if(str == "L") return -1
  if(str == "S") return 0
}

const calculate= (tm) => {
  const error = "\n\tNão foi possível resolver a máquina de Turing!\n"
  let ponteiroFita = 3
  let currentStateFita = tm.q0
  let direction

  if(!machineVerification(tm)) return error //verificar dados da maquina

  for(;;){ //percorre a fita e salva o caractere apontado 
    let currentCharacterFita = tm.fita[ponteiroFita]
    let count = 0

    for(let girininho of tm.delta){ //percorre todos os girininhos, em busca do "read match" 
      if(girininho.read.currentState == currentStateFita && girininho.read.char == currentCharacterFita){ //se encontrar, executa a acao do girininho
        currentStateFita = girininho.execute.goState            //vai para tal estado
        tm.fita[ponteiroFita] = girininho.execute.write         //substitui o caractere
        direction = directionToInt(girininho.execute.direction) //vai para tal direcao
        ponteiroFita = ponteiroFita + direction                 //update no ponteiro
        
        // Se detectar direction "S" e o estado final informado,
        // o algoritmo termina e retorna a fita
        if(direction == 0 && tm.F.includes(currentStateFita)){
          let result = tm.fita.toString()
          result = result.replace(/,/g," ")
          result = "\nResult: " + result
          return result
        }
        
        // Caso contrário, apenas continue com o proximo caractere da fita
        break
      }
      
      count++ //contador para verificar se todos os comandos foram visitados
      if(count == tm.delta.length) return error
    }
  }
}

const machineVerification = (tm) => {
  //verificar estado inicial
  if(!tm.Q.includes(tm.q0)) return false

  //verificar estados finais
  for(let endState of tm.F){
    if(!tm.Q.includes(endState)) return false
  }

  //verificar caractere vazio
  if(!tm.sigma.includes(tm.B)) return false

  //verificar comandos
  for(let girininho of tm.delta){
    if(!tm.Q.includes(girininho.read.currentState)) return false
    if(!tm.sigma.includes(girininho.read.char)) return false
    if(!tm.Q.includes(girininho.execute.goState)) return false 
    if(!tm.sigma.includes(girininho.execute.write)) return false
    if(!girininho.direction == "R" || 
       !girininho.direction == "L" || 
       !girininho.direction == "S") return false
  }

  return true
}

//********************************* MAQUINA DE TURING ********************************** */
//OBS: Para resolver a maquina não precisaria informar todos 
// estes dados, como por exemplo os estados e alfabeto, porém 
// decidi usar todos, respeitando a descrição formal.

// substituir abc por 123 respectivamente
// imagem: https://imgur.com/a/AqTsfo7
const turingMachine1 = createTuringMachine({
  Q: "0,1",
  sigma: "a,b,c,1,2,3,-", 
  gama: "abcabc",
  q0: "0",
  F: "1",
  B: "-",
  delta: [
    girininho("0,a,0,1,R"),
    girininho("0,b,0,2,R"),
    girininho("0,c,0,3,R"),
    girininho("0,-,1,-,S")
  ]
})
console.log(calculate(turingMachine1))


// validar palavras com abc, aceitando 2x "a" e 2x "c"
// imagem: https://imgur.com/a/vcl9Y3G
const turingMachine2 = createTuringMachine({
  Q: "0,1,2,3,4,5,6,7,8,9",
  sigma: "a,b,c,-", 
  gama: "abcabcabc",
  q0: "0",
  F: "9",
  B: "-",
  delta: [
    girininho("0,b,0,b,R"),
    girininho("0,a,1,a,R"),
    girininho("0,c,7,c,R"),
    girininho("1,b,1,b,R"),
    girininho("1,a,2,a,R"),
    girininho("1,c,8,c,R"),
    girininho("2,a,2,a,R"),
    girininho("2,b,2,b,R"),
    girininho("2,c,3,c,R"),
    girininho("3,a,3,a,R"),
    girininho("3,b,3,b,R"),
    girininho("3,c,4,c,R"),
    girininho("4,a,4,a,R"),
    girininho("4,b,4,b,R"),
    girininho("4,c,4,c,R"),
    girininho("4,-,9,-,S"),
    girininho("5,b,5,b,R"),
    girininho("5,c,5,c,R"),
    girininho("5,a,4,a,R"),
    girininho("6,b,6,b,R"),
    girininho("6,c,6,c,R"),
    girininho("6,a,5,a,R"),
    girininho("7,b,7,b,R"),
    girininho("7,a,8,a,R"),
    girininho("7,c,6,c,R"),
    girininho("8,b,8,b,R"),
    girininho("8,a,3,a,R"),
    girininho("8,c,5,c,R"),
  ]
})
console.log(calculate(turingMachine2))


// operação matematica - SOMA
// imagem: https://imgur.com/3hh8cfH
const turingMachine3 = createTuringMachine({
  Q: "0,1,2,3",
  sigma: "1,+,¬", 
  gama: "11+111",
  q0: "0",
  F: "3",
  B: "¬",
  delta: [
    girininho("0,1,0,1,R"),
    girininho("0,+,1,1,R"),
    girininho("1,1,1,1,R"),
    girininho("1,¬,2,¬,L"),
    girininho("2,1,3,¬,S"),
  ]
})
console.log(calculate(turingMachine3))