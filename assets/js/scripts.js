const fetchDatasButton = document.querySelectorAll(".fetch-items-button");
const favoritesButton = document.getElementById("load-favorites-button");
const datasContainer = document.getElementById("datas-container");
const FAVORITE_PAGE = "favorites";
const MAIN_PAGE = "main";
let favorites = [];
let datasList = [
  {
    copyright: "Nobelium Alkaid",
    date: "2023-04-27",
    explanation:
      "The Tarantula Nebula, also known as 30 Doradus, is more than a thousand light-years in diameter, a giant star forming region within nearby satellite galaxy the Large Magellanic Cloud. About 160 thousand light-years away, it's the largest, most violent star forming region known in the whole Local Group of galaxies. The cosmic arachnid is near the center of this spectacular image taken during the flight of SuperBIT (Super Pressure Balloon Imaging Telescope), NASA's balloon-borne 0.5 meter telescope now floating near the edge of space. Within the well-studied Tarantula (NGC 2070), intense radiation, stellar winds and supernova shocks from the central young cluster of massive stars, cataloged as R136, energize the nebular glow and shape the spidery filaments. Around the Tarantula are other star forming regions with young star clusters, filaments, and blown-out bubble-shaped clouds. SuperBIT's wide field of view spans over 2 degrees or 4 full moons in the southern constellation Dorado.",
    hdurl: "https://apod.nasa.gov/apod/image/2304/SuperBIT_tarantula.png",
    media_type: "image",
    service_version: "v1",
    title: "The Tarantula Nebula from SuperBIT",
    url: "https://apod.nasa.gov/apod/image/2304/SuperBIT_tarantula_1024.png",
  },
  {
    date: "2023-04-28",
    explanation:
      "Like a ship plowing through cosmic seas, runaway star Alpha Camelopardalis has produced this graceful arcing bow wave or bow shock. The massive supergiant star moves at over 60 kilometers per second through space, compressing the interstellar material in its path. At the center of this nearly 6 degree wide view, Alpha Cam is about 25-30 times as massive as the Sun, 5 times hotter (30,000 kelvins), and over 500,000 times brighter. About 4,000 light-years away in the long-necked constellation Camelopardalis, the star also produces a strong stellar wind. Alpha Cam's bow shock stands off about 10 light-years from the star itself. What set this star in motion? Astronomers have long thought that Alpha Cam was flung out of a nearby cluster of young hot stars due to gravitational interactions with other cluster members or perhaps by the supernova explosion of a massive companion star.",
    hdurl: "https://apod.nasa.gov/apod/image/2304/AlphaCamelopardis_s3100.png",
    media_type: "image",
    service_version: "v1",
    title: "Runaway Star Alpha Camelopardalis",
    url: "https://apod.nasa.gov/apod/image/2304/AlphaCamelopardis_s1024.png",
  },
  {
    date: "2019-03-28",
    explanation:
      "Messier 15 is a 13 billion year old relic of the early formative years of our galaxy, one of about 170 globular star clusters that still roam the halo of the Milky Way.  About 200 light-years in diameter, it lies about 35,000 light years away toward the constellation Pegasus. But this realistic looking view of the ancient globular star cluster is not a photograph. Instead it's an animated gif image constructed from remarkably precise individual measurements of star positions, brightness, and color. The astronomically rich data set used was made by the sky-scanning Gaia satellite which also determined parallax distances for 1.3 billion Milky Way stars. In the animated gif, twinkling stars are M15's identified RR Lyrae stars. Plentiful in M15, RR Lyrae stars are evolved pulsating variable stars whose brightness and pulsation period, typically less than a day, are related.",
    hdurl: "https://apod.nasa.gov/apod/image/1903/M15_Gaia_stars.gif",
    media_type: "image",
    service_version: "v1",
    title: "The Gaia Stars of M15",
    url: "https://apod.nasa.gov/apod/image/1903/M15_Gaia_stars1024b.gif",
  },
];

const NASA_APOD = {
  url: "https://api.nasa.gov/planetary/apod",
  count: 10,
  api_key: "DEMO_KEY",
  get fetchUrl() {
    return `${this.url}?api_key=${this.api_key}&count=${this.count}`;
  },
};

