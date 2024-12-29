import { MemoManager } from "./src/MemoManager.js";
import readline from "readline";

const memoManager = new MemoManager();

function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

async function displayMemos() {
  const memos = memoManager.listMemos();
  memos.forEach((memo, index) => {
    console.log(`${index + 1}. ${memo}`);
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

async function viewMemo(rl) {
  await displayMemos();
  const answer = await new Promise((resolve) => {
    rl.question("表示したいメモの番号を選択してください: ", resolve);
  });
  const index = parseInt(answer) - 1;
  const memo = memoManager.getMemo(index);
  if (memo) {
    console.log(memo.content);
  } else {
    console.log("指定されたメモが存在しません。");
  }
}

async function deleteMemo(rl) {
  await displayMemos();
  const answer = await new Promise((resolve) => {
    rl.question("削除したいメモの番号を選択してください: ", resolve);
  });
  const index = parseInt(answer) - 1;
  const result = await memoManager.deleteMemo(index);
  console.log(result ? "メモが削除されました。" : "メモの削除に失敗しました。");
}

async function editMemo(rl) {
  await displayMemos();
  const answer = await new Promise((resolve) => {
    rl.question("編集したいメモの番号を選択してください: ", resolve);
  });
  const index = parseInt(answer) - 1;
  const result = await memoManager.editMemo(index);
  console.log(result ? "メモが編集されました。" : "メモの編集に失敗しました。");
}

async function main() {
  await memoManager.init();

  const args = process.argv.slice(2);
  const rl = createReadlineInterface();

  try {
    switch (args[0]) {
      case undefined:
        await addMemo();
        break;
      case "-l":
        await displayMemos();
        break;
      case "-r":
        await viewMemo(rl);
        break;
      case "-d":
        await deleteMemo(rl);
        break;
      case "-e":
        await editMemo(rl);
        break;
      default:
        console.log("無効なオプションです。");
    }
  } catch (error) {
    console.error("エラーが発生しました:", error.message);
  } finally {
    rl.close();
  }
}

main().catch(console.error);
