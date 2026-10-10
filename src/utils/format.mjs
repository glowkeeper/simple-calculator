/*
Display helpers: swap the ASCII operators for their proper symbols
*/
const symbols = { "*": "×", "/": "÷", "-": "−" };

export const pretty = (text) => String(text).replace(/[*/-]/g, (char) => symbols[char]);
