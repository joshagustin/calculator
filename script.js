const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operator');
const equals = document.querySelector('.equals');
const clear = document.querySelector('.clear');

numbers.forEach(number => number.addEventListener('click', inputHandler));
operators.forEach(operator => operator.addEventListener('click', inputHandler));
equals.addEventListener('click', inputHandler);
clear.addEventListener('click', clearAll);

const EQUATION_DELIMITERS = /[+x\/\s-]+/;
let displayValue = '';
const equation = {
    operator: null,
    aOperand: null,
    bOperand: null,
};
// number
// operator, change
// operator, regular
// operator, sign
// operator, successive 
// num, operator, equals -> syntax
// operator, num, equals -> conditional syntax
// number, equals -> number
// todo add negative + positive
// todo refactor inputHandler

function updateDisplay(str) {
    displayValue = str;
    const display = document.querySelector('.display');
    display.textContent = displayValue;
}

function inputHandler() {
    const inputType = this.classList[0];
    // change operator
    if (inputType === 'operator' && equation.operator && !operandExists(2)) {
        equation.operator = this.classList[1];
        updateDisplay(displayValue.replace(EQUATION_DELIMITERS, this.textContent));
    }
    // successive operations
    else if (inputType === 'operator' && operandExists(2)) {
        setAndEvaluateEquation(this);
    }
    // add operator
    else if (inputType === 'operator') {
        equation.aOperand = Number(displayValue.split(EQUATION_DELIMITERS)[0]);
        equation.operator = this.classList[1];
        updateDisplay(displayValue += this.textContent);
    }
    // increment number
    else if (inputType === 'number') {
        updateDisplay(displayValue += this.textContent);
    }
    // add sign to first operand
    else if (inputType === 'equals' && equation.operator && operatorIsValid() && !operandExists(1)) {
        clearEquation();
        equation.aOperand = Number(displayValue.replaceAll(' ', ''));
        updateDisplay(equation.aOperand.toString());
    }
    // lacking second operand
    else if (inputType === 'equals' && equation.operator && !operandExists(2)) {
        generateSyntaxError();
    }
    // lacking first operand
    else if (inputType === 'equals' && equation.operator && !operandExists(1)) {
        generateSyntaxError();
    }
    else {
        setAndEvaluateEquation(this);
    }
}

function setAndEvaluateEquation(node) {
    equation.bOperand = Number(displayValue.split(EQUATION_DELIMITERS)[1]);
    const result = operate(equation.operator, equation.aOperand, equation.bOperand);
    equation.aOperand = result;
    if (node.classList[0] === 'operator') {
        equation.operator = node.classList[1];
        updateDisplay(result.toString() + node.textContent);
    }
    else {
        equation.operator = null;
        updateDisplay(result.toString());
    } 
}

function operandExists(option) {
    const arr = displayValue.split(EQUATION_DELIMITERS);
    if (option === 1) {
        return arr[0].length > 0;        
    }
    if (arr.length < 2) return false;
    return arr[1].length > 0;
}

function operatorIsValid() {
    return equation.operator === 'add' || equation.operator === 'sub';
}

function clearAll() {
    updateDisplay('');
    clearEquation();
}

function generateSyntaxError() {
    updateDisplay('Syntax Error.');
    displayValue = '';
    clearEquation();
}

function clearEquation() {
    for (key in equation) {
        equation[key] = null;
    }
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) return 'Forbidden.';
    return a / b;
}

function operate(operator, a, b) {
    let result;
    switch (operator) {
        case 'add': 
            result = add(a, b);
            break;
        case 'sub': 
            result = subtract(a, b);
            break;
        case 'mul': 
            result = multiply(a, b);
            break;
        case 'div': 
            result = divide(a, b);
            break;
    }
    return result;
}