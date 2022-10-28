const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operator');
const equals = document.querySelector('.equals');
numbers.forEach(number => number.addEventListener('click', inputHandler));
operators.forEach(operator => operator.addEventListener('click', inputHandler));
equals.addEventListener('click', inputHandler);

const EQUATION_DELIMITERS = /[+x\/\s-]+/;
let displayValue = '';
const equation = {
    operator: null,
    aOperand: null,
    bOperand: null,
};

function updateDisplay(str) {
    displayValue = str;
    const display = document.querySelector('.display');
    display.textContent = displayValue;
}

function inputHandler() {
    const inputType = this.classList[0];
    // change operator
    if (inputType === 'operator' && equation.operator && !secondOperandExists()) {
        equation.operator = this.classList[1];
        updateDisplay(displayValue.replace(EQUATION_DELIMITERS, this.textContent));
    }
    // successive operations
    else if (inputType === 'operator' && secondOperandExists()) {
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

function secondOperandExists() {
    const arr = displayValue.split(EQUATION_DELIMITERS);
    if (arr.length < 2) return false;
    return arr[1].length > 0;
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
    if (b === 0) return 'error';
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