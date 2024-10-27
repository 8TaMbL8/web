const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const port = 3000;

app.use(express.json(), cors({}));

// Подключение к базе данных
const db = new sqlite3.Database("./renault.db", (err) => {
  if (err) {
    console.error("Ошибка подключения к базе данных:", err.message);
  } else {
    console.log("Подключено к базе данных SQLite");
  }
});

// Маршрут для получения данных автомобилей
app.get("/cars", (req, res) => {
  console.log("cars");
  db.all("SELECT * FROM cars", [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ cars: rows });
  });
});

// Маршрут для добавления нового пользователя
app.post("/users", (req, res) => {
  const { last_name, first_name, email, password } = req.body;
  db.run(
    `INSERT INTO users (last_name, first_name, email, password) VALUES (?, ?, ?, ?)`,
    [last_name, first_name, email, password],
    function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ message: "Новый пользователь добавлен", id: this.lastID });
    }
  );
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
