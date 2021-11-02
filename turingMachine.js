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
 *    Por motivos de compatibilidade, os icones foram substituidos por texto
 *  }
 */

//*************** FUNCTIONS ********************* */
function stringToArray(str){
  if(str.indexOf(",") != -1){
    str = str.split(",")
  }else{
    str = str.split("")
  }
  return str
}

function girininho(currentState, char, goState, write, direction){
  return {
    read: {
      currentState,
      char,
    },
    execute: {
      goState,
      write,
      direction
    }
  } 
}

function TM(obj){
  let fita = []
  for(let i=0; i<6; i++) fita.push(obj.empty)
  
  return {...obj, fita}
}

//********************** MAQUINA DE TURING ************************ */
const turingMachine = TM({
  states: "0",
  alphabet: "a,b,c,1,2,3,§",
  test: "a,b,c,a,b,c",
  initState: "0",
  endState: "1",
  empty: "§",
  comands: [
    girininho("0", "a", "0", "1", "R"),
    girininho("0", "b", "0", "2", "R"),
    girininho("0", "c", "0", "3", "R"),
    girininho("0", "§", "1", "§", "S")
  ]
})

//turingMachine.Q.split(",")
turingMachine.states = stringToArray(turingMachine.states)
turingMachine.alphabet = stringToArray(turingMachine.alphabet)
turingMachine.test = stringToArray(turingMachine.test)

console.log(turingMachine)
let ponteiro = 3


