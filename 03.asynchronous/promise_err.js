import { openDatabase, run, all, close } from "./db_utils.js";

let db;

openDatabase(":memory:")
  .then((_db) => {
    db = _db;
    return run(
      db,
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    );
  })
  .then(() => console.log("テーブルが作成されました"))
  .then(() =>
    run(db, "INSERT INTO books (title) VALUES (?)", ["JavaScript入門"]),
  )
  .then(() => console.log("最初のレコードが追加されました"))
  .then(() =>
    run(db, "INSERT INTO books (title) VALUES (?)", ["JavaScript入門"]),
  )
  .catch((err) => {
    if (err.message.includes("UNIQUE constraint failed")) {
      console.error("レコード追加エラー（意図的）:", err.message);
    } else {
      throw err;
    }
  })
  .then(() => all(db, "SELECT * FROM non_existent_table"))
  .catch((err) => {
    if (err.message.includes("no such table")) {
      console.error("レコード取得エラー（意図的）:", err.message);
    } else {
      throw err;
    }
  })
  .then(() => run(db, "DROP TABLE books"))
  .then(() => console.log("テーブルが削除されました"))
  .then(() => close(db))
  .catch((err) => console.error("予期せぬエラーが発生しました:", err.message));
