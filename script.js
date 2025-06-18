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

const emojiMap = {
  fire: '🔥',
  water: '💧',
  grass: '🌿',
  electric: '⚡',
  psychic: '🧠',
  ghost: '👻',
  dark: '🌑',
  fairy: '✨',
  bug: '🐛',
  rock: '🪨',
  steel: '🔩',
  flying: '🕊️',
  ground: '🌍',
  normal: '⚪',
  fighting: '🥊',
  poison: '☠️',
  ice: '❄️',
  dragon: '🐉',
};

let offset = 0;
const limit = 20;
let loadedPokemon = [];
let allPokemonNames = [];
let currentOverlayIndex = 0;

async function loadInitialPokemon() {
  offset = 0;
  await loadPokemonBatch();
}

async function preloadPokemonNames() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
  const data = await res.json();
  allPokemonNames = data.results.map(p => p.name);
}

async function loadMorePokemon() {
  const button = document.getElementById('load-more-btn');
  const overlay = document.getElementById('loading-overlay');
  document.getElementById('pokemonName').innerHTML = '';
  button.style.pointerEvents = 'none';
  button.style.opacity = '0.6';
  overlay.classList.remove('hidden');
  await loadPokemonBatch();
  await new Promise(resolve => setTimeout(resolve, 800));
  overlay.classList.add('hidden');
  button.style.pointerEvents = 'auto';
  button.style.opacity = '1';
}

async function loadPokemonBatch() {
  const container = document.getElementById('pokemon-card');
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  const data = await response.json();
  for (const pokemon of data.results) {
    const pokeData = await fetch(pokemon.url).then(res => res.json());
    const div = document.createElement('div');
    div.className = 'pokemon-info box-shadow-bottom';
    const types = pokeData.types.map(t => t.type.name);
    const color1 = typeColors[types[0]] || '#F0F0F0';
    const color2 = types[1] ? typeColors[types[1]] : color1;
    div.style.background = `linear-gradient(5deg, ${color1}, ${color2})`;
    div.innerHTML = `
      <h3>${pokeData.name.toUpperCase()}</h3>
      <p><strong>ID:</strong> ${pokeData.id}</p>
      <img src="${pokeData.sprites.front_default}" alt="${pokeData.name}">
      <p><strong>Typen:</strong> ${pokeData.types.map(t => t.type.name).join(', ')}</p>
    `;
    div.onclick = () => showPokemonOverlay(pokeData);
    container.appendChild(div);
    loadedPokemon.push(pokeData);
  }
  offset += limit;
}

window.onload = async () => {
  await preloadPokemonNames();
  await loadInitialPokemon();
};

