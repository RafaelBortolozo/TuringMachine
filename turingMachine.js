/**
 *  Uma maquina de Turing é definida como uma sétupla
 *  M = {
 *    Q = estados (q0, q1, q2...),
 *    Σ = alfabeto (todas as letras da maquina),
 *    r = sequencia a ser verificada,
 *    q0 = estado inicial,
 *    F = estado final,
 *    ᗣ = caracter vazio,
 *    ઠ = objeto com todos os comandos, no formato (q0,1,q1,A,R)
 * 
 *    Por motivos de incompatibilidade, os icones foram substituidos por texto
 *  }
 */

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
      currentState = array[0],
      char = array[1],
    },
      execute: {
        goState = array[2],
        write = array[3],
        direction = array[4]
      }
  }
}

function TM(obj){
  obj.states= stringToArray(obj.states)
  obj.alphabet= stringToArray(obj.alphabet)
  obj.test= stringToArray(obj.test)
  
  let fita = []
  for(let i=0; i<4; i++) fita.push(obj.empty) //4 caracteres vazios no inicio
  fita = [...fita, obj.test]                  //caracteres de teste no meio
  for(let i=0; i<4; i++) fita.push(obj.empty) //4 caracteres vazios no final
                                              //§§§§123123§§§§
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
  let ponteiroFita= 4
  let currentStateFita= tm.initState
  let fitaLength= tm.fita.length()
  let direction

  for(;;){ //percorre a fita e salva o caractere apontado 
    let currentCharacterFita = tm.fita[ponteiroFita]

    for(let girininho in tm.commands){ //percorre todos os girininhos, em busca do "read match" 
      if(girininho.read.currentState == currentStateFita && girininho.read.char == currentCharacterFita){ //se encontrar, executa a acao do girininho
        currentStateFita = girininho.execute.goState            //vai para tal estado
        tm.fita[ponteiroFita] = girininho.execute.write         //substitui o caractere
        direction = directionToInt(girininho.execute.direction) //vai para tal direcao
      }
    }

  }
}

//********************** MAQUINA DE TURING ************************ */
const turingMachine = TM({
  states: "0,1",
  alphabet: "a,b,c,1,2,3,§",
  test: "a,b,c,a,b,c",
  initState: "0",
  endState: "1",
  empty: "§",
  commands: [
    girininho("0,a,0,1,R"),
    girininho("0,b,0,2,R"),
    girininho("0,c,0,3,R"),
    girininho("0,§,1,§,S")
  ]
})

calculate(turingMachine)

//********************END MAQUINA DE TURING************************ */




