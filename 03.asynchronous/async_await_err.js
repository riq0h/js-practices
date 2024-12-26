import { openDatabase, run, all, close } from "./db_utils.js";

async function main() {
  let db;
  try {
    db = await openDatabase(":memory:");

    await run(
      db,
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    );
    console.log("テーブルが作成されました");

    await run(db, "INSERT INTO books (title) VALUES (?)", ["JavaScript入門"]);
    console.log("最初のレコードが追加されました");

    try {
      await run(db, "INSERT INTO books (title) VALUES (?)", ["JavaScript入門"]);
    } catch (err) {
      console.error("レコード追加エラー（意図的）:", err.message);
    }

    try {
      await all(db, "SELECT * FROM non_existent_table");
    } catch (err) {
      console.error("レコード取得エラー（意図的）:", err.message);
    }

    await run(db, "DROP TABLE books");
    console.log("テーブルが削除されました");
  } catch (err) {
    console.error("予期せぬエラーが発生しました:", err.message);
  } finally {
    if (db) await close(db);
  }
}

main();
