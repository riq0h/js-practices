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
      const title = this.extractTitleFromFileName(file);
      this.memos.push({ title, content });
    }
  }

  extractTitleFromFileName(fileName) {
    return fileName.substring(
      fileName.indexOf("_") + 1,
      fileName.lastIndexOf("."),
    );
  }

  async addMemo(content) {
    const lines = content.split("\n");
    const title = lines[0];
    const fileName = this.createFileName(title);
    await fs.writeFile(path.join(this.dataDir, fileName), content);
    this.memos.push({ title, content });
  }

  createFileName(title) {
    return `${Date.now()}_${title}.txt`;
  }

  listMemos() {
    return this.memos.map((memo) => memo.title);
  }

  getMemo(index) {
    return this.memos[index];
  }

  async deleteMemo(index) {
    if (!this.isValidIndex(index)) {
      return false;
    }
    const memo = this.memos[index];
    const fileName = await this.findFileNameByTitle(memo.title);
    if (fileName) {
      await fs.unlink(path.join(this.dataDir, fileName));
      this.memos.splice(index, 1);
      return true;
    }
    return false;
  }

  async editMemo(index) {
    if (!this.isValidIndex(index)) {
      return false;
    }
    const memo = this.memos[index];
    const fileName = await this.findFileNameByTitle(memo.title);
    if (fileName) {
      const filePath = path.join(this.dataDir, fileName);
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
    return false;
  }

  isValidIndex(index) {
    return index >= 0 && index < this.memos.length;
  }

  async findFileNameByTitle(title) {
    const files = await fs.readdir(this.dataDir);
    return files.find((file) => file.endsWith(`_${title}.txt`));
  }
}
