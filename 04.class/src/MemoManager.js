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
    for (const fileName of files) {
      const content = await fs.readFile(
        path.join(this.dataDir, fileName),
        "utf-8",
      );
      this.memos.push({ fileName, content });
    }
  }

  async addMemo(content) {
    const fileName = `${Date.now()}.txt`;
    await fs.writeFile(path.join(this.dataDir, fileName), content);
    this.memos.push({ fileName, content });
  }

  listMemoTitles() {
    return this.memos.map((memo) => memo.content.split("\n")[0]);
  }

  getMemo(index) {
    return this.memos[index];
  }

  async deleteMemo(index) {
    return this.#processMemo(index, async (filePath, memo) => {
      await fs.unlink(filePath);
      this.memos.splice(this.memos.indexOf(memo), 1);
      return true;
    });
  }

  async editMemo(index) {
    return this.#processMemo(index, (filePath, memo) => {
      const editor = process.env.EDITOR || "vim";
      return new Promise((resolve) => {
        const child = spawn(editor, [filePath], { stdio: "inherit" });
        child.on("exit", async () => {
          const updatedContent = await fs.readFile(filePath, "utf-8");
          memo.content = updatedContent;
          resolve(true);
        });
      });
    });
  }

  async #processMemo(index, action) {
    const memo = this.getMemo(index);
    if (!memo) {
      return false;
    }
    const filePath = path.join(this.dataDir, memo.fileName);
    if (!(await this.#fileExists(filePath))) {
      return false;
    }
    return action(filePath, memo);
  }

  async #fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