/* Display Sweet alert message */
function displayAlert(type, title, message) {
  Swal.fire(title, message, type);
}

// Create HTML Elements from datas List
function populateDOM(page = MAIN_PAGE) {
    const listArray = (page === MAIN_PAGE) ? datasList : Object.values(favorites);
    datasContainer.textContent = '';
  listArray.forEach((item) => {
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("blog-post", "image-container");
    const postThumbEl = document.createElement("div");
    postThumbEl.classList.add("blog-thumb");
    const postImageEl = document.createElement("img");
    postImageEl.src = item.url;
    postImageEl.alt = item.title + "Image";
    const downContentEl = document.createElement("div");
    downContentEl.classList.add("down-content");
    const categoryEl = document.createElement("span");
    categoryEl.classList.add("mini-title");
    categoryEl.textContent = item.media_type;
    const postTitleEl = document.createElement("h4");
    postTitleEl.textContent = item.title;
    const postInfos = document.createElement("ul");
    postInfos.classList.add("post-info");
    const copyrightEl = document.createElement("li");
    copyrightEl.textContent = `© ${item.copyright ?? '-'}`;
    const dateEl = document.createElement("li");
    dateEl.textContent = item.date;
    const descriptionEl = document.createElement("p");
    descriptionEl.textContent = item.explanation;
    const favoriteButtonEl = document.createElement("button");
    favoriteButtonEl.classList.add("add-favorite-button");
    favoriteButtonFunction = (page === FAVORITE_PAGE) ? `removeFavorite('${item.url}')` : `addToFavorites('${item.url}')`
    favoriteButtonEl.setAttribute("onclick", favoriteButtonFunction);
    let favoriteIconEl = document.createElement("i");
    if(page === FAVORITE_PAGE) {
        favoriteIconEl.classList.add('fas', 'fa-trash-alt');
    } else {
        favoriteIconEl.classList.add("far", "fa-heart");
    }
    let favoriteTextEl = document.createElement("span");
    favoriteTextEl.textContent = favoriteIcon = (page === FAVORITE_PAGE) ? "Remove from favorites" : "Add to favorites";
    
    favoriteButtonEl.append(favoriteIconEl, favoriteTextEl);
    postInfos.append(copyrightEl, dateEl);
    downContentEl.append(
      categoryEl,
      postTitleEl,
      postInfos,
      descriptionEl,
      favoriteButtonEl
    );
    postThumbEl.appendChild(postImageEl);
    imageContainer.append(postThumbEl, downContentEl);
    datasContainer.appendChild(imageContainer);
    window.scrollTo(0, 0);
  });
}
populateDOM();

function loadFavorites() {
  favorites = JSON.parse(localStorage.getItem("favorites"));
  if(favorites) {
    populateDOM(FAVORITE_PAGE);
  } else {
    displayAlert('info', 'No items saved', 'Save the images to your favorites to show/read them later')
  }
}

function addToFavorites(itemUrl) {
  const currentFavorites = JSON.parse(localStorage.getItem("favorites")) ?? {};
  if (!currentFavorites[itemUrl]) {
    datasList.forEach((index) => {
      if (index.url === itemUrl) {
        currentFavorites[index.url] = index;
      }
    });
    localStorage.setItem("favorites", JSON.stringify(currentFavorites));
    displayAlert(
      "success",
      "Success",
      "The item has been added to your favorites"
    );
  } else {
    displayAlert("info", "Error", "This item is already in your favorites");
  }
}

function removeFavorite(itemUrl) {
    const currentFavorites = JSON.parse(localStorage.getItem('favorites'));
    if(currentFavorites[itemUrl]) {
        delete(currentFavorites[itemUrl]);
        favorites = currentFavorites;
        localStorage.setItem('favorites', currentFavorites);
        populateDOM(FAVORITE_PAGE);
        displayAlert('success', 'Removed from favorites', 'You will no longer see this image in your favorites list');  
    }

}

// Display Favorites list after click event
favoritesButton.addEventListener('click', loadFavorites);

// Request Images Datas from NASA API
async function getDatasFromAPI() {
  try {
    const response = await fetch(NASA_APOD.fetchUrl);
    datasList = await response.json();
    populateDOM();
  } catch (err) {
    // What to do in case of error
  }
}

// getDatasFromAPI();
