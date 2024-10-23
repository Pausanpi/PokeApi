require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const app = express();
const port = 4001;

// Configuración de la estrategia de GitHub
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,  // Asegúrate de que estas variables estén correctamente configuradas
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:4001/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => {
    // Verifica si el perfil se recibió correctamente
    if (!profile) {
        return done(new Error('No se pudo obtener el perfil de GitHub'));
    }
    // Devuelve el perfil correctamente a Passport
    return done(null, profile);
}));

// Serializar y deserializar el usuario en la sesión
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(session({
    secret: 'tu_secreto',  // Reemplaza 'tu_secreto' con una clave segura
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 // La sesión dura 1 minutos
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta de inicio
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile(path.join(__dirname, 'public/index.html'));
    } else {
        res.sendFile(path.join(__dirname, 'public/login.html'));
    }
});

// Ruta para redirigir al usuario a GitHub para autenticarse
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// Ruta de callback después de autenticarse con GitHub
app.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        // Redirige a la página principal después de iniciar sesión correctamente
        res.redirect('/');
    }
);

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.redirect('/');
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('Error al destruir sesión:', err);
            }
            res.clearCookie('connect.sid'); // Limpia la cookie de sesión
            res.redirect('/'); // Redirige a la página de login después de cerrar sesión
        });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
