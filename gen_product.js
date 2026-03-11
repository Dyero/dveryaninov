const fs = require('fs');
const path = require('path');

const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Дверь Альберта 1 — Дверянинов</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/main.css">
</head>
<body class="page page_product">
  <h1>Дверь Альберта 1 — Дверянинов</h1>
  <p>Тестовая страница товара</p>
  <script src="js/product.js"><\/script>
  <script src="js/shop.js"><\/script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'product.html'), html, 'utf8');
console.log('product.html created successfully');
