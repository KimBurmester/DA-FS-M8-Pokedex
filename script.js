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

/* //NOTE: New Feature coming soon! PokemonType in emoji Style*/
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

/* //VAR: Global Variables */
let offset = 0;
const limit = 20;
let loadedPokemon = [];
let allPokemonNames = [];
let currentOverlayIndex = 0;
let searchResults = [];
let isSearchActive = false;


/* //FUNC: Start Function*/
async function loadInitialPokemon() {
  offset = 0;
  await loadPokemonBatch();
}

/* //FUNC: Help Function to load the first 20 Pokemons */
async function preloadPokemonNames() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
  const data = await res.json();
  allPokemonNames = data.results.map(p => p.name);
}

/* //FUNC: Help Function to load more Pokemons - Hide Button*/
async function loadMorePokemon() {
  const button = document.getElementById('load-more-btn');
  const overlay = document.getElementById('loading-overlay');
  document.getElementById('pokemonName').innerHTML = '';
  button.style.pointerEvents = 'none';
  button.style.opacity = '0.6';
  overlay.classList.remove('hidden');
  await loadPokemonBatch();
  await new Promise(resolve => setTimeout(resolve, 600));
  overlay.classList.add('hidden');
  button.style.pointerEvents = 'auto';
  button.style.opacity = '1';
}

/* //FUNC: Help Function loadPokemonBatch() */
async function loadPokemonBatch() {
  const container = document.getElementById('pokemon-card');
  const pokemonList = await fetchPokemonList(limit, offset);
  for (const pokemon of pokemonList) {
    const pokeData = await fetchPokemonDetails(pokemon.url);
    renderPokemonCard(pokeData, container);
    loadedPokemon.push(pokeData);
  }
  offset += limit;
}

/* //FUNC: Help Function fetchPokemonList(limit, offset) */
async function fetchPokemonList(limit, offset) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  const data = await response.json();
  return data.results;
}

/* //FUNC: Help Function featchPokemonDetails(url) */
async function fetchPokemonDetails(url) {
  const response = await fetch(url);
  return await response.json();
}

/* //FUNC: Help Function renderPokemonCard(pokemon, container) */
function renderPokemonCard(pokemon, container) {
  const types = pokemon.types.map(t => t.type.name);
  const color1 = typeColors[types[0]] || '#F0F0F0';
  const color2 = types[1] ? typeColors[types[1]] : color1;
  const div = document.createElement('div');
  div.className = 'pokemon-info box-shadow-bottom';
  div.style.background = `linear-gradient(5deg, ${color1}, ${color2})`;
  div.innerHTML = `
    <h3>${pokemon.name.toUpperCase()}</h3>
    <p><strong>ID:</strong> ${pokemon.id}</p>
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <p><strong>Typen:</strong> ${types.join(', ')}</p>`;
  div.onclick = () => showPokemonOverlay(pokemon);
  container.appendChild(div);
}

/* //FUNC: Help Function for Loading all PokemonNames and first Pokemons for the Screen */
window.onload = async () => {
  await preloadPokemonNames();
  await loadInitialPokemon();
};

/* //FUNC: Help Function closeOverlay(event) */
function closeOverlay(event) {
  document.getElementById('pokemon-overlay').classList.add('hidden');
}

/* //FUNC: Help Function showPreviousPokemon() */
function showPreviousPokemon() {
  const activeList = isSearchActive ? searchResults : loadedPokemon;
  if (currentOverlayIndex > 0) {
    currentOverlayIndex--;
    showPokemonOverlay(activeList[currentOverlayIndex]);
  }
}

/* //FUNC: Help Function showNextPokemon() */
function showNextPokemon() {
  const activeList = isSearchActive ? searchResults : loadedPokemon;
  if (currentOverlayIndex < activeList.length - 1) {
    currentOverlayIndex++;
    showPokemonOverlay(activeList[currentOverlayIndex]);
  }
}

