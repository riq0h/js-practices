import { MemoManager } from "./src/MemoManager.js";

const memoManager = new MemoManager();

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
  }
}

main().catch(console.error);
