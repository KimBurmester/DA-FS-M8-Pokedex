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
const typeColors = {
  grass: 'rgb(168, 230, 162)',       // #A8E6A2
  fire: 'rgb(255, 167, 86)',         // #FFA756
  water: 'rgb(88, 171, 246)',        // #58ABF6
  electric: 'rgb(251, 226, 115)',    // #FBE273
  bug: 'rgb(195, 206, 117)',         // #C3CE75
  normal: 'rgb(190, 190, 190)',      // #BEBEBE
  poison: 'rgb(193, 131, 193)',      // #C183C1
  ground: 'rgb(230, 192, 123)',      // #E6C07B
  fairy: 'rgb(244, 189, 201)',       // #F4BDC9
  fighting: 'rgb(225, 127, 126)',    // #E17F7E
  psychic: 'rgb(250, 146, 178)',     // #FA92B2
  rock: 'rgb(213, 213, 212)',        // #D5D5D4
  ghost: 'rgb(120, 125, 156)',       // #787D9C
  ice: 'rgb(180, 241, 241)',         // #B4F1F1
  dragon: 'rgb(162, 124, 245)',      // #A27CF5
  dark: 'rgb(169, 169, 169)',        // #A9A9A9
  steel: 'rgb(204, 204, 222)',       // #CCCCDE
  flying: 'rgb(168, 207, 255)'       // #A8CFFF
};


    async function loadInitialPokemon() {
      const container = document.getElementById('pokemon-card');
      container.innerHTML = '';
      const limit = 40;
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
      const data = await response.json();
      for (const pokemon of data.results) {
        const pokeData = await fetch(pokemon.url).then(res => res.json());
        const type = pokeData.types[0].type.name;
        const color = typeColors[type] || '#F0F0F0';
        const div = document.createElement('div');
        div.className = 'pokemon-info box-shadow-bottom bg-hover';
        div.style.backgroundColor = color;
        div.innerHTML = `
          <div class="pokemon-name"><h3>${pokeData.name.toUpperCase()}</h3>
          <div class="pokemon-id"><p><strong>ID:</strong> ${pokeData.id}</p></div>
          <div class="pokemon-picture"><img src="${pokeData.sprites.front_default}" alt="${pokeData.name}"></div>
          <div class="pokemon-type"><p><strong>Typen:</strong> ${pokeData.types.map(t => t.type.name).join(', ')}</p></div>
          </div>
        `;
        container.appendChild(div);
      }
    }
/*           <p><strong>Größe:</strong> ${pokeData.height}</p>
          <p><strong>Gewicht:</strong> ${pokeData.weight}</p> */