/* //FUNC: showPokemonOverlay(pokemon)*/
function showPokemonOverlay(pokemon) {
  const overlay = document.getElementById('pokemon-overlay');
  const content = document.getElementById('overlay-content');
  const activeList = isSearchActive ? searchResults : loadedPokemon;
  currentOverlayIndex = activeList.findIndex(p => p.name === pokemon.name);
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
    <div class="pokemon-header box-shadow-bottom" style="background: linear-gradient(135deg, ${color1}, ${color2});">
      ${generateTypeIdSection(pokemon, typeNames, color1)}
      ${generateImageSection(pokemon)}
    </div>
    ${generateSizeSection(pokemon)}
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
        <div class="pokemonType box-shadow-bottom" style="background-color: ${color}; padding: 4px 8px; border-radius: 6px; color: #fff;">
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

/* //FUNC: Size Template */
function generateSizeSection(pokemon) {
  return `
    <div class="pokemonType size box-shadow-bottom">
      <div class="pokemonSize"><span>Size: </span><span>${roundToOneDecimal(pokemon.height * 0.1)} m</span></div>
      <div class="pokemonWeight"><span>Weight: </span><span>${roundToOneDecimal(pokemon.weight * 0.1)} kg</span></div>
    </div>
  `;
}

/* //FUNC: Help Function for right Size and Weight */
function roundToOneDecimal(value) {
  return Math.round(value * 10) / 10;
}

/* //FUNC: Stats Template */
function generateStatsSection(stats) {
  return `
    <div class="pokemon-stats box-shadow-bottom">
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
    return;}
  const matches = findMatchingPokemonNames(input);
  if (matches.length === 0) {
    showNoResultsMessage(container);
    return;}
  container.innerHTML = ''; // Clear previous results
  searchResults = [];
  isSearchActive = true;
  for (const name of matches) {
    try {
      const pokemon = await fetchPokemonByName(name);
      displaySearchedPokemon(pokemon, container);
      searchResults.push(pokemon);
    } catch (err) {
      console.warn(`Fehler beim Laden von ${name}: ${err.message}`);
    }
  }
}

/* //FUNC: Help function getSearchInput */
function getSearchInput() {
  return document.getElementById('pokemonName').value.trim().toLowerCase();
}

/* //FUNC: Help function isValidSearchInput - More as 3 Letters for result */
function isValidSearchInput(input) {
  return input.length >= 3;
}

/* //FUNC: Help Function resetSearchResults */
function resetSearchResults(container) {
  container.innerHTML = '';
  offset = 0;
}

/* //FUNC: Help Function findMatchingPokemonName */
function findMatchingPokemonNames(input) {
  // return allPokemonNames.find(name => name.startsWith(input)); for one Pokemon
  return allPokemonNames.filter(name => name.startsWith(input)); //for more Pokemon
}

/* //FUNC: Help Function fetchPokemonByName(name) */
async function fetchPokemonByName(name) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  if (!response.ok) throw new Error("Pokémon not found");
  return await response.json();
}

/* //FUNC: Help Function displaySearchedPokemon(pokemon, container)*/
function displaySearchedPokemon(pokemon, container) {
  const types = pokemon.types.map(t => t.type.name);
  const color1 = typeColors[types[0]] || '#F0F0F0';
  const color2 = types[1] ? typeColors[types[1]] : color1;
  const div = document.createElement('div');
  div.className = 'pokemon-info box-shadow-bottom';
  div.style.background = `linear-gradient(5deg, ${color1}, ${color2})`;
  div.innerHTML = `
    <h3>${pokemon.name.toUpperCase()}</h3>
    <p><strong>ID:</strong> ${pokemon.id}</p>
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <p><strong>Typen:</strong> ${types.join(', ')}</p>`;
  div.onclick = () => showPokemonOverlay(pokemon);
  container.appendChild(div);
}

/* //FUNC: Help showNoResultsMessage(container) */
function showNoResultsMessage(container) {
  container.innerHTML = `<p style="color:red;">No Pokémon found</p>`;
}

/* //FUNC: Help Function showSearchError(container, message) */
function showSearchError(container, message) {
  container.innerHTML = `<p style="color:red;">${message}</p>`;
}

