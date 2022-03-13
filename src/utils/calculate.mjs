/* 
Simple calculator
*/

import { queue } from './queue.mjs'
import { stack } from './stack.mjs'

/* 
Dijkstra's shunting yard algorithm that turns infix notation to reverse polish notation
https://en.wikipedia.org/wiki/Shunting-yard_algorithm
*/

/*
Helper object for operator precedence and associativity
*/
const operators = {
    "^": {
        precedence: 4,
        associativity: "Right"
    },
    "/": {
        precedence: 3,
        associativity: "Left"
    },
    "*": {
        precedence: 3,
        associativity: "Left"
    },
    "+": {
        precedence: 2,
        associativity: "Left"
    },
    "-": {
        precedence: 2,
        associativity: "Left"
    }
}

/*
Helper functions 
*/
const isNumeric = (char) => {
    return !isNaN(parseFloat(char)) && isFinite(char);
}

const clean = (infix) => {
    for(let i = 0; i < infix.length; i++) {
        if(infix[i] === "") {
            infix.splice(i, 1);
        }
    }
    return infix;
}

/*
infix -> RPN
*/
const infixToRPN = (infix) => {

    const outputQueue = queue();
    const operatorStack = stack();
    
    infix = infix.replace(/\s+/g, "");
    const infixArray = infix.split(/([+\-*/^()])/)
    const myInfixArray = clean(infixArray);
    //console.log('infix', myInfixArray)

    for (const token of myInfixArray) {

        if(isNumeric(token)) {

            outputQueue.enQueue(token);

        } else if(Object.prototype.hasOwnProperty.call(operators, token)) {

            const o1 = token;
            let o2 = operatorStack.top();
            while (Object.prototype.hasOwnProperty.call(operators, o2) && 
                  ((operators[o1].associativity === "Left" && 
                    operators[o1].precedence <= operators[o2].precedence) || (operators[o1].associativity === "Right" && 
                    operators[o1].precedence < operators[o2].precedence))) {
                outputQueue.enQueue(operatorStack.pop());
                o2 = operatorStack.top();
            }
            operatorStack.push(o1);

        } else if(token === "(") {

            operatorStack.push(token);

        } else if(token === ")") {

            while(operatorStack.top() !== "(") {
                outputQueue.enQueue(operatorStack.pop());
            }
            operatorStack.pop();
        }
    }

    while(operatorStack.getSize()) {
        outputQueue.enQueue(operatorStack.pop());
    }

    return outputQueue.toArray();
}

/*
Take array of RPN tokens and produce numeric result
*/
const evaluate = (n1, n2, operand) => {
    if (operand === '+') return n1 + n2;
    if (operand === '-') return n1 - n2;
    if (operand === '*') return n1 * n2;
    if (operand === '/') return n1 / n2;
    if (operand === '^') return Math.pow(n1, n2);
};

const evalRPN = (rPNTokens) => {
    
    const myStack = stack();
  
    for (const token of rPNTokens) {

      if (Object.prototype.hasOwnProperty.call(operators, token)) {
          
        const n2 = Number(myStack.pop());
        const n1 = Number(myStack.pop());

        myStack.push(evaluate(n1, n2, token));

      } else {

        myStack.push(token);
      }
    }
  
    return Number(myStack.pop());
};

/*
Exposed function - call this with a string conaining the (infix) equation to evaluate 
*/
export const calculate = (equation) => {
    const rpn = infixToRPN(equation);
    if (rpn.length) {
        const answer = evalRPN(rpn);
        if ( isFinite( answer) ) {
            return answer
        }
        return null
    }
    return null    
}

