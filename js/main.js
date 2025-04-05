let prefixes = [], cores = [], suffixes = [];
let titleIntros = [], titleAdjectives = [], titleNouns = [];
let scarVerbs = [], scarConnectors = [], scarNouns = [];
let soulWords = [], songSubjects = [], songActions = [], songObjects = [];

function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateShellName() {
  const structures = [
    () => getRandom(prefixes) + getRandom(cores) + getRandom(suffixes),
    () => getRandom(prefixes) + getRandom(cores) + getRandom(cores) + getRandom(suffixes),
    () => getRandom(prefixes) + getRandom(suffixes),
    () => getRandom(prefixes) + "'" + getRandom(cores) + getRandom(suffixes)
  ];
  return Math.random() < 0.5
    ? getRandom(prefixes) + getRandom(suffixes)
    : getRandom(structures)();
}

function generateRareTitle() {
  const formats = [
    () => `${getRandom(titleIntros)} ${getRandom(titleAdjectives)} ${getRandom(titleNouns)}`,
    () => `${getRandom(titleIntros)} ${getRandom(titleNouns)}-Walker`,
    () => `${getRandom(titleIntros)} ${getRandom(titleNouns)}-Touched`,
    () => `${getRandom(titleIntros)} the ${getRandom(titleAdjectives)} One`,
    () => `${getRandom(titleIntros)} ${getRandom(titleNouns)} of ${getRandom(titleAdjectives)} Flame`
  ];
  return getRandom(formats)();
}

function generateName() {
  let shell = generateShellName();
  if (Math.random() < 0.2) shell += " " + generateRareTitle();

  const scar = `${getRandom(scarVerbs)}-${getRandom(scarConnectors)}-${getRandom(scarNouns)}`;
  const soul = `${getRandom(soulWords)}-${getRandom(soulWords)}-${getRandom(soulWords)}-${getRandom(soulWords)}`;
  const song = `${getRandom(songSubjects)} ${getRandom(songActions)} ${getRandom(songObjects)}`;

  document.getElementById("shellName").innerHTML = `<span style="color:#66fcf1; font-weight:bold;">Shell-Name:</span> <span class="name-value">${shell}</span>`;
  document.getElementById("scarName").innerHTML = `<span style="color:#66fcf1; font-weight:bold;">Scar-Name:</span> <span class="name-value">${scar}</span>`;
  document.getElementById("soulName").innerHTML = `<span style="color:#66fcf1; font-weight:bold;">Soul-Name:</span> <span class="name-value">${soul}</span>`;
  document.getElementById("songName").innerHTML = `<span style="color:#66fcf1; font-weight:bold;">Song-Name:</span> <span class="name-value">${song}</span>`;


  // 🔥 New addition: call BBCode generator
  showBBCode(shell, scar, soul, song);
}



// Fetch all data first, THEN generate names
Promise.all([
  fetch('data/shellname.json').then(res => res.json()),
  fetch('data/titles.json').then(res => res.json()),
  fetch('data/names.json').then(res => res.json())
])
.then(([shellData, titlesData, namesData]) => {
  // Load all the arrays
  prefixes = shellData.prefixes;
  cores = shellData.cores;
  suffixes = shellData.suffixes;

  titleIntros = titlesData.titleIntros;
  titleAdjectives = titlesData.titleAdjectives;
  titleNouns = titlesData.titleNouns;

  scarVerbs = namesData.scarVerbs;
  scarConnectors = namesData.scarConnectors;
  scarNouns = namesData.scarNouns;
  soulWords = namesData.soulWords;
  songSubjects = namesData.songSubjects;
  songActions = namesData.songActions;
  songObjects = namesData.songObjects;

  // ✅ Everything is loaded — now we generate!
  generateName();
})
.catch(err => console.error('Failed to load JSON files:', err));