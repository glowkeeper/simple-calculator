import React, {useState} from 'react';

import { calculate } from '../utils/calculate.mjs'

export const App = () => {
  const [calculation, setCalculation] = useState("")
  const [answer, setAnswer] = useState("");

  const handleClear = () => {
    setCalculation("");
    setAnswer("");
  } 

  const handleBackspace = () => {
    const thisCalc = calculation.slice(0, -1)
    setCalculation(thisCalc);
  }
  
  const handleBrackets = () => {
    const thisCalc = "(" + calculation + ")";
    setCalculation(thisCalc);
  } 

  const handleOperand = (event) => {
    const thisCalc = calculation + event.target.value
    setCalculation(thisCalc);
  } 

  const handleOperator = (event) => {
    const thisCalc = calculation + " " + event.target.value + " "
    setCalculation(thisCalc);
  } 

  const handleCalculate = (event) => {
    event.preventDefault();
    const result = calculate(calculation);
    setCalculation("");
    setAnswer(result === null ? "Error" : String(result))
  }

  return (
    <main>   
        <input
          readOnly
          type="text"
          id="display"
          name="calc"
          aria-label="Calculator display"
          aria-live="polite"
          value={calculation ? calculation : answer}
        />
        <div id="keyboard" role="group" aria-label="Calculator keypad">
          <input type="button" value="AC" onClick={handleClear}/>
          <input type="button" value="()" aria-label="Wrap in parentheses" onClick={handleBrackets}/>
          <input type="button" value="^" onClick={handleOperator}/>
          <input type="button" value="/" onClick={handleOperator}/>

          <input type="button" value="7" onClick={handleOperand}/>
          <input type="button" value="8" onClick={handleOperand}/>
          <input type="button" value="9" onClick={handleOperand}/>
          <input type="button" value="*" onClick={handleOperator}/>

          <input type="button" value="4" onClick={handleOperand}/>
          <input type="button" value="5" onClick={handleOperand}/>
          <input type="button" value="6" onClick={handleOperand}/>
          <input type="button" value="-" onClick={handleOperator}/>

          <input type="button" value="1" onClick={handleOperand}/>
          <input type="button" value="2" onClick={handleOperand}/>
          <input type="button" value="3" onClick={handleOperand}/>
          <input type="button" value="+" onClick={handleOperator}/>

          <input type="button" value="0" onClick={handleOperand}/>
          <input type="button" value="." onClick={handleOperand}/>
          <input type="button" value="&#9003;" aria-label="Backspace" onClick={handleBackspace}/>
          <input type="button" value="=" onClick={handleCalculate}/>
        </div>   
    </main>
  );
}
