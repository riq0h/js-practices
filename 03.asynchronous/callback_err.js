import sqlite3 from "sqlite3";

const dbWithErrorHandling = new sqlite3.Database(":memory:");

dbWithErrorHandling.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    console.log("テーブルが作成されました");

    dbWithErrorHandling.run(
      "INSERT INTO books (title) VALUES (?)",
      ["JavaScript入門"],
      () => {
        console.log("最初のレコードが追加されました");

        dbWithErrorHandling.run(
          "INSERT INTO books (title) VALUES (?)",
          ["JavaScript入門"],
          (err) => {
            if (err && err.message.includes("UNIQUE constraint failed")) {
              console.error("レコード追加エラー（意図的）:", err.message);
            } else if (err) {
              console.error("予期せぬエラーが発生しました:", err.message);
            }

            dbWithErrorHandling.all(
              "SELECT * FROM non_existent_table",
              (err) => {
                if (err && err.message.includes("no such table")) {
                  console.error("レコード取得エラー（意図的）:", err.message);
                } else if (err) {
                  console.error("予期せぬエラーが発生しました:", err.message);
                }

                dbWithErrorHandling.run("DROP TABLE books", () => {
                  console.log("テーブルが削除されました");
                  dbWithErrorHandling.close();
                });
              },
            );
          },
        );
      },
    );
  },
);
