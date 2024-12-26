import { openDatabase, run, all, close } from "./db_utils.js";

openDatabase(":memory:")
  .then((db) => {
    return run(
      db,
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    )
      .then(() => {
        console.log("テーブルが作成されました");
        return run(db, "INSERT INTO books (title) VALUES (?)", [
          "JavaScript入門",
        ]);
      })
      .then(() => {
        console.log("最初のレコードが追加されました");
        return run(db, "INSERT INTO books (title) VALUES (?)", [
          "JavaScript入門",
        ]);
      })
      .catch((err) => {
        console.error("レコード追加エラー（意図的）:", err.message);
      })
      .then(() => {
        return all(db, "SELECT * FROM non_existent_table");
      })
      .catch((err) => {
        console.error("レコード取得エラー（意図的）:", err.message);
      })
      .then(() => {
        return run(db, "DROP TABLE books");
      })
      .then(() => {
        console.log("テーブルが削除されました");
        return close(db);
      });
  })
  .catch((err) => {
    console.error("予期せぬエラーが発生しました:", err.message);
  });
