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

const TM = (obj) => {
  obj.states= stringToArray(obj.states)
  obj.alphabet= stringToArray(obj.alphabet)
  obj.test= stringToArray(obj.test)
  
  let fita = []
  for(let i=0; i<4; i++) fita.push(obj.empty) // 4 caracteres vazios no inicio
  fita = fita.concat(obj.test)                // caracteres de teste no meio
  for(let i=0; i<4; i++) fita.push(obj.empty) // 4 caracteres vazios no final
                                              // -,-,-,-,1,2,3,1,2,3,-,-,-,-

  return {...obj, fita}
}

const directionToInt = (str) => {
  let direction
  if(str == "R") direction= 1
  else if(str == "L") direction= -1
  else if(str == "S") direction= 0
  return direction
}

const calculate= (tm) => {
  const error = "\n\tNão foi possível resolver essa máquina de Turing, verifique as entradas!\n"
  let ponteiroFita = 4
  let currentStateFita = tm.initState
  let direction

  if(!machineVerification(tm)) return error

  for(;;){ //percorre a fita e salva o caractere apontado 
    let currentCharacterFita = tm.fita[ponteiroFita]
    let count = 0

    for(let girininho of tm.commands){ //percorre todos os girininhos, em busca do "read match" 
      if(girininho.read.currentState == currentStateFita && girininho.read.char == currentCharacterFita){ //se encontrar, executa a acao do girininho
        currentStateFita = girininho.execute.goState            //vai para tal estado
        tm.fita[ponteiroFita] = girininho.execute.write         //substitui o caractere
        direction = directionToInt(girininho.execute.direction) //vai para tal direcao
        ponteiroFita = ponteiroFita + direction                 //update no ponteiro
        
        // Se detectar direction "S" e o estado final informado,
        // o algoritmo termina e retorna a fita
        if(direction == 0 && currentStateFita == tm.endState){
          let result = tm.fita.toString()
          result = result.replace(/,/g," ")
          result = "\nResult: " + result
          return result
        }
        
        // Caso contrário, apenas continue
        break
      }
      
      count++ //contador para verificar se todos os comandos foram visitados
      if(count == tm.commands.length) return error
    }
  }
}

const machineVerification = (tm) => {
  //verificar empty
  if(!tm.alphabet.includes(tm.empty)) return false

  //verificar estados e alfabeto
  for(let girininho of tm.commands){
    if(!tm.states.includes(girininho.read.currentState)) return false
    if(!tm.states.includes(girininho.execute.goState)) return false 
    if(!tm.alphabet.includes(girininho.read.char)) return false
    if(!tm.alphabet.includes(girininho.execute.write)) return false
  }

  return true
}


//********************************* MAQUINA DE TURING ********************************** */
//OBS: Para resolver a maquina não precisaria informar todos 
// estes dados, como por exemplo os estados e alfabeto, porém 
// decidi usar todos, respeitando a descrição formal.

//substituir abc por 123 respectivamente
//imagem: https://imgur.com/a/AqTsfo7
const turingMachine1 = TM({
  states: "0,1",
  alphabet: "a,b,c,1,2,3,-", 
  test: "abcabc",
  initState: "0",
  endState: "1",
  empty: "-",
  commands: [
    girininho("0,a,0,1,R"),
    girininho("0,b,0,2,R"),
    girininho("0,c,0,3,R"),
    girininho("0,-,1,-,S")
  ]
})
console.log(calculate(turingMachine1))


//validar palavras com abc, aceitando 2x "a" e 2x "c"
//imagem: https://imgur.com/a/vcl9Y3G
const turingMachine2 = TM({
  states: "0,1,2,3,4,5,6,7,8,9",
  alphabet: "a,b,c,-", 
  test: "abcabcabc",
  initState: "0",
  endState: "9",
  empty: "-",
  commands: [
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


// //operação matematica - SOMA
// //imagem: https://imgur.com/3hh8cfH
const turingMachine3 = TM({
  states: "0,1,2,3",
  alphabet: "1,+,¬", 
  test: "11+111",
  initState: "0",
  endState: "3",
  empty: "¬",
  commands: [
    girininho("0,1,0,1,R"),
    girininho("0,+,1,1,R"),
    girininho("1,1,1,1,R"),
    girininho("1,¬,2,¬,L"),
    girininho("2,1,3,¬,S"),
  ]
})
console.log(calculate(turingMachine3))