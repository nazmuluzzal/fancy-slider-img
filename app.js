const imagesArea = document.querySelector(".images");
const gallery = document.querySelector(".gallery");
const galleryHeader = document.querySelector(".gallery-header");
const searchBtn = document.getElementById("search-btn");
const search = document.getElementById("search");
const sliderBtn = document.getElementById("create-slider");
const sliderContainer = document.getElementById("sliders");
const errorMessage = document.getElementById("error-message");
// selected image
let sliders = [];

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = "15674931-a9d714b6e9d654524df198e00&q";

const getImages = (query) => {
  toggleSpiner();
  const url = `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => showImages(data.hits))
    .catch((err) => displayErrorMsg("Please Try Agian Later"));
};

// show images
const showImages = (images) => {
  imagesArea.style.display = "block";
  gallery.innerHTML = "";
  // show gallery title
  galleryHeader.style.display = "flex";
  const searchInputTxt = document.getElementById("search").value;
  if (searchInputTxt === "") {
    displayErrorMsg("Please Enter a Image Name First");
    imagesArea.style.display = "none";
  } else if (images.length > 0) {
    document.getElementById("search-result").style.display = "block";
    const imageCount = images.length;
    document.getElementById("counter").innerText = imageCount;
    console.log(imageCount);
    imagesArea.style.display = "block";
    images.forEach((image) => {
      let div = document.createElement("div");
      div.className = "col-lg-3 col-md-4 col-xs-6 img-item mb-2";
      div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div);
    });
  } else {
    displayErrorMsg("Your Searching Image Not Found");

    imagesArea.style.display = "none";
  }

  toggleSpiner();
};

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle("added");

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    for (let i = 0; i < sliders.length; i++) {
      if (sliders[i] == img) {
        sliders.splice(i, 1);
      }
    }
  }
};

// create slider
let timer;
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert("Select at least 2 image.");
    return;
  }
  // crate slider previous next area
  document.getElementById("search-result").style.display = "none";
  sliderContainer.innerHTML = "";
  const prevNext = document.createElement("div");
  prevNext.className =
    "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext);

  document.querySelector(".main").style.display = "block";

  // hide image aria
  imagesArea.style.display = "none";
  const duration = document.getElementById("duration").value || 1000;

  if (duration > 0) {
    sliders.forEach((slide) => {
      let item = document.createElement("div");
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
      sliderContainer.appendChild(item);
    });
    changeSlide(0);
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration);
  } else {
    alert("Please Write positive vlaue");
    document.getElementById("duration").value = "";
    document.querySelector(".main").style.display = "none";
    imagesArea.style.display = "block";
  }
};

// change slider index
const changeItem = (index) => {
  changeSlide((slideIndex += index));
};

// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll(".slider-item");
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  }

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach((item) => {
    item.style.display = "none";
  });

  items[index].style.display = "block";
};

// Search Button By Mouser Click
searchBtn.addEventListener("click", function () {
  document.querySelector(".main").style.display = "none";
  clearInterval(timer);
  const search = document.getElementById("search");
  getImages(search.value);
  sliders.length = 0;
});

// Search Button by key board enter
search.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});

sliderBtn.addEventListener("click", function () {
  createSlider();
});

// Error Message
const displayErrorMsg = (error) => {
  errorMessage.innerText = error;
};

// toggle spinner
const toggleSpiner = () => {
  const spinner = document.getElementById("loading-spinner");
  spinner.classList.toggle("d-none");
};
