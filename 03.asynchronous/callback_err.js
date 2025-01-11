import sqlite3 from "sqlite3";

const dbError = new sqlite3.Database(":memory:");

dbError.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    console.log("テーブルが作成されました");

    dbError.run(
      "INSERT INTO books (title) VALUES (?)",
      ["JavaScript入門"],
      () => {
        console.log("最初のレコードが追加されました");

        dbError.run(
          "INSERT INTO books (title) VALUES (?)",
          ["JavaScript入門"],
          (err) => {
            if (err) {
              console.error("レコード追加エラー（意図的）:", err.message);
            }

            dbError.all("SELECT * FROM non_existent_table", (err) => {
              if (err) {
                console.error("レコード取得エラー（意図的）:", err.message);
              }

              dbError.run("DROP TABLE books", () => {
                console.log("テーブルが削除されました");
                dbError.close();
              });
            });
          },
        );
      },
    );
  },
);
