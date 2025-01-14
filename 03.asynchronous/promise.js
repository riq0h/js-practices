import { openDatabase, run, all, close } from "./db_utils.js";

let db;

openDatabase(":memory:")
  .then((database) => {
    db = database;
    return run(
      db,
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    );
  })
  .then(() => {
    console.log("テーブルが作成されました");
  })
  .then(() =>
    run(db, "INSERT INTO books (title) VALUES (?)", ["JavaScript入門"]),
  )
  .then(({ lastID }) => {
    console.log("追加されたレコードのID:", lastID);
  })
  .then(() => all(db, "SELECT * FROM books"))
  .then((rows) => {
    console.log("取得したレコード:", rows);
  })
  .then(() => run(db, "DROP TABLE books"))
  .then(() => {
    console.log("テーブルが削除されました");
  })
  .then(() => close(db))
  .catch((err) => {
    console.error("エラーが発生しました:", err.message);
  });
