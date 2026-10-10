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
Pass an array as `steps` to have each step of the algorithm recorded in it
*/
const infixToRPN = (infixTokens, steps) => {

    const outputQueue = queue();
    const operatorStack = stack();

    const record = (token, note) => {
        if (!steps) return;
        steps.push({
            token,
            note,
            output: outputQueue.toArray(),
            stack: operatorStack.toArray().reverse()
        });
    }

    for (const token of infixTokens) {

        if(isNumeric(token)) {

            outputQueue.enQueue(token);
            record(token, "A number goes straight to the output queue");

        } else if(Object.prototype.hasOwnProperty.call(operators, token)) {

            const o1 = token;
            const popped = [];
            let o2 = operatorStack.top();
            while (Object.prototype.hasOwnProperty.call(operators, o2) && 
                  ((operators[o1].associativity === "Left" && 
                    operators[o1].precedence <= operators[o2].precedence) || (operators[o1].associativity === "Right" && 
                    operators[o1].precedence < operators[o2].precedence))) {
                popped.push(o2);
                outputQueue.enQueue(operatorStack.pop());
                o2 = operatorStack.top();
            }
            operatorStack.push(o1);
            record(token, popped.length
                ? `Pop ${popped.join(", ")} to the output queue (it takes priority), then push ${o1} onto the stack`
                : `Push ${o1} onto the operator stack`);

        } else if(token === "(") {

            operatorStack.push(token);
            record(token, "Push ( onto the operator stack");

        } else if(token === ")") {

            const popped = [];
            while(operatorStack.top() !== "(") {
                popped.push(operatorStack.top());
                outputQueue.enQueue(operatorStack.pop());
            }
            operatorStack.pop();
            record(token, popped.length
                ? `Pop ${popped.join(", ")} to the output queue, then discard the matching (`
                : "Discard the matching (");
        }
    }

    while(operatorStack.getSize()) {
        const op = operatorStack.pop();
        outputQueue.enQueue(op);
        record(null, `Input finished, so pop ${op} to the output queue`);
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

const evalRPN = (rPNTokens, steps) => {
    
    const myStack = stack();

    const record = (token, note) => {
        if (steps) steps.push({ token, note, stack: myStack.toArray().reverse() });
    }
  
    for (const token of rPNTokens) {

      if (Object.prototype.hasOwnProperty.call(operators, token)) {
        if (myStack.getSize() < 2) return null;

        const n2 = Number(myStack.pop());
        const n1 = Number(myStack.pop());
        const result = evaluate(n1, n2, token);

        myStack.push(result);
        record(token, `Pop ${n2} and ${n1}, work out ${n1} ${token} ${n2} = ${result}, push ${result}`);

      } else {

        myStack.push(token);
        record(token, `Push ${token}`);
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


/*
As calculate, but also returns the working: the tokens, each shunting yard step, the RPN
and each evaluation step. Returns null if the equation can't be calculated
*/
export const trace = (equation) => {
    const tokens = tokenize(equation);
    if (!tokens || !tokens.length) return null;

    const parsing = [];
    const rpn = infixToRPN(tokens, parsing);

    const evaluation = [];
    const answer = evalRPN(rpn, evaluation);
    if (answer === null || !isFinite(answer)) return null;

    return { tokens, parsing, rpn, evaluation, answer };
}
