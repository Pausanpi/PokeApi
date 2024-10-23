document.addEventListener("DOMContentLoaded", function () {
	const generateButton = document.getElementById("generate");
	const typeInput = document.getElementById("type");
	const colorInput = document.getElementById("color");
	const accessoriesInput = document.getElementById("accessories");
	const backgroundInput = document.getElementById("background");
	const styleInput = document.getElementById("style");
	const imageContainer = document.getElementById("image-container");
	const loadingSpinner = document.getElementById("loading-spinner");
	const dlLink = document.getElementById("dlLink");
	const message = document.getElementById("message");
  
	dlLink.style.display = "none";
  
	generateButton.addEventListener("click", function () {
	  const description = encodeURIComponent(createDescription());
	  const imageUrl = `https://image.pollinations.ai/prompt/${description}?nologo=1&seed=${generateRandomSeed()}&height=512&width=512`;
	  displayLoadingState(true);
  
	  // Use a CORS proxy
	  const proxyUrl = "https://corsproxy.io/?";
	  const proxiedImageUrl = proxyUrl + encodeURIComponent(imageUrl);
  
	  fetch(proxiedImageUrl)
		.then((response) => response.blob())
		.then((blob) => {
		  const objectURL = URL.createObjectURL(blob);
		  displayImage(objectURL);
		})
		.catch((error) => {
		  console.error("Error generating the image:", error);
		  message.textContent = "Oops! There was an error generating your Pokémon.";
		})
		.finally(() => {
		  displayLoadingState(false);
		});
	});
  
	function createDescription() {
	  return `A ${typeInput.value} type Pokémon, ${colorInput.value} in color, wearing ${accessoriesInput.value}, in a ${backgroundInput.value} background, art style is ${styleInput.value}.`;
	}

	function displayLoadingState(isLoading) {
		if (isLoading) {
		  loadingSpinner.style.backgroundImage = "url('assets/monito.gif')";
		  loadingSpinner.style.display = "block";  // Mostramos la imagen de carga
		} else {
		  loadingSpinner.style.display = "none";  // Ocultamos la imagen de carga cuando se termina
		}
		imageContainer.style.display = isLoading ? "none" : "block";
	  }
	  
  
	function displayImage(url) {
	  const img = imageContainer.querySelector("img");
	  img.src = url;
	  img.alt = "Your AI-Generated Pokémon";
	  img.style.display = "block";
	  dlLink.href = url;
	  dlLink.style.display = "block";
	  message.textContent = "Your Pokémon is ready!";
	}
  
	function generateRandomSeed() {
	  return Math.floor(Math.random() * 10000);
	}
  });
  