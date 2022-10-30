const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operator');
const equals = document.querySelector('.equals');
const clear = document.querySelector('.clear');

numbers.forEach(number => number.addEventListener('click', numberInputHandler));
operators.forEach(operator => operator.addEventListener('click', operatorInputHandler));
equals.addEventListener('click', equalsInputHandler);
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
// neg number, add operator, evaluate neg number first

function updateDisplay(str) {
    displayValue = str;
    const display = document.querySelector('.display');
    display.textContent = displayValue;
}

function numberInputHandler() {
    updateDisplay(displayValue + this.textContent);
}

function equalsInputHandler() {
    // add sign to first operand
    if (equation.operator && operatorIsValid() && !operandExists(1)) {
        clearEquation();
        equation.aOperand = Number(displayValue.replaceAll(' ', ''));
        updateDisplay(equation.aOperand.toString());
    }
    // lacking second operand
    else if (equation.operator && !operandExists(2)) {
        generateSyntaxError();
    }
    // lacking first operand
    else if (equation.operator && !operandExists(1)) {
        generateSyntaxError();
    }
    else {
        setAndEvaluateEquation(this);
    }
}

function operatorInputHandler() {
     // change operator
     if (equation.operator && !operandExists(2)) {
        equation.operator = this.classList[1];
        updateDisplay(displayValue.replace(EQUATION_DELIMITERS, this.textContent));
    }
    // successive operations involving negative first operand
    else if (equation.aOperand < 0 && equation.operator && operandExists(2)) {
        setAndEvaluateEquation(this);
    }
    // add operator to equation with negative first operand
    else if (equation.aOperand < 0) {
        equation.operator = this.classList[1];
        updateDisplay(displayValue + this.textContent)
    } 
    // sign is attached to first operand
    else if (equation.operator && operatorIsValid() && !operandExists(1)){
        clearEquation();
        equation.aOperand = Number(displayValue.replaceAll(' ', ''));
        equation.operator = this.classList[1];
        updateDisplay(equation.aOperand.toString() + this.textContent);
    } 
    // successive operations
    else if (operandExists(1) && operandExists(2)) {
        setAndEvaluateEquation(this);
    }
    // add operator to equation
    else {
        equation.aOperand = Number(displayValue.split(EQUATION_DELIMITERS)[0]);
        equation.operator = this.classList[1];
        updateDisplay(displayValue + this.textContent);
    }
}

function setAndEvaluateEquation(node) {
    if (getEquationLength() > 2) {
        equation.bOperand = Number(displayValue.split(EQUATION_DELIMITERS)[2]);
    }
    else {
        equation.bOperand = Number(displayValue.split(EQUATION_DELIMITERS)[1]);
    }
    const result = operate(equation.operator, equation.aOperand, equation.bOperand);
    equation.aOperand = result;
    // successive operations
    if (node.classList[0] === 'operator') {
        equation.operator = node.classList[1];
        updateDisplay(result.toString() + node.textContent);
    }
    else {
        equation.operator = null;
        updateDisplay(result.toString());
    } 
}

// determines result based on displayValue 
function operandExists(option) {
    const arr = displayValue.split(EQUATION_DELIMITERS);
    let index = arr.length > 2 ? 1 : 0;
    if (option === 1) {
        return arr[index].length > 0;        
    }
    if (arr.length < 2) return false;
    return arr[index + 1].length > 0;
}

function operatorIsValid() {
    return equation.operator === 'add' || equation.operator === 'sub';
}

function getEquationLength() {
    return displayValue.split(EQUATION_DELIMITERS).length;
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