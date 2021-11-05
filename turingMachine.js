
//*************** FUNCTIONS ********************* */
function stringToArray(str){
  str = str.replace(/\s/g, '')
  if(str.indexOf(",") != -1){
    str = str.split(",")
  }else{
    str = str.split("")
  }
  return str
}

function girininho(str){
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

function TM(obj){
  obj.states= stringToArray(obj.states)
  obj.alphabet= stringToArray(obj.alphabet)
  obj.test= stringToArray(obj.test)
  
  let fita = []
  for(let i=0; i<4; i++) fita.push(obj.empty) // 4 caracteres vazios no inicio
  fita = fita.concat(obj.test)                // caracteres de teste no meio
  for(let i=0; i<4; i++) fita.push(obj.empty) // 4 caracteres vazios no final
                                              // §,§,§,§,1,2,3,1,2,3,§,§,§,§

  return {...obj, fita}
}

function directionToInt(str){
  let direction
  if(str == "R") direction= 1
  else if(str == "L") direction= -1
  else if(str == "S") direction= 0
  return direction
}

function calculate(tm){
  const error = "\n\nNão foi possível resolver essa máquina de Turing"
  let ponteiroFita = 4
  let currentStateFita = tm.initState
  let direction

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

//********************** MAQUINA DE TURING ************************ */
const turingMachine = TM({
  states: "0,1",
  alphabet: "a,1,¨", 
  test: "abcabc",
  initState: "0",
  endState: "1",
  empty: "¨",
  commands: [
    girininho("0,a,0,1,R"),
    girininho("0,b,0,2,R"),
    girininho("0,c,0,3,R"),
    girininho("0,¨,1,¨,S")
  ]
})

const result= calculate(turingMachine)
console.log(result)

//********************END MAQUINA DE TURING************************ */

