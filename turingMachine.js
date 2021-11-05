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
  let fita = []
  for(let i=0; i<6; i++) fita.push(obj.empty)
  
  return {...obj, fita}
}

function calculate(tm){
  tm.states= stringToArray(tm.states)
  tm.alphabet= stringToArray(tm.alphabet)
  tm.test= stringToArray(tm.test)
  let cont= 0
  let pont= 3
  let testLength= tm.test.length()

  for(let i=0 ; i<testLength-1 ; i++){
    const character = tm.test[i]
    
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
  comands: [
    girininho("0,a,0,1,R"),
    girininho("0,b,0,2,R"),
    girininho("0,c,0,3,R"),
    girininho("0,§,1,§,S")
  ]
})

calculate(turingMachine)

//********************END MAQUINA DE TURING************************ */




