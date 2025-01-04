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
      const title = this.#extractTitleFromFileName(file);
      this.memos.push({ title, content });
    }
  }

  async addMemo(content) {
    const fileName = this.#createFileName();
    await fs.writeFile(path.join(this.dataDir, fileName), content);
    this.memos.push({ title: fileName, content });
  }

  listMemoTitles() {
    return this.memos.map((memo) => {
      const firstLine = memo.content.split("\n")[0];
      return firstLine.length > 50
        ? firstLine.substring(0, 47) + "..."
        : firstLine;
    });
  }

  getMemo(index) {
    return this.isValidIndex(index) ? this.memos[index] : null;
  }

  async deleteMemo(index) {
    const memo = this.getMemo(index);
    if (!memo) {
      return false;
    }
    const filePath = path.join(this.dataDir, memo.title);
    if (await this.#fileExists(filePath)) {
      await fs.unlink(filePath);
      this.memos.splice(index, 1);
      return true;
    }
    return false;
  }

  async editMemo(index) {
    const memo = this.getMemo(index);
    if (!memo) {
      return false;
    }
    const filePath = path.join(this.dataDir, memo.title);
    if (!(await this.#fileExists(filePath))) {
      return false;
    }
    const editor = process.env.EDITOR || "vim";

    return new Promise((resolve) => {
      const child = spawn(editor, [filePath], { stdio: "inherit" });
      child.on("exit", async () => {
        const updatedContent = await fs.readFile(filePath, "utf-8");
        memo.content = updatedContent;
        resolve(true);
      });
    });
  }

  isValidIndex(index) {
    return index >= 0 && index < this.memos.length;
  }

  #createFileName() {
    return `${Date.now()}.txt`;
  }

  #extractTitleFromFileName(fileName) {
    return fileName;
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
