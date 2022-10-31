const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operator');
const equals = document.querySelector('.equals');
const clear = document.querySelector('.clear');
const negate = document.querySelector('.negate');

numbers.forEach(number => number.addEventListener('click', numberHandler));
operators.forEach(operator => operator.addEventListener('click', operatorHandler));
negate.addEventListener('click', negateNumber);
clear.addEventListener('click', clearAll);

const EQUATION_DELIMITERS = /[+×÷−]+/;
let displayValue = '';
const equation = {
    operator: null,
    aOperand: null,
    bOperand: null,
};

function numberHandler() {
    updateDisplay(displayValue + this.textContent);
}

function operatorHandler() {
    const operatorType = this.classList[1];
    const operatorSymbol = this.textContent;
    // change operator
    if (equation.operator && !operandExists('second')) {
        displayValue = displayValue.slice(0, -1);
    }
    // successive operations
    else if (equation.operator && operandExists('second')) {
        evaluateEquation();
    }
    else if (equation.operator) {
        generateSyntaxError();
        return;
    }
    equation.operator = operatorType;
    updateDisplay(displayValue + operatorSymbol);
}

function evaluateEquation() {
    const arr = displayValue.split(EQUATION_DELIMITERS);
    equation.aOperand = Number(arr[0]);
    equation.bOperand = Number(arr[1]);
    const result = operate(equation.operator, equation.aOperand, equation.bOperand);
    clearEquation();
    equation.aOperand = result;
    updateDisplay(result.toString());
}

function negateNumber() {
    const operatorArr = displayValue.split(/[0-9.-]+/);
    const arr = displayValue.split(EQUATION_DELIMITERS);
    const arrLen = arr.length;
    if (arrLen === 2) {
        equation.bOperand = Number(arr[1]) * -1;
        arr[1] = equation.bOperand.toString();
    }
    else if (arrLen === 1) {
        equation.aOperand = Number(arr[0]) * -1;
        arr[0] = equation.aOperand.toString();
    }

    displayValue = arrLen === 2 ?
        arr[0] + operatorArr[1] + arr[1] : arr[0];
    updateDisplay (displayValue)
}

function updateDisplay(str) {
    displayValue = str;
    const display = document.querySelector('.display');
    display.textContent = displayValue;
}

function operandExists(option) {
    const arr = displayValue.split(EQUATION_DELIMITERS);
    if (option === 'first') {
        return arr[0].length;
    }
    if (arr.length < 2) return false;
    return arr[1].length > 0;
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