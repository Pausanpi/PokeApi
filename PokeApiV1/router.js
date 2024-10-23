const express = require('express');
const passport = require('passport');
const router = express.Router();

// Estrategia de GitHub
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        console.log('Usuario autenticado:', req.user);
        req.session.user = req.user; // Guardar el usuario en la sesión
        res.redirect('http://localhost:3000/home'); // Redirigir a la página de inicio
    }
);

// Ruta para verificar la autenticación
router.get('/auth/status', (req, res) => {
    console.log('Estado de autenticación:', req.isAuthenticated());
    res.json({ isAuthenticated: req.isAuthenticated() });
});

router.get('/auth/logout', (req, res, next) => { // Añadir next aquí
    console.log('Antes de logout:', req.session);
    req.logout((err) => {
        if (err) {
            return next(err); // Pasar el error al middleware de manejo de errores
        }
        req.session.destroy(() => {
            console.log('Sesión destruida.');
            res.clearCookie('connect.sid'); // Asegúrate de que sea la cookie correcta
            res.status(200).json({ message: 'Sesión cerrada exitosamente' });
        });
    });
});
module.exports = router;