async function searchPokemon() {
  const input = document.getElementById('pokemonName').value.trim().toLowerCase();
  const container = document.getElementById('pokemon-card');
  if (input.length < 3) {
    container.innerHTML = '';
    offset = 0;
    await loadPokemonBatch();
    return;
  }
  const match = allPokemonNames.find(name => name.startsWith(input));
  if (!match) {
    container.innerHTML = `<p style="color:red;">No Pokémon found</p>`;
    return;
  }
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${match}`);
    if (!response.ok) throw new Error("Pokémon not found");
    const data = await response.json();
    container.innerHTML = '';
    const div = document.createElement('div');
    div.className = 'pokemon-info box-shadow-bottom';
    const types = data.types.map(t => t.type.name);
    const color1 = typeColors[types[0]] || '#F0F0F0';
    const color2 = types[1] ? typeColors[types[1]] : color1;
    div.style.background = `linear-gradient(5deg, ${color1}, ${color2})`;
    div.innerHTML = `
      <h3>${data.name.toUpperCase()}</h3>
      <p><strong>ID:</strong> ${data.id}</p>
      <img src="${data.sprites.front_default}" alt="${data.name}">
      <p><strong>Typen:</strong> ${data.types.map(t => t.type.name).join(', ')}</p>
    `;
    div.onclick = () => showPokemonOverlay(data);
    container.appendChild(div);
  } catch (err) {
    container.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

/* Overlay Logic for Pokemon Overlay*/
/* function showPokemonOverlay(pokemon) {
  const overlay = document.getElementById('pokemon-overlay');
  const content = document.getElementById('overlay-content');
  currentOverlayIndex = loadedPokemon.findIndex(p => p.name === pokemon.name);
  const typeNames = pokemon.types.map(t => t.type.name).join(', ');
  const stats = pokemon.stats;
  const types = pokemon.types.map(t => t.type.name);
  const color1 = typeColors[types[0]] || '#F0F0F0';
  const color2 = types[1] ? typeColors[types[1]] : color1;
  content.innerHTML = `
    <span class="close-btn" onclick="closeOverlay()">✖</span>
    <h2>${pokemon.name.toUpperCase()}</h2>
    <div class="pokemon-header" style="background: linear-gradient(135deg, ${color1}, ${color2});">    
      <div class="pokemonTypeId">
        <div class="pokemonTypeIdText">
          <strong>ID:</strong>
          <div class="pokemonId">${pokemon.id}</div>
        </div>
        <div class="pokemonTypeIdText">
          <strong>Typ:</strong>
          <div class="pokemonType" style="background-color: ${color1}; padding: 4px 8px; border-radius: 6px; color: #fff;">
            ${typeNames}
          </div>
        </div>
      </div> 
      <div class="pokemonPicture">
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      </div>   
    </div>
    <div class="pokemon-stats">
      <div><span>HP:</span><span>${stats[0].base_stat}</span></div>
      <div><span>Attack:</span><span>${stats[1].base_stat}</span></div>
      <div><span>Defense:</span><span>${stats[2].base_stat}</span></div>
      <div><span>Sp. Atk:</span><span>${stats[3].base_stat}</span></div>
      <div><span>Sp. Def:</span><span>${stats[4].base_stat}</span></div>
      <div><span>Speed:</span><span>${stats[5].base_stat}</span></div>
    </div>
    <div class="nav-buttons">
      <button onclick="showPreviousPokemon()">←</button>
      <button onclick="showNextPokemon()">→</button>
    </div>
  `;
  overlay.classList.remove('hidden');
} */

function closeOverlay(event) {
  document.getElementById('pokemon-overlay').classList.add('hidden');
}

function showPreviousPokemon() {
  if (currentOverlayIndex > 0) {
    currentOverlayIndex--;
    showPokemonOverlay(loadedPokemon[currentOverlayIndex]);
  }
}

function showNextPokemon() {
  if (currentOverlayIndex < loadedPokemon.length - 1) {
    currentOverlayIndex++;
    showPokemonOverlay(loadedPokemon[currentOverlayIndex]);
  }
}

/* //FUNC: showPokemonOverlay(pokemon)*/
function showPokemonOverlay(pokemon) {
  const overlay = document.getElementById('pokemon-overlay');
  const content = document.getElementById('overlay-content');
  currentOverlayIndex = getPokemonIndex(pokemon.name);
  const html = generatePokemonOverlayHTML(pokemon);
  content.innerHTML = html;
  overlay.classList.remove('hidden');
}

/* //FUNC: helpfunction for Searching the Index*/
function getPokemonIndex(name) {
  return loadedPokemon.findIndex(p => p.name === name);
}

/* //FUNC: generate Template Overlay HTML*/
function generatePokemonOverlayHTML(pokemon) {
  const types = pokemon.types.map(t => t.type.name);
  const typeNames = types.join(', ');
  const stats = pokemon.stats;
  const color1 = typeColors[types[0]] || '#F0F0F0';
  const color2 = types[1] ? typeColors[types[1]] : color1;
  return `
    <span class="close-btn" onclick="closeOverlay()">✖</span>
    <h2>${pokemon.name.toUpperCase()}</h2>
    <div class="pokemon-header" style="background: linear-gradient(135deg, ${color1}, ${color2});">
      ${generateTypeIdSection(pokemon, typeNames, color1)}
      ${generateImageSection(pokemon)}
    </div>
    ${generateStatsSection(stats)}
    ${generateNavigationButtons()}
  `;
}

/* //FUNC: Type and ID generate Template */
function generateTypeIdSection(pokemon, typeNames, color) {
  return `
    <div class="pokemonTypeId">
      <div class="pokemonTypeIdText">
        <strong>ID:</strong>
        <div class="pokemonId">${pokemon.id}</div>
      </div>
      <div class="pokemonTypeIdText">
        <strong>Typ:</strong>
        <div class="pokemonType" style="background-color: ${color}; padding: 4px 8px; border-radius: 6px; color: #fff;">
          ${typeNames}
        </div>
      </div>
    </div>
  `;
}

/* //FUNC: Image Template */
function generateImageSection(pokemon) {
  return `
    <div class="pokemonPicture">
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    </div>
  `;
}

/* //FUNC: Stats Template */
function generateStatsSection(stats) {
  return `
    <div class="pokemon-stats">
      <div><span>HP:</span><span>${stats[0].base_stat}</span></div>
      <div><span>Attack:</span><span>${stats[1].base_stat}</span></div>
      <div><span>Defense:</span><span>${stats[2].base_stat}</span></div>
      <div><span>Sp. Atk:</span><span>${stats[3].base_stat}</span></div>
      <div><span>Sp. Def:</span><span>${stats[4].base_stat}</span></div>
      <div><span>Speed:</span><span>${stats[5].base_stat}</span></div>
    </div>
  `;
}

/*//FUNC: Navigation Template */
function generateNavigationButtons() {
  return `
    <div class="nav-buttons">
      <button onclick="showPreviousPokemon()">←</button>
      <button onclick="showNextPokemon()">→</button>
    </div>
  `;
}

/* //FUNC: searchPokemon() Function */
async function searchPokemon() {
  const input = getSearchInput();
  const container = document.getElementById('pokemon-card');
  if (!isValidSearchInput(input)) {
    resetSearchResults(container);
    await loadPokemonBatch();
    return;
  }
  const match = findMatchingPokemonName(input);
  if (!match) {
    showNoResultsMessage(container);
    return;
  }
  try {
    const pokemon = await fetchPokemonByName(match);
    displaySearchedPokemon(pokemon, container);
  } catch (err) {
    showSearchError(container, err.message);
  }
}
