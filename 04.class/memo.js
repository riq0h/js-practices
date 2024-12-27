import { MemoManager } from "./src/MemoManager.js";
import readline from "readline";

const memoManager = new MemoManager();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  await memoManager.init();

  const args = process.argv.slice(2);

  if (args.length === 0) {
    let input = "";
    for await (const chunk of process.stdin) {
      input += chunk;
    }
    await memoManager.addMemo(input.trim());
    console.log("メモが追加されました。");
  } else if (args[0] === "-l") {
    console.log(memoManager.listMemos().join("\n"));
  } else if (args[0] === "-r") {
    const memos = memoManager.listMemos();
    for (let i = 0; i < memos.length; i++) {
      console.log(`${i + 1}. ${memos[i]}`);
    }
    rl.question("表示したいメモの番号を選択してください: ", (answer) => {
      const index = parseInt(answer) - 1;
      const memo = memoManager.getMemo(index);
      console.log(memo.content);
      rl.close();
    });
  } else if (args[0] === "-d") {
    const memos = memoManager.listMemos();
    for (let i = 0; i < memos.length; i++) {
      console.log(`${i + 1}. ${memos[i]}`);
    }
    rl.question("削除したいメモの番号を選択してください: ", async (answer) => {
      const index = parseInt(answer) - 1;
      const result = await memoManager.deleteMemo(index);
      if (result) {
        console.log("メモが削除されました。");
      } else {
        console.log("メモの削除に失敗しました。");
      }
      rl.close();
    });
  }
}

main().catch(console.error);
