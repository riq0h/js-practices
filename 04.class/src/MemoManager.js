import fs from "fs/promises";
import path from "path";
import { spawn } from "child_process";
import crypto from "crypto";

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

  #extractTitleFromFileName(fileName) {
    return fileName.substring(
      fileName.indexOf("_") + 1,
      fileName.lastIndexOf("."),
    );
  }

  async addMemo(content) {
    const lines = content.split("\n");
    const title = lines[0];
    const fileName = this.#createFileName(title);
    await fs.writeFile(path.join(this.dataDir, fileName), content);
  }

  #createFileName(title) {
    const timestamp = Date.now();
    const hash = crypto.createHash("md5").update(title).digest("hex");
    return `${timestamp}_${hash}.txt`;
  }

  listMemoTitles() {
    return this.memos.map((memo) => memo.title);
  }

  getMemo(index) {
    return this.isValidIndex(index) ? this.memos[index] : null;
  }

  async deleteMemo(index) {
    const memo = this.getMemo(index);
    if (!memo) {
      return false;
    }
    const fileName = await this.#findFileNameByTitle(memo.title);
    if (fileName) {
      await fs.unlink(path.join(this.dataDir, fileName));
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
    const fileName = await this.#findFileNameByTitle(memo.title);
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

  async #findFileNameByTitle(title) {
    const files = await fs.readdir(this.dataDir);
    return files.find((file) => this.#extractTitleFromFileName(file) === title);
  }
}
