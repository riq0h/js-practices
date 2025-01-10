import sqlite3 from "sqlite3";
import timers from "timers/promises";

const db = new sqlite3.Database(":memory:");

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  (err) => {
    if (err) {
      console.error("テーブル作成エラー:", err.message);
      return;
    }
    console.log("テーブルが作成されました");

    db.run(
      "INSERT INTO books (title) VALUES (?)",
      ["JavaScript入門"],
      function (err) {
        if (err) {
          console.error("レコード追加エラー:", err.message);
          return;
        }
        console.log("追加されたレコードのID:", this.lastID);

        db.all("SELECT * FROM books", (err) => {
          if (err) {
            console.error("レコード取得エラー:", err.message);
            return;
          }
          console.log("取得したレコード:");

          db.run("DROP TABLE books", (err) => {
            if (err) {
              console.error("テーブル削除エラー:", err.message);
              return;
            }
            console.log("テーブルが削除されました");
            db.close();
          });
        });
      },
    );
  },
);

await timers.setTimeout(100);
