require('dotenv').config({ path: './.env' });
const cookieParser = require('cookie-parser');
const app = require('./app');
const port = process.env.PORT || 3000;

app.use(cookieParser());

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});