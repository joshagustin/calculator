const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operator');
const equals = document.querySelector('.equals');
const clear = document.querySelector('.clear');
const negate = document.querySelector('.negate');

numbers.forEach(number => number.addEventListener('click', numberHandler));
operators.forEach(operator => operator.addEventListener('click', operatorHandler));
equals.addEventListener('click', equalsHandler);
negate.addEventListener('click', negateNumber);
clear.addEventListener('click', clearHandler);

const EQUATION_DELIMITERS = /[+×÷−]+/;
let displayValue = '';
let enableClearAll = false;
const equation = {
    aOperand: null,
    bOperand: null,
};

function numberHandler() {
    updateDisplay(displayValue + this.textContent);
    changeClearButton(false)
}

function operatorHandler() {
    const operatorSymbol = this.textContent;
    // default behavior
    if (!operatorExists()) {
        updateDisplay(displayValue + operatorSymbol);
        return
    }
    // change operator
    else if (!operandExists('second')) {
        displayValue = displayValue.slice(0, -1);
    }
    // successive operations
    else if (operandExists('first') && operandExists('second')) {
        evaluateEquation();
    }
    // first operand is signed
    else if (operatorIsValid() && !operandExists('first') && operandExists('second')) {
        evaluateEquation();
    }
    else {
        generateSyntaxError();
        return;
    }
    changeClearButton(false)
    updateDisplay(displayValue + operatorSymbol);
}

function equalsHandler() {
    if (operandExists('first') && operandExists('second')) {
        evaluateEquation();
    } 
    // add sign to first operand
    else if (operandExists('second') && operatorIsValid()) {
        const tmpOperator = getOperator();
        let tmpOperand;
        clearEquation();
        tmpOperand = tmp === 'sub' ?
            Number(displayValue.split(EQUATION_DELIMITERS)[1] * -1) :
            Number(displayValue.split(EQUATION_DELIMITERS)[1]);
        updateDisplay(tmpOperand.toString());
    }
    else if (operandExists('second') || operandExists('first') && getOperator()) {
        generateSyntaxError();
    }
    changeClearButton(true)
}

function evaluateEquation() {
    const arr = displayValue.split(EQUATION_DELIMITERS);
    equation.aOperand = Number(arr[0]);
    equation.bOperand = Number(arr[1]);
    const result = operate(getOperator(), equation.aOperand, equation.bOperand);
    clearEquation();
    equation.aOperand = result;
    updateDisplay(result.toString());
}

function negateNumber() {
    const operatorArr = displayValue.split(/[0-9.-]+/);
    const arr = displayValue.split(EQUATION_DELIMITERS);
    const arrLen = arr.length;
    if (!operandExists('first') || getOperator() && !operandExists('second')) {
        generateSyntaxError();
        return
    }
    else if (arrLen === 2) {
        equation.bOperand = Number(arr[1]) * -1;
        arr[1] = equation.bOperand.toString();
    }
    else {
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
        return arr[0].length > 0;
    }
    if (arr.length < 2) return false;
    return arr[1].length > 0;
}

function operatorExists() {
    const operatorArr = displayValue.split(/[0-9.-]+/);
    if (operatorArr.length < 2) return false;
    return operatorArr[1].length > 0;
}

function operatorIsValid() {
    const tmpOperator = getOperator();
    return tmpOperator === 'add' || tmpOperator === 'sub';
}

function getOperator() {
    const operatorSymbol =  displayValue.split(/[0-9.-]+/)[1];
    switch (operatorSymbol) {
        case '+':
            return 'add';
        case '−':
            return 'sub';
        case '×':
            return 'mul';
        case '÷':
            return 'div';
    }
    return false;
}

function clearHandler() {
    if (enableClearAll) {
        clearAll();
    }
    else {
        clearSingleEntry();
    }
}

function changeClearButton(option) {
    enableClearAll = option;
    clear.textContent = option ? 'CLEAR' : 'CE';
}

function clearAll() {
    updateDisplay('');
    clearEquation();
    changeClearButton(false);
}

function clearSingleEntry() {
    displayValue = displayValue.slice(0, -1);
    updateDisplay(displayValue);
}

function generateSyntaxError() {
    updateDisplay('Syntax Error.');
    displayValue = '';
    clearEquation();
    changeClearButton(true)
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