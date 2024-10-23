document.getElementById('logoutBtn').addEventListener('click', () => {
    fetch('/logout', {
        method: 'GET',
        credentials: 'include' // Asegúrate de incluir las cookies de sesión
    }).then(response => {
        if (response.ok) {
            window.location.href = 'login.html'; // Redirigir a la página de login
        }
    });
});

// Lógica de creación de Pokémon
document.getElementById('pokemonForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita que la página se recargue al enviar el formulario

    const nombre = document.getElementById('nombre').value;
    const color = document.getElementById('color').value; // Obtener el color del select

    try {
        // Obtener los datos del Pokémon desde PokeAPI
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`);
        if (!response.ok) throw new Error('Pokémon no encontrado'); // Manejo de errores si el Pokémon no existe
        const data = await response.json();
        const pokemonImage = data.sprites.front_default;

        const img = new Image();
        img.src = pokemonImage;
        img.onload = () => {
            cambiarColorPokemon(img, color); // Cambiar el color de la imagen en el canvas
        };

		// Suponiendo que ya tienes el `data` del Pokémon
		const stats = data.stats.map(stat => stat.base_stat); // Obtén las estadísticas
		const statNames = data.stats.map(stat => stat.stat.name); // Obtén los nombres de las estadísticas

		// Llama a la función para renderizar el gráfico
		renderChart(statNames, stats);

    } catch (error) {
        document.getElementById('result').innerHTML = `
            <h2>Error al obtener el Pokémon: ${error.message}</h2>
        `;
    }
});


// Función para cambiar el color de la imagen del Pokémon en el canvas
function cambiarColorPokemon(img, colorUsuario) {
    const canvas = document.getElementById('pokemonCanvas');
    const ctx = canvas.getContext('2d');

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar la imagen del Pokémon en el canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Cambiar el color del Pokémon solo si se proporciona un color
    if (colorUsuario && colorUsuario !== "") { // Verificar que el color no sea vacío
        const colorConOpacidad = rgbaFromHex(colorUsuario, 0.5); // Ajustar el valor de opacidad aquí (0.5 es 50%)
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = colorConOpacidad; // El color seleccionado por el usuario con opacidad
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Restablecer la operación de composición
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Restaurar la operación de composición por defecto
        ctx.globalCompositeOperation = 'source-over';
    }
}

// Función para convertir color en formato hex a rgba
function rgbaFromHex(hex, alpha) {
    // Eliminar el símbolo '#' si existe
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map((c) => c + c).join(''); // Convertir de 3 a 6 caracteres
    }

    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`; // Devuelve el color en formato rgba
}

function renderChart(labels, data) {
    const ctx = document.getElementById('statsChart').getContext('2d');

    // Si ya hay un gráfico existente, lo destruye
    if (window.pokemonChart) {
        window.pokemonChart.destroy();
    }

    // Crear un nuevo gráfico
    window.pokemonChart = new Chart(ctx, {
        type: 'bar', // Puedes cambiar a 'line', 'pie', etc.
        data: {
            labels: labels,
            datasets: [{
                label: 'Estadísticas del Pokémon',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)', // Color de las barras con opacidad
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)', // Color al pasar el ratón
                hoverBorderColor: 'rgba(255, 99, 132, 1)' // Color del borde al pasar el ratón
            }]
        },
        options: {
            responsive: true, // El gráfico se adapta al tamaño de su contenedor
            maintainAspectRatio: false, // Permite cambiar la relación de aspecto
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#333', // Color de las etiquetas del eje Y
                        font: {
                            size: 14 // Tamaño de la fuente
                        }
                    },
                    grid: {
                        color: '#ccc' // Color de la cuadrícula
                    }
                },
                x: {
                    ticks: {
                        color: '#333', // Color de las etiquetas del eje X
                        font: {
                            size: 14 // Tamaño de la fuente
                        }
                    },
                    grid: {
                        display: false // Oculta la cuadrícula en el eje X
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#333', // Color de la leyenda
                        font: {
                            size: 16 // Tamaño de la fuente
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fondo del tooltip
                    titleColor: '#fff', // Color del título del tooltip
                    bodyColor: '#fff', // Color del cuerpo del tooltip
                    borderColor: 'rgba(75, 192, 192, 1)', // Color del borde del tooltip
                    borderWidth: 1 // Ancho del borde del tooltip
                }
            }
        }
    });
}

