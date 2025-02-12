import { openDatabase, run, all, close } from "./db_utils.js";

const db = await openDatabase(":memory:");

await run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);
console.log("テーブルが作成されました");

const { lastID } = await run(db, "INSERT INTO books (title) VALUES (?)", [
  "JavaScript入門",
]);
console.log("追加されたレコードのID:", lastID);

const rows = await all(db, "SELECT * FROM books");
console.log("取得したレコード:", rows);

await run(db, "DROP TABLE books");
console.log("テーブルが削除されました");

await close(db);
