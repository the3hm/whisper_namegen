let prefixes = [],
  cores = [],
  suffixes = [];
let titleIntros = [],
  titleAdjectives = [],
  titleNouns = [];
let scarVerbs = [],
  scarConnectors = [],
  scarNouns = [];
let soulWords = [],
  songSubjects = [],
  songActions = [],
  songObjects = [];
let selectedEgg = null; // Stores current egg selection (e.g., "red")

const eggJSONMap = {
  red: "data/eggs/red_set.json",
  blue: "data/eggs/blue_set.json",
  white: "data/eggs/white_set.json",
  green: "data/eggs/green_set.json",
  black: "data/eggs/black_set.json",
  brown: "data/eggs/brown_set.json",
  purple: "data/eggs/purple_set.json",
  orange: "data/eggs/orange_set.json",
  gold: "data/eggs/gold_set.json",
};

function loadNameData(useEgg = null) {
  let shellPromise;

  if (useEgg && eggJSONMap[useEgg]) {
    shellPromise = fetch(eggJSONMap[useEgg]).then((res) => res.json());
  } else {
    shellPromise = fetch("data/shellname.json").then((res) => res.json());
  }

  return Promise.all([
    shellPromise,
    fetch("data/titles.json").then((res) => res.json()),
    fetch("data/names.json").then((res) => res.json()),
  ]).then(([shellData, titlesData, namesData]) => {
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
  });
}

function splitLabel(text) {
  return text
    .split('_')                              // Split on underscores
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(' ');                              // Join with spaces
}



function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateShellName() {
  const structures = [
    () => getRandom(prefixes) + getRandom(cores) + getRandom(suffixes),
    () =>
      getRandom(prefixes) +
      getRandom(cores) +
      getRandom(cores) +
      getRandom(suffixes),
    () => getRandom(prefixes) + getRandom(suffixes),
    () => getRandom(prefixes) + "'" + getRandom(cores) + getRandom(suffixes),
  ];
  return Math.random() < 0.5
    ? getRandom(prefixes) + getRandom(suffixes)
    : getRandom(structures)();
}

function generateRareTitle() {
  const formats = [
    () =>
      `${getRandom(titleIntros)} ${getRandom(titleAdjectives)} ${getRandom(
        titleNouns
      )}`,
    () => `${getRandom(titleIntros)} ${getRandom(titleNouns)}-Walker`,
    () => `${getRandom(titleIntros)} ${getRandom(titleNouns)}-Touched`,
    () => `${getRandom(titleIntros)} the ${getRandom(titleAdjectives)} One`,
    () =>
      `${getRandom(titleIntros)} ${getRandom(titleNouns)} of ${getRandom(
        titleAdjectives
      )} Flame`,
  ];
  return getRandom(formats)();
}

function generateName() {
  let shell = generateShellName();
  if (Math.random() < 0.2) shell += " " + generateRareTitle();

  const scar = `${getRandom(scarVerbs)}-${getRandom(
    scarConnectors
  )}-${getRandom(scarNouns)}`;
  const soul = `${getRandom(soulWords)}-${getRandom(soulWords)}-${getRandom(
    soulWords
  )}-${getRandom(soulWords)}`;
  const song = `${getRandom(songSubjects)} ${getRandom(
    songActions
  )} ${getRandom(songObjects)}`;

  document.getElementById(
    "shellName"
  ).innerHTML = `<span style="color:#66fcf1; font-weight:bold;">Shell-Name:</span> <span class="name-value">${shell}</span>`;
  document.getElementById(
    "scarName"
  ).innerHTML = `<span style="color:#66fcf1; font-weight:bold;">Scar-Name:</span> <span class="name-value">${scar}</span>`;
  document.getElementById(
    "soulName"
  ).innerHTML = `<span style="color:#66fcf1; font-weight:bold;">Soul-Name:</span> <span class="name-value">${soul}</span>`;
  document.getElementById(
    "songName"
  ).innerHTML = `<span style="color:#66fcf1; font-weight:bold;">Song-Name:</span> <span class="name-value">${song}</span>`;

  // 🔥 New addition: call BBCode generator
  showBBCode(shell, scar, soul, song);
}

// Initial load
loadNameData()
  .then(() => {
    generateName();
  })
  .catch((err) => console.error("Failed to load initial data:", err));

document.querySelectorAll(".egg-choice").forEach((egg) => {
  egg.addEventListener("click", () => {
    selectedEgg = egg.dataset.egg;

    // Update header icon to match selected egg
    const headerIcon = document.getElementById("eggIconHeader");
    if (headerIcon) {
      headerIcon.src = `img/eggs/${selectedEgg}.svg`;
    }

    // Reload shell-specific data
    loadNameData(selectedEgg).then(() => {
      generateName();

      // Close modal (if Bootstrap 5)
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("eggModal")
      );
      modal.hide();
    });
  });
});

