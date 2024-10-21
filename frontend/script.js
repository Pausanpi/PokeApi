document.getElementById('tipo1').addEventListener('change', function() {
    const tipo1Value = this.value; // Obtiene el valor seleccionado en Tipo 1
    const tipo2 = document.getElementById('tipo2');
    
    // Habilita todas las opciones en Tipo 2 antes de hacer los cambios
    for (let option of tipo2.options) {
        option.disabled = false; // Habilita todas las opciones
    }

    // Si hay una opción seleccionada en Tipo 1, la deshabilita en Tipo 2
    if (tipo1Value) {
        for (let option of tipo2.options) {
            if (option.value === tipo1Value) {
                option.disabled = true; // Deshabilita la opción seleccionada en Tipo 1
            }
        }
    }
});

document.getElementById('pokemonForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita que la página se recargue al enviar el formulario

    const nombre = document.getElementById('nombre').value;
    const tipo1 = document.getElementById('tipo1').value;
    const tipo2 = document.getElementById('tipo2').value;
    const color = document.getElementById('color').value;

    try {
        const response = await fetch('http://localhost:4001/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                tipo1,
                tipo2,
                color
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
