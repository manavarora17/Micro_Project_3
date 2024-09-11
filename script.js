const display = document.getElementById('display');
let currentExpression = '';  // This will hold the full expression
let currentInput = '';       // This will hold the current input (number)
let hasDecimal = false;      // Flag to check if the current input already has a decimal point

// Function to update the display with the full expression
const updateDisplay = (value) => {
  display.value = value;
};

// Handling number buttons
const handleNumber = (number) => {
  // Prevent multiple decimals in the same number
  if (number === '.' && hasDecimal) return;
  if (number === '.') hasDecimal = true;

  currentInput += number;
  currentExpression += number;
  updateDisplay(currentExpression);
};

// Handling operator buttons (+, -, *, /)
const handleOperator = (op) => {
  if (currentInput === '' && op === '-') {
    handleNumber(op);  // Allow a negative sign as a first character
    return;
  }

  if (currentInput === '' || /[+\-*/]$/.test(currentExpression)) return;  // Prevent double operators
  
  // Reset decimal flag for the next number
  hasDecimal = false;

  currentExpression += ` ${op} `;
  currentInput = '';  // Reset the input for the next number
  updateDisplay(currentExpression);
};

// Handling DEL button
const handleDel = () => {
  if (currentInput.length > 0) {
    // Handle deletion of the current input
    if (currentInput.slice(-1) === '.') {
      hasDecimal = false;  // If the deleted character was a decimal, reset the flag
    }
    currentInput = currentInput.slice(0, -1);
    currentExpression = currentExpression.slice(0, -1);
  } else if (currentExpression.length > 0) {
    // Remove trailing spaces
    currentExpression = currentExpression.trimEnd();
    // Remove last character from expression
    let lastChar = currentExpression.slice(-1);

    if (/[+\-*/]$/.test(lastChar)) {
      // Remove the trailing operator and any leading/trailing spaces
      currentExpression = currentExpression.slice(0, -1).trimEnd();
    } else {
      // Handle the case where we need to remove a number
      let lastOperatorIndex = Math.max(
        currentExpression.lastIndexOf('+'),
        currentExpression.lastIndexOf('-'),
        currentExpression.lastIndexOf('*'),
        currentExpression.lastIndexOf('/')
      );

      if (lastOperatorIndex > -1) {
        currentExpression = currentExpression.slice(0, lastOperatorIndex + 1).trimEnd();
      } else {
        // Remove entire expression if no operators are present
        currentExpression = '';
      }
    }

    currentInput = '';
    hasDecimal = false;
  }

  updateDisplay(currentExpression || '0');
};

// Handling RESET button
const handleReset = () => {
  currentExpression = '';
  currentInput = '';
  hasDecimal = false;
  updateDisplay('0');
};

// Handling the calculation on pressing '='
const handleEquals = () => {
  // Trim any leading/trailing whitespace
  const trimmedExpression = currentExpression.trim();
  
  // Check if the last character is an operator
  if (/[+\-*/]$/.test(trimmedExpression)) {
    updateDisplay('Error');
    return;
  }

  try {
    // Evaluate the expression safely
    let result = eval(trimmedExpression.replace(/\s/g, ''));
    
    // Restrict the result to 3 decimal places
    if (typeof result === 'number') {
      result = parseFloat(result.toFixed(3));
    }

    currentExpression = result.toString();
    currentInput = currentExpression;
    updateDisplay(currentExpression);
  } catch (error) {
    updateDisplay('Error');
  }
};

// Adding event listeners to buttons
document.querySelectorAll('.btn').forEach((button) => {
  const number = button.getAttribute('data-number');
  const op = button.getAttribute('data-operator');

  if (number !== null) {
    button.addEventListener('click', () => handleNumber(number));
  } else if (op !== null) {
    button.addEventListener('click', () => handleOperator(op));
  }
});

document.getElementById('del').addEventListener('click', handleDel);
document.getElementById('reset').addEventListener('click', handleReset);
document.getElementById('equals').addEventListener('click', handleEquals);
