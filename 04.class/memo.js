import { MemoManager } from "./src/MemoManager.js";
import readline from "readline";

const memoManager = new MemoManager();

async function main() {
  try {
    await initializeApp();
    await processCommand(process.argv.slice(2));
  } catch (error) {
    console.error("エラーが発生しました:", error.message);
  }
}

async function initializeApp() {
  await memoManager.init();
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
      await deleteMemo();
      break;
    case "-e":
      await editMemo();
      break;
    default:
      console.log("無効なオプションです。");
  }
}

async function listMemos() {
  const memoTitles = memoManager.listMemoTitles();
  memoTitles.forEach((title, index) => {
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

async function deleteMemo() {
  const index = await promptMemoSelection(
    "削除したいメモの番号を選択してください: ",
  );
  const result = await memoManager.deleteMemo(index);
  console.log(result ? "メモが削除されました。" : "メモの削除に失敗しました。");
}

async function editMemo() {
  const index = await promptMemoSelection(
    "編集したいメモの番号を選択してください: ",
  );
  const result = await memoManager.editMemo(index);
  console.log(result ? "メモが編集されました。" : "メモの編集に失敗しました。");
}

main().catch(console.error);
