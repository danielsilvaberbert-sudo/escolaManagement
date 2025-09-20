// backend/app.js
require('dotenv').config({ path: './.env' });
const cookieParser = require('cookie-parser');
const express = require('express');

const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const calendarRoutes = require("./routes/calendarioRoute");
const frequenciaRoutes = require("./routes/frequenciaRoute");
const alunosDisciplinaRoutes = require("./routes/alunosDisciplinaRoute");
const disciplinasRoute = require('./routes/disciplinasRoute');
const alunosRoute = require("./routes/alunosRoutes");
const userRoutes = require('./routes/userRoutes');
const classRoutes = require('./routes/classRoutes');

const path = require('path');

const app = express();
app.use(cookieParser());

// Security middlewares
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.static(path.join(__dirname, '../frontend')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-eval'", "https://cdn.jsdelivr.net"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
    imgSrc: ["'self'", "data:"],
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/classes', classRoutes);
app.use("/api/calendario", calendarRoutes);
app.use("/api/frequencia", frequenciaRoutes);
app.use("/api/alunosDisciplina",alunosDisciplinaRoutes);
app.use("/api/disciplinasInstrutor",disciplinasRoute)
app.use('/api/disciplinas', disciplinasRoute);
app.use("/api/alunos", alunosRoute);
app.use('/api/usuarios', userRoutes);
module.exports = app;