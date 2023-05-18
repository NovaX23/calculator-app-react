import { useState } from 'react'
import Wrapper from "./components/Wrapper";
import Screen from "./components/Screen";
import ButtonBox from "./components/ButtonBox";
import Button from "./components/Button";
import './App.css'

const toLocaleString = (number) =>
  String(number).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

const removeSpaces = (number) => number.toString().replace(/\s/g, "");


const btnSymbols = [
    ["C", "+-", "%", "/"],
    [7, 8, 9, "X"],
    [4, 5, 6, "-"],
    [1, 2, 3, "+"],
    [0, ".", "="],
  ];

  
const App = () => {
  

  let [calc, setCalc] = useState({
    number:0,
    sign:"",
    result:0,
  })
 
  const numClickHandler = (event) => {
    event.preventDefault()
    const value = event.target.innerHTML

    if (removeSpaces(calc.number).length < 16){
      setCalc({
        ...calc,
        number:
          calc.number === 0 && value === "0"
          ? "0"
          : removeSpaces(calc.number)  % 1 === 0
          ? toLocaleString(Number(removeSpaces(calc.number + value))) 
          : toLocaleString(calc.number + value),
        result: !calc.sign ? 0 : calc.result
      })
    }
  }

  const commaClickHandler = (event) => {
    event.preventDefault()
    const value = event.target.innerHTML

    setCalc({
      ...calc,
      number: 
        !calc.number.toString().includes(".") ? calc.number + value : calc.number, 
      })
  }

  const signClickHandler = (event) => {
    event.preventDefault()
    const value = event.target.innerHTML

    setCalc({
      ...calc,
      sign: value ,
      result: !calc.result && calc.number ? calc.number : calc.result,
      number: 0,
    })
  }

  const equalsClickHandler = () => {

    if (calc.sign && calc.number) {
      const math = (a, b, sign) => 
        sign === "+"
        ? a + b
        : sign === "-"
        ? a - b
        : sign === "X"
        ? a * b
        : a / b ;

      setCalc({
        ...calc,
        result:
          calc.number === "0" && calc.sign === "/"
            ? "Can't divide with 0"
            : toLocaleString(
                math(
                  Number(removeSpaces(calc.result)),
                  Number(removeSpaces(calc.number)),
                  calc.sign
                )
              ),
        sign: "",
        number: 0,
      });
    }
  };

  const invertClickHandler = () => {

    setCalc({
      ...calc,
      number: calc.number ? toLocaleString(removeSpaces(calc.number) * -1) : 0,
      result: calc.result ? toLocaleString(removeSpaces(calc.result) * -1) : 0,
      sign:"",
    })
  }

  const percentClickHandler = () => {
    let number = calc.number ? parseFloat(removeSpaces(calc.number)) : 0;
    let result = calc.result ? parseFloat(removeSpaces(calc.result)) : 0;
  
    setCalc({
      ...calc,
      number: (number /= Math.pow(100, 1)),
      result: (result /= Math.pow(100, 1)),
      sign: "",
    });
  };

  const resetClickHandler = () => {
    setCalc({
      ...calc,
      number: 0,
      sign: "",
      result: 0,
    })
  }
  

  return (
    <Wrapper>
      <Screen value={calc.number ? calc.number : calc.result}></Screen>
        <ButtonBox>
          {btnSymbols.flat().map((btn, i)=>{
            return(
              <Button
                key={i}
                className={
				btn === "=" ? "equals" :
				btn === "C" ? "clear" : ""}
                value={btn}
                onClick={
                  btn === "C" 
                  ? resetClickHandler
                  : btn === "+-"
                  ? invertClickHandler
                  : btn === "%"
                  ? percentClickHandler
                  : btn === "/" || btn === "X" || btn === "-" || btn === "+"
                  ? signClickHandler
                  : btn === "="
                  ? equalsClickHandler
                  : btn === "."
                  ? commaClickHandler
                  : numClickHandler
                }
            ></Button>
            )
          })}
          
        </ButtonBox>
    </Wrapper>
  )
}

export default App
