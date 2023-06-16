const math = require("mathjs");
const fs = require("fs");



let letterMapping;

function loadLetterMapping() {
  if (!letterMapping) {

    // Read the JSON file and store it in a variable
    const data = fs.readFileSync("src/data/letter_mapping.json", "utf8");
    letterMapping = JSON.parse(data);

    console.log("Loaded letter mapping");
    // console.log(letterMapping)
  }
}

loadLetterMapping();


function convertToLargeNumber(inputNumber) {
  
  // capture the numbers and operatives
  const expressionRegex = /(\d*[.]?\d*)([A-Za-z]+)/g;
  let convertedExpression = inputNumber.replace(expressionRegex, (match, number, letter) => {
    const digits = letterMapping[letter];
    const convertedNumber = parseFloat(number) * Math.pow(10, digits);
    return convertedNumber.toString();
  });

  console.log(`convertToLargeNumber results:`)
  console.log(`convertedExpression: ${convertedExpression}`);

  return convertedExpression;
}


function evaluateExpression(expression) {
  let result;

  try {
    result = math.evaluate(expression);

    console.log(`result: ${result}`);
  } catch (error) {
    return `Error: ${error.message}`;
  }

  const resultStr = result.toExponential(2);

  console.log(`evaluateExpression results:`)
  console.log(`resultStr: ${resultStr}`)

  return resultStr;
}



function evaluateLargeNumber(inputNumber) {
  loadLetterMapping();

  // Convert the input number to the large number representation
  const convertedExpression = convertToLargeNumber(inputNumber);

  // Evaluate the converted expression using math.js
  const resultStr = evaluateExpression(convertedExpression);

  // Convert the result from exponential notation to decimal number with letter representation
  const decimalResult = convertToDecimalNumber(resultStr);

  console.log(`evaluateLargeNumber results:`)
  console.log(`inputNumber: ${inputNumber}`)
  console.log(`convertedExpression: ${convertedExpression}`)
  console.log(`decimalResult: ${decimalResult}`)

  return decimalResult;
}


function convertToDecimalNumber(resultStr) {
  const decimalRegex = /(\d*[.]?\d*)[eE]([+-]?\d+)/g;
  let decimalResult = resultStr.replace(decimalRegex, (match, number, exponent) => {
    const digits = parseInt(exponent);
    let letter = '';
    
    // Find the matching letter in the letter mapping
    for (const key in letterMapping) {
      if (letterMapping[key] === digits) {
        letter = key;
        break;
      }
    }

    console.log(`convertToDecimalNumber results:`)
    console.log(`number: ${number}`);
    console.log(`exponent: ${exponent}`);
    console.log(`letter: ${letter}`);
    
    // Replace the matched part with the letter
    return number + letter;
  });

  console.log(`decimalResult: ${decimalResult}`);

  return decimalResult;
}


// console.log(evaluateLargeNumber("1.56Q + 2.34Q"));


/**
 * 
 * WIP
 * 
 ****************************************************/

function convertToLetterRepresentation(number) {

  // absolute: non-negative value of a number without regard to its sign
  const absoluteNumber = Math.abs(number);

  console.log(`absoluteNumber: ${absoluteNumber}`)

  // the logarithm of a number x to the base b is the exponent to which b must be 
  // raised to produce x. For example, since 1000 = 103, the logarithm base 10 of 1000 
  // is 3, or log10 (1000) = 3.
  const exponent = Math.floor(Math.log10(absoluteNumber));

  console.log(`exponent: ${exponent}`)

  let letter = "";
  if (exponent in letterMapping) {
    letter = letterMapping[exponent];
    console.log(`letter: ${letter}`)
  }

  const significantDigits = (absoluteNumber / Math.pow(10, exponent)).toFixed(2);

  console.log(`significantDigits: ${significantDigits}${letter}`)
  return `${significantDigits}${letter}`;
}

// const number = 1.7219517748373104e+26;
// // const number = 1000;
// const convertedNumber = convertToLetterRepresentation(number);
// console.log(`convertedNumber: ${convertedNumber}`);





async function EBtoRole(EB) {

  let power = -1;
  while (EB >= 1) {
    EB /= 10;
    power++;
  }
  var roles = {
    0: "Farmer 1",
    1: "Farmer 1",
    2: "Farmer 1",
    3: "Farmer 2",
    4: "Farmer 3",
    5: "Kilofarmer 1",
    6: "Kilofarmer 2",
    7: "Kilofarmer 3",
    8: "Megafarmer 1",
    9: "Megafarmer 2",
    10: "Megafarmer 3",
    11: "Gigafarmer 1",
    12: "Gigafarmer 2",
    13: "Gigafarmer 3",
    14: "Terafarmer 1",
    15: "Terafarmer 2",
    16: "Terafarmer 3",
    17: "Petafarmer 1",
    18: "Petafarmer 2",
    19: "Petafarmer 3",
    20: "Exafarmer 1",
    21: "Exafarmer 2",
    22: "Exafarmer 3",
    23: "Zettafarmer 1",
    24: "Zettafarmer 2",
    25: "Zettafarmer 3",
    26: "Yottafarmer 1",
    27: "Yottafarmer 2",
    28: "Yottafarmer 3",
    29: "Xennafarmer 1",
    30: "Xennafarmer 2",
    31: "Xennafarmer 3",
    32: "Weccafarmer 1",
    33: "Weccafarmer 2",
    34: "Weccafarmer 3",
    35: "Vendafarmer 1",
    36: "Vendafarmer 2",
    37: "Vendafarmer 3",
  };
  return roles[power];
}

module.exports = {
  EBtoRole,
  loadLetterMapping,
  convertToLargeNumber,
  evaluateExpression,
  evaluateLargeNumber,
  convertToDecimalNumber
};
