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

function generateImageSection(pokemon) {
  return `
    <div class="pokemonPicture">
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    </div>
  `;
}

function generateSizeSection(pokemon) {
  return `
    <div class="pokemonType size box-shadow-bottom">
      <div class="pokemonSize"><span>Size: </span><span>${roundToOneDecimal(pokemon.height * 0.1)} m</span></div>
      <div class="pokemonWeight"><span>Weight: </span><span>${roundToOneDecimal(pokemon.weight * 0.1)} kg</span></div>
    </div>
  `;
}

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

function generateNavigationButtons() {
  const list = getActiveList();
  const atStart = currentOverlayIndex <= 0;
  const atEnd   = currentOverlayIndex >= list.length - 1;

  return `
    <div class="nav-buttons">
      <button id="prev-btn" onclick="showPreviousPokemon()" ${atStart ? 'disabled' : ''} aria-disabled="${atStart}">←</button>
      <button id="next-btn" onclick="showNextPokemon()"   ${atEnd ? 'disabled' : ''} aria-disabled="${atEnd}">→</button>
    </div>
  `;
}
