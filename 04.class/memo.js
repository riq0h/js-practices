import { MemoManager } from "./src/MemoManager.js";
import readline from "readline";

const memoManager = new MemoManager();

main();

async function main() {
  await memoManager.init();
  await processCommand(process.argv.slice(2));
}

async function processCommand(args) {
  switch (args[0]) {
    case undefined:
      await addMemo();
      break;
    case "-l":
      await listMemos();
      break;
    case "-r":
      await displayMemo();
      break;
    case "-d":
      await processMemoAction("削除", (index) => memoManager.deleteMemo(index));
      break;
    case "-e":
      await processMemoAction("編集", (index) => memoManager.editMemo(index));
      break;
    default:
      console.log("無効なオプションです。");
  }
}

async function listMemos() {
  const titles = memoManager.listMemoTitles();
  titles.forEach((title, index) => {
    console.log(`${index + 1}. ${title}`);
  });
}

async function addMemo() {
  let input = "";
  for await (const chunk of process.stdin) {
    input += chunk;
  }
  await memoManager.addMemo(input.trim());
  console.log("メモが追加されました。");
}

async function promptMemoSelection(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  await listMemos();
  const answer = await new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
  rl.close();
  return parseInt(answer) - 1;
}

async function displayMemo() {
  const index = await promptMemoSelection(
    "表示したいメモの番号を選択してください: ",
  );
  const memo = memoManager.getMemo(index);
  if (memo) {
    console.log(memo.content);
  } else {
    console.log("指定されたメモが存在しません。");
  }
}

async function processMemoAction(action, callback) {
  const index = await promptMemoSelection(
    `${action}したいメモの番号を選択してください: `,
  );
  const result = await callback(index);
  console.log(
    result ? `メモが${action}されました。` : `メモの${action}に失敗しました。`,
  );
}
