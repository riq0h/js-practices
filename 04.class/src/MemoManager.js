import fs from "fs/promises";
import path from "path";

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
    const memo = this.memos[index];
    const files = await fs.readdir(this.dataDir);
    const fileName = files.find((file) => file.endsWith(`_${memo.title}.txt`));
    if (fileName) {
      await fs.unlink(path.join(this.dataDir, fileName));
      this.memos.splice(index, 1);
    } else {
      throw new Error("メモファイルが見つかりません。");
    }
  }
}
