const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  try {
    // lê o token do cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.tipo)) {
      return res.status(403).json({ 
        error: 'Acesso negado. Permissão insuficiente' 
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
