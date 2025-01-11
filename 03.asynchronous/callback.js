import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    console.log("テーブルが作成されました");

    db.run(
      "INSERT INTO books (title) VALUES (?)",
      ["JavaScript入門"],
      function () {
        console.log("追加されたレコードのID:", this.lastID);

        db.all("SELECT * FROM books", (_, rows) => {
          console.log("取得したレコード:", rows);

          db.run("DROP TABLE books", () => {
            console.log("テーブルが削除されました");
            db.close();
          });
        });
      },
    );
  },
);
