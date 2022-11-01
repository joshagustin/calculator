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
window.addEventListener('keydown', keyHandler);

const EQUATION_DELIMITERS = /[+×÷−]+/;
let displayValue = '';
let enableClearAll = false;

function keyHandler(e) {
    const value = e.keyCode;
    const key = document.querySelector(`button[data-key="${e.keyCode}"]`);
    // backspace
    if (value === 8) clearHandler();
    // enter
    else if (value === 13) equalsHandler();
    // add (+)
    else if (value === 187 && e.shiftKey) operatorHandler(key);
    // sub (-)
    else if (value === 189) operatorHandler(key);
    // mul (x)
    else if (value === 88) operatorHandler(key);
    // div (/)
    else if (value === 191) operatorHandler(key);
    // negate (n)
    else if (value === 78) negateNumber();
    // numbers
    else if (value >= 48 && value <= 57 || value === 190) numberHandler(key);
}

function numberHandler(node) {
    if (node instanceof MouseEvent) node = this;
    updateDisplay(displayValue + node.textContent);
    changeClearButton(false)
}

function operatorHandler(node) {
    if (node instanceof MouseEvent) node = this;
    const operatorSymbol = node.textContent;
    // default behavior
    if (!operatorExists()) {
        updateDisplay(displayValue + operatorSymbol);
        changeClearButton(false);
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
        let tmpOperand = getOperator() === 'sub' ?
            Number(displayValue.split(EQUATION_DELIMITERS)[1] * -1) :
            Number(displayValue.split(EQUATION_DELIMITERS)[1]);
        updateDisplay(tmpOperand.toString());
    }
    else if (operandExists('second') || operandExists('first') && operatorExists()) {
        generateSyntaxError();
    }
    changeClearButton(true)
}

function evaluateEquation() {
    const arr = displayValue.split(EQUATION_DELIMITERS);
    const result = operate(getOperator(), Number(arr[0]), Number(arr[1]));
    updateDisplay(result.toString());
    if (typeof(result) === 'string') {
        displayValue = '';
    }
    else if (isNaN(result)) {
        generateSyntaxError()
    }
}

function negateNumber() {
    const operatorSymbol = displayValue[displayValue.search(EQUATION_DELIMITERS)];
    const arr = displayValue.split(EQUATION_DELIMITERS);
    const arrLen = arr.length;
    if (!operandExists('first') || operatorExists() && !operandExists('second')) {
        generateSyntaxError();
        return
    }
    else if (arrLen === 2) {
        const tmp = Number(arr[1]) * -1;
        arr[1] = tmp.toString();
    }
    else {
        const tmp = Number(arr[0]) * -1;
        arr[0] = tmp.toString();
    }

    displayValue = arrLen === 2 ?
        arr[0] + operatorSymbol + arr[1] : arr[0];
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
    const value = displayValue.search(EQUATION_DELIMITERS);
    return value > -1;
}

function operatorIsValid() {
    const tmpOperator = getOperator();
    return tmpOperator === 'add' || tmpOperator === 'sub';
}

function getOperator() {
    const index =  displayValue.search(EQUATION_DELIMITERS);
    const operatorSymbol = displayValue[index];
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
    changeClearButton(false);
}

function clearSingleEntry() {
    displayValue = displayValue.slice(0, -1);
    updateDisplay(displayValue);
}

function generateSyntaxError() {
    updateDisplay('Syntax Error.');
    displayValue = '';
    changeClearButton(true)
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
    // rounds off to 6th decimal place
    if (!isNaN(result)) {
        result = Math.round((result + Number.EPSILON) * 1000000) / 1000000
    }
    return result;
}