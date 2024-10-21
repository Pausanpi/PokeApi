document.getElementById('pokemonForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita que la página se recargue al enviar el formulario

    const prompt = document.getElementById('prompt').value;
    const num_outputs = document.getElementById('num_outputs').value;
    const guidance_scale = document.getElementById('guidance_scale').value;
    const num_inference_steps = document.getElementById('num_inference_steps').value;

    try {
        const response = await fetch('http://localhost:4001/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt,
                num_outputs,
                guidance_scale,
                num_inference_steps
            })
        });

        if (!response.ok) {
            throw new Error('Error al crear Pokémon');
        }

        const data = await response.json();
        document.getElementById('result').innerHTML = `
            <h2>${data.message}</h2>
            <img src="${data.image}" alt="Imagen de Pokémon">
        `;
    } catch (error) {
        document.getElementById('result').innerHTML = `
            <h2>Error: ${error.message}</h2>
        `;
    }
});
