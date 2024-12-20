#!/usr/bin/env node

import { parseArgs } from "node:util";
import { stdout } from "node:process";

const today = new Date();
let year = today.getFullYear();
let month = today.getMonth() + 1;
const week = ["日", "月", "火", "水", "木", "金", "土"];

const options = {
  m: { type: "string" },
  y: { type: "string" },
};

const { values } = parseArgs({ options });

if (values.m) month = parseInt(values.m);
if (values.y) year = parseInt(values.y);

const firstDay = new Date(year, month - 1, 1);
const lastDay = new Date(year, month, 0);

console.log(`${month.toString().padStart(7)} 月 ${year}`);
console.log(week.join(" "));

stdout.write(" ".repeat(3 * firstDay.getDay()));

for (
  let date = new Date(firstDay);
  date <= lastDay;
  date.setDate(date.getDate() + 1)
) {
  let dayString = date.getDate().toString().padStart(2, " ");

  if (date.toDateString() === today.toDateString()) {
    dayString = `\x1b[7m${dayString}\x1b[0m`;
  }

  stdout.write(`${dayString} `);

  if (date.getDay() === 6) {
    console.log();
  }
}

console.log();