const locations = [
  "ashland",
  "blightlands",
  "canyon",
  "cave",
  "city",
  "crystal_cavern",
  "desert",
  "fungal",
  "glacier",
  "grassland",
  "island",
  "jungle",
  "magma_field",
  "mountain",
  "ocean",
  "permafrost",
  "plateau",
  "riverland",
  "ruins",
  "savannah",
  "swamp",
  "tundra",
  "underworld",
  "wetland",
];

// Inject locations into modal
const locationGrid = document.querySelector(".location-grid");
if (locationGrid) {
  locations.forEach((loc) => {
    const wrapper = document.createElement("div");
    wrapper.className = "location-wrapper";
    wrapper.title = loc.toUpperCase();

    const img = document.createElement("img");
    img.src = `img/locations/${loc}.png`;
    img.alt = loc;
    img.className = "location-choice";
    img.dataset.location = loc;

    const label = document.createElement("div");
    label.className = "location-label";
    label.textContent = splitLabel(loc);

    wrapper.appendChild(img);
    wrapper.appendChild(label);
    locationGrid.appendChild(wrapper);
  });
}

// When a location image is clicked, change the header icon and append data
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("location-choice")) {
    const loc = e.target.dataset.location;
    const url = `data/locations/${loc}.json`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      // Append location data
      prefixes.push(...(data.prefixes || []));
      cores.push(...(data.cores || []));
      suffixes.push(...(data.suffixes || []));
      scarVerbs.push(...(data.scarVerbs || []));
      scarConnectors.push(...(data.scarConnectors || []));
      scarNouns.push(...(data.scarNouns || []));
      soulWords.push(...(data.soulWords || []));
      songSubjects.push(...(data.songSubjects || []));
      songActions.push(...(data.songActions || []));
      songObjects.push(...(data.songObjects || []));

      // Change header icon
      const locationIconHeader = document.getElementById("locationIconHeader");
      if (locationIconHeader) {
        locationIconHeader.src = `img/locations/${loc}.png`;
        locationIconHeader.title = loc.toUpperCase(); // optional tooltip
      }

      console.log(`Location ${loc} selected and icon updated.`);
      generateName();

      // Close modal (Bootstrap 5)
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("locationModal")
      );
      modal.hide();
    } catch (err) {
      console.error(`Failed to load location data for ${loc}:`, err);
    }
  }
});

const ethosList = [
  "artist",
  "builder",
  "explorer",
  "farmer",
  "healer",
  "hunter",
  "law",
  "leader",
  "merchant",
  "nomad",
  "philosopher",
  "priest",
  "scientist",
  "shadow",
  "warrior",
];

// Inject ethos icons into the modal
const ethosGrid = document.querySelector(".ethos-grid");
if (ethosGrid) {
  ethosList.forEach((ethos) => {
    const wrapper = document.createElement("div");
    wrapper.className = "ethos-wrapper";
    wrapper.title = ethos.toUpperCase();

    const img = document.createElement("img");
    img.src = `img/ethos/${ethos}.png`;
    img.alt = ethos;
    img.className = "ethos-choice";
    img.dataset.ethos = ethos;

    const label = document.createElement("div");
    label.className = "ethos-label";
    label.textContent = splitLabel(ethos);

    wrapper.appendChild(img);
    wrapper.appendChild(label);
    ethosGrid.appendChild(wrapper);
  });
}

// Ethos click handling
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("ethos-choice")) {
    const ethos = e.target.dataset.ethos;
    const url = `data/ethos/${ethos}.json`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      prefixes.push(...(data.prefixes || []));
      cores.push(...(data.cores || []));
      suffixes.push(...(data.suffixes || []));
      scarVerbs.push(...(data.scarVerbs || []));
      scarConnectors.push(...(data.scarConnectors || []));
      scarNouns.push(...(data.scarNouns || []));
      soulWords.push(...(data.soulWords || []));
      songSubjects.push(...(data.songSubjects || []));
      songActions.push(...(data.songActions || []));
      songObjects.push(...(data.songObjects || []));

      // Optional: update header icon if you assign one for ethos
      const ethosIconHeader = document.getElementById("ethosIconHeader");
      if (ethosIconHeader) {
        ethosIconHeader.src = `img/ethos/${ethos}.png`;
        ethosIconHeader.title = ethos.toUpperCase();
      }

      console.log(`Ethos ${ethos} selected and appended.`);
      generateName();

      const modal = bootstrap.Modal.getInstance(
        document.getElementById("ethosModal")
      );
      modal.hide();
    } catch (err) {
      console.error(`Failed to load ethos data for ${ethos}:`, err);
    }
  }
});
