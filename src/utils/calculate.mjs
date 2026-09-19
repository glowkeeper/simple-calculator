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

const tokenize = (equation) => {
    if (typeof equation !== 'string') return null;
    if (/[\d.]\s+[\d.]/.test(equation)) return null;

    const compactEquation = equation.replace(/\s+/g, '');
    if (!compactEquation) return [];

    const tokens = compactEquation.match(/(?:\d+(?:\.\d*)?|\.\d+|[+\-*/^()])/g);
    if (!tokens || tokens.join('') !== compactEquation) return null;

    let expectingNumber = true;
    let parenthesisDepth = 0;

    for (const token of tokens) {
        if (isNumeric(token)) {
            if (!expectingNumber) return null;
            expectingNumber = false;
        } else if (token === '(') {
            if (!expectingNumber) return null;
            parenthesisDepth++;
        } else if (token === ')') {
            if (expectingNumber || parenthesisDepth === 0) return null;
            parenthesisDepth--;
            expectingNumber = false;
        } else {
            if (expectingNumber) return null;
            expectingNumber = true;
        }
    }

    if (expectingNumber || parenthesisDepth !== 0) return null;
    return tokens;
}

/*
infix -> RPN
*/
const infixToRPN = (infixTokens) => {

    const outputQueue = queue();
    const operatorStack = stack();
    
    for (const token of infixTokens) {

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
        if (myStack.getSize() < 2) return null;

        const n2 = Number(myStack.pop());
        const n1 = Number(myStack.pop());

        myStack.push(evaluate(n1, n2, token));

      } else {

        myStack.push(token);
      }
    }
  
    if (myStack.getSize() !== 1) return null;
    return Number(myStack.pop());
};

/*
Exposed function - call this with a string conaining the (infix) equation to evaluate 
*/
export const calculate = (equation) => {
    const tokens = tokenize(equation);
    if (!tokens || !tokens.length) return null;

    const rpn = infixToRPN(tokens);
    if (rpn.length) {
        const answer = evalRPN(rpn);
        if (answer !== null && isFinite(answer)) {
            return answer
        }
        return null
    }
    return null    
}
