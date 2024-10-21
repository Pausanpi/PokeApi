const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4001;

// Habilitar CORS y JSON
app.use(cors());
app.use(express.json());

// Usa la clave de API desde variables de entorno
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.get('/', (req, res) => {
    res.send('Backend funcionando!');
});

// Ruta para crear Pokémon (generar imagen)
app.post('/create', async (req, res) => {
    const { prompt, num_outputs, guidance_scale, num_inference_steps } = req.body;

    try {
        // Realizar la solicitud a la API de OpenAI
        const imageResponse = await axios.post(
            'https://api.replicate.com/v1/predictions',
            {
                prompt,
                n: num_outputs,  // Generar múltiples imágenes
                size: '1024x1024' // Puedes cambiar el tamaño si es necesario
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Obtener la URL de la imagen generada
        const imageUrl = imageResponse.data.data[0].url;  // Cambiar según la respuesta de la API
        res.json({ message: `Pokemon ${prompt} creado!`, image: imageUrl });

    } catch (error) {
        console.error('Error al generar la imagen:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error al generar la imagen' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
