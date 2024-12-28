#!/usr/bin/env node

import { parseArgs } from "node:util";
import { stdout } from "node:process";

const options = {
  m: { type: "string" },
  y: { type: "string" },
};

const { values } = parseArgs({ options });

const today = new Date();
const year = values.y ? parseInt(values.y) : today.getFullYear();
const month = values.m ? parseInt(values.m) : today.getMonth() + 1;

const firstDate = new Date(year, month - 1, 1);
const lastDate = new Date(year, month, 0);

console.log(`      ${month}月 ${year}`);
console.log("日 月 火 水 木 金 土");

stdout.write("   ".repeat(firstDate.getDay()));

for (
  let date = new Date(firstDate);
  date <= lastDate;
  date.setDate(date.getDate() + 1)
) {
  let dayString = date.getDate().toString().padStart(2);

  if (date.toDateString() === today.toDateString()) {
    dayString = `\x1b[7m${dayString}\x1b[0m`;
  }

  stdout.write(dayString);

  if (date < lastDate) {
    if (date.getDay() === 6) {
      console.log();
    } else {
      stdout.write(" ");
    }
  }
}

console.log();
