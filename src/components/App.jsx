import React, {useEffect, useRef, useState} from 'react';

import { calculate, trace } from '../utils/calculate.mjs'
import { About } from './About';
import { History } from './History';
import { Workings } from './Workings';

const maxHistory = 20;

// Physical keys that stand in for a button on the keypad
const keyAliases = {
  Enter: "=",
  Backspace: "⌫",
  Escape: "AC",
  Delete: "AC",
  x: "*",
  X: "*",
};
const keypadValues = new Set("0123456789.+-*/^=".split(""));

export const App = () => {
  const [calculation, setCalculation] = useState("")
  const [answer, setAnswer] = useState("");
  const [working, setWorking] = useState(null);
  const [history, setHistory] = useState([]);
  const keypad = useRef(null);

  const handleClear = () => {
    setCalculation("");
    setAnswer("");
    setWorking(null);
  } 

  const handleBackspace = () => {
    // also remove the spaces around an operator, so one press removes one thing
    const thisCalc = calculation.trimEnd().slice(0, -1).trimEnd()
    setCalculation(thisCalc);
  }
  
  const handleBrackets = () => {
    const thisCalc = "(" + calculation + ")";
    setCalculation(thisCalc);
  } 

  const addOperand = (value) => {
    setCalculation(calculation + value);
  }

  const addOperator = (value) => {
    setCalculation(calculation + " " + value + " ");
  }

  const handleOperand = (event) => addOperand(event.target.value)

  const handleOperator = (event) => addOperator(event.target.value)

  const handleCalculate = (event) => {
    event?.preventDefault();
    const result = calculate(calculation);
    setCalculation("");
    setAnswer(result === null ? "Error" : String(result))
    if (result === null) {
      setWorking(null);
      return;
    }
    const expression = calculation.trim();
    setWorking(trace(expression));
    setHistory((previous) => [
      { id: (previous[0]?.id ?? 0) + 1, expression, answer: String(result) },
      ...previous,
    ].slice(0, maxHistory));
  }

  const handleRecall = (entry) => {
    setCalculation("");
    setAnswer(entry.answer);
    setWorking(trace(entry.expression));
  }

  // Let the physical keyboard drive the calculator
  useEffect(() => {
    const press = (value) => {
      const key = [...keypad.current.children].find((child) => child.value === value);
      if (!key) return;
      key.classList.add("pressed");
      setTimeout(() => key.classList.remove("pressed"), 120);
    }

    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      // Enter on a focused control already activates it
      if (event.key === "Enter" && event.target.closest?.("button, a, input[type=button]")) return;

      const value = keyAliases[event.key] ?? event.key;
      if (value === "AC") handleClear();
      else if (value === "⌫") handleBackspace();
      else if (value === "=") handleCalculate();
      else if (value === "(" || value === ")") addOperand(value);
      else if (!keypadValues.has(value)) return;
      else if (/\d|\./.test(value)) addOperand(value);
      else addOperator(value);

      event.preventDefault();
      press(value);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className="page">
      <header className="masthead">
        <h1>Simple Calculator</h1>
        <p>Plain sums, with the workings shown.</p>
      </header>

      <div className="bench">
        <History entries={history} onRecall={handleRecall} onClear={() => setHistory([])} />

        <main>
          <input
            readOnly
            type="text"
            id="display"
            className={calculation ? "" : "answer"}
            name="calc"
            aria-label="Calculator display"
            aria-live="polite"
            value={calculation ? calculation : answer}
          />
          <div id="keyboard" ref={keypad} role="group" aria-label="Calculator keypad">
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

        <Workings working={working} />
      </div>

      <About />

      <footer className="footer">
        <a href="https://github.com/glowkeeper/simple-calculator">Source on GitHub</a>
        <span aria-hidden="true"> · </span>
        <span>Dr Steve Huckle</span>
      </footer>
    </div>
  );
}
