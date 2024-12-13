#!/usr/bin/env node

const toWhite = (text) => `\x1b[37m${text}\x1b[0m`;

for (let i = 1; i <= 20; i++) {
  if (i % 3 === 0 && i % 5 === 0) {
    console.log(toWhite("FizzBuzz"));
  } else if (i % 3 === 0) {
    console.log(toWhite("Fizz"));
  } else if (i % 5 === 0) {
    console.log(toWhite("Buzz"));
  } else {
    console.log(toWhite(i));
  }
}
