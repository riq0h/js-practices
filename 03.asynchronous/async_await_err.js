import { openDatabase, run, all, close } from "./db_utils.js";

const db = await openDatabase(":memory:");

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
  if (
    err instanceof Error &&
    err.message.includes("UNIQUE constraint failed")
  ) {
    console.error("レコード追加エラー（意図的）:", err.message);
  } else {
    throw err;
  }
}

try {
  await all(db, "SELECT * FROM non_existent_table");
} catch (err) {
  if (err instanceof Error && err.message.includes("no such table")) {
    console.error("レコード取得エラー（意図的）:", err.message);
  } else {
    throw err;
  }
}

await run(db, "DROP TABLE books");
console.log("テーブルが削除されました");

await close(db);
