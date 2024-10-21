import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [message, setMessage] = useState('');
	const [prompt, setPrompt] = useState('');
	const [num_outputs, setNumOutputs] = useState(''); 
	const [guidance_scale, setGuidandeScale] = useState('');
	const [num_inference_steps, setnumInferenceSteps] = useState('');
	const [image, setImage] = useState('');

	const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:4001/create', {
                prompt,
                num_outputs,
                guidance_scale,
                num_inference_steps
            });
            setMessage(response.data.message);
            setImage(response.data.image); // Guarda la URL de la imagen
        } catch (error) {
            console.error('Error creando Pokémon:', error);
            setMessage('Error al crear el Pokémon');
        }
    };

    return (
        <div>
            <h1>Crea tu Pokémon</h1>
            <form id="caja" onSubmit={handleSubmit}>
                <input id="datos"
                    type="text"
                    placeholder="Prompt (ej. Yoda)"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    required
                />
				<input
                    type="text"
                    placeholder="Num Outputs (ej. 1)"
                    value={num_outputs}
                    onChange={(e) => setNumOutputs(e.target.value)}
                    required
                />
				<input
                    type="text"
                    placeholder="Guidance Scale (ej. 7.5)"
                    value={guidance_scale}
                    onChange={(e) => setGuidandeScale(e.target.value)}
                    required
                />
				<input
                    type="text"
                    placeholder="Num Inference Steps (ej. 50)"
                    value={num_inference_steps}
                    onChange={(e) => setnumInferenceSteps(e.target.value)}
                    required
                />
                <button type="submit">Crear Pokémon</button>
                {message && <p>{message}</p>}
            </form>
            {image && <img src={image} alt="Pokémon generado" />}
        </div>
    );
}

export default App;
