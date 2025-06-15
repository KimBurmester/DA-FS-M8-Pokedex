/*     async function loadPokemon() {
      const name = document.getElementById('pokemonName').value.toLowerCase();
      const url = `https://pokeapi.co/api/v2/pokemon/${name}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Pokémon nicht gefunden");
        }

        const data = await response.json();

        // Daten anzeigen
        const infoDiv = document.getElementById('pokemon-card');
        infoDiv.innerHTML = `
          <div class="pokemon-info"><h2>${data.name.toUpperCase()}</h2>
          <img src="${data.sprites.front_default}" alt="${data.name}">
          <p><strong>Größe:</strong> ${data.height}</p>
          <p><strong>Gewicht:</strong> ${data.weight}</p>
          <p><strong>Typen:</strong> ${data.types.map(t => t.type.name).join(', ')}</p>
          </div>
        `;
      } catch (error) {
        document.getElementById('pokemon-card').innerHTML = `<p style="color:red;">${error.message}</p>`;
      }
    } */

    async function loadInitialPokemon() {
      const container = document.getElementById('pokemon-card');
      container.innerHTML = '';

      const limit = 40;
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
      const data = await response.json();

      for (const pokemon of data.results) {
        const pokeData = await fetch(pokemon.url).then(res => res.json());

        const div = document.createElement('div');
        div.innerHTML = `
          <div class="pokemon-info box-shadow-bottom"><h3>${pokeData.name.toUpperCase()}</h3>
          <p><strong>ID:</strong> ${pokeData.id}</p>
          <img src="${pokeData.sprites.front_default}" alt="${pokeData.name}">
          <p><strong>Typen:</strong> ${pokeData.types.map(t => t.type.name).join(', ')}</p>
          </div>
        `;
        container.appendChild(div);
      }
    }
/*           <p><strong>Größe:</strong> ${pokeData.height}</p>
          <p><strong>Gewicht:</strong> ${pokeData.weight}</p> */