import fs from "fs/promises";
import path from "path";
import { spawn } from "child_process";

export class MemoManager {
  constructor() {
    this.memos = [];
    this.dataDir = path.join(process.cwd(), "data");
  }

  async init() {
    await fs.mkdir(this.dataDir, { recursive: true });
    const files = await fs.readdir(this.dataDir);
    for (const file of files) {
      const content = await fs.readFile(path.join(this.dataDir, file), "utf-8");
      const title = file.substring(
        file.indexOf("_") + 1,
        file.lastIndexOf("."),
      );
      this.memos.push({ title, content });
    }
  }

  async addMemo(content) {
    const lines = content.split("\n");
    const title = lines[0];
    const fileName = `${Date.now()}_${title}.txt`;
    await fs.writeFile(path.join(this.dataDir, fileName), content);
    this.memos.push({ title, content });
  }

  listMemos() {
    return this.memos.map((memo) => memo.title);
  }

  getMemo(index) {
    return this.memos[index];
  }

  async deleteMemo(index) {
    if (index < 0 || index >= this.memos.length) {
      console.log("指定されたメモが存在しません。");
      return false;
    }
    const memo = this.memos[index];
    const files = await fs.readdir(this.dataDir);
    const fileName = files.find((file) => file.endsWith(`_${memo.title}.txt`));
    if (fileName) {
      await fs.unlink(path.join(this.dataDir, fileName));
      this.memos.splice(index, 1);
      return true;
    } else {
      console.log("メモファイルが見つかりません。");
      return false;
    }
  }

  async editMemo(index) {
    if (index < 0 || index >= this.memos.length) {
      console.log("指定されたメモが存在しません。");
      return false;
    }
    const memo = this.memos[index];
    const files = await fs.readdir(this.dataDir);
    const fileName = files.find((file) => file.endsWith(`_${memo.title}.txt`));
    if (fileName) {
      const filePath = path.join(this.dataDir, fileName);
      const editor = process.env.EDITOR || "vim";

      return new Promise((resolve) => {
        const child = spawn(editor, [filePath], {
          stdio: "inherit",
        });

        child.on("exit", async () => {
          const updatedContent = await fs.readFile(filePath, "utf-8");
          memo.content = updatedContent;
          resolve(true);
        });
      });
    } else {
      console.log("メモファイルが見つかりません。");
      return false;
    }
  }
}
