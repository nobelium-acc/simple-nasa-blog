const fetchDatasButton = document.querySelectorAll(".fetch-items-button");
const favoritesButton = document.getElementById("load-favorites-button");
const datasContainer = document.getElementById("datas-container");
const loaderEl = document.getElementById("loader");
const loadItemsButton = document.getElementById('load-items-button');
const FAVORITE_PAGE = "favorites";
const MAIN_PAGE = "main";
let favorites = [];
let datasList = [];

const NASA_APOD = {
  url: "https://api.nasa.gov/planetary/apod",
  count: 10,
  api_key: "DEMO_KEY",
  get fetchUrl() {
    return `${this.url}?api_key=${this.api_key}&count=${this.count}`;
  },
};

//Show Loading Screen
function loading() {
  loaderEl.classList.remove("hidden");
}

// Hide Loading Screen
function stopLoading() {
  loaderEl.classList.add("hidden");
}

/* Display Sweet alert message */
function displayAlert(type, title, message) {
  Swal.fire(title, message, type);
}

// Create HTML Elements from datas List
function populateDOM(page = MAIN_PAGE) {
  const listArray = page === MAIN_PAGE ? datasList : Object.values(favorites);
  datasContainer.textContent = "";
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
    copyrightEl.textContent = `© ${item.copyright ?? "-"}`;
    const dateEl = document.createElement("li");
    dateEl.textContent = item.date;
    const descriptionEl = document.createElement("p");
    descriptionEl.textContent = item.explanation;
    const favoriteButtonEl = document.createElement("button");
    favoriteButtonEl.classList.add("add-favorite-button");
    favoriteButtonFunction =
      page === FAVORITE_PAGE
        ? `removeFavorite('${item.url}')`
        : `addToFavorites('${item.url}')`;
    favoriteButtonEl.setAttribute("onclick", favoriteButtonFunction);
    let favoriteIconEl = document.createElement("i");
    if (page === FAVORITE_PAGE) {
      favoriteIconEl.classList.add("fas", "fa-trash-alt");
    } else {
      favoriteIconEl.classList.add("far", "fa-heart");
    }
    let favoriteTextEl = document.createElement("span");
    favoriteTextEl.textContent = favoriteIcon =
      page === FAVORITE_PAGE ? "Remove from favorites" : "Add to favorites";

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
    loadItemsButton.classList.remove('hidden');
  });
}

function loadFavorites() {
  favorites = JSON.parse(localStorage.getItem("favorites"));
  if (favorites) {
    populateDOM(FAVORITE_PAGE);
  } else {
    displayAlert(
      "info",
      "No items saved",
      "Save the images to your favorites to show/read them later"
    );
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
  const currentFavorites = JSON.parse(localStorage.getItem("favorites"));
  if (currentFavorites[itemUrl]) {
    delete currentFavorites[itemUrl];
    favorites = currentFavorites;
    localStorage.setItem("favorites", JSON.stringify(currentFavorites));
    populateDOM(FAVORITE_PAGE);
    favoritesButton.classList.add('active');
    displayAlert(
      "success",
      "Removed from favorites",
      "You will no longer see this image in your favorites list"
    );
  } else {
    displayAlert('error', 'Empty list', "This item no longer exists");
  }
}

// Display Favorites list after click event
favoritesButton.addEventListener("click", loadFavorites);

// Request Images Datas from NASA API
async function getDatasFromAPI() {
  try {
    loading();
    const response = await fetch(NASA_APOD.fetchUrl);
    datasList = await response.json();
    populateDOM();
    stopLoading();
  } catch (err) {
    // What to do in case of error
  }
}

getDatasFromAPI();

fetchDatasButton.forEach(element => {
    element.addEventListener('click', getDatasFromAPI);
})
