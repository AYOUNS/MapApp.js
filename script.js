"use strict";

//prettier-ignore
const months = ['january','february','March','April','May','June','July','August','September','October','November','December']

class workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance; //in km
    this.duration = duration; //in min
  }
}

class Running extends workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.clacPace();
  }
  clacPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.clacSpeed();
  }
  clacSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

const run1 = new Running([39, -12], 5.66, 34, 175);
const run2 = new Cycling([39, -12], 5.66, 34, 175);

//////////////////////////////////////////
// APPLICATION ARCHTICTURE
const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

class App {
  #map;
  #mapEvent;
  constructor() {
    this._getPosition();
    form.addEventListener("submit", this._newWorkout.bind(this));
    inputType.addEventListener("change", this._toggleElevationField);
  }
  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("sorry, we can not find your location");
        }
      );
  }
  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(latitude, longitude);

    const coords = [latitude, longitude];

    this.#map = L.map("map").setView(coords, 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    //Handling clicks in map

    this.#map.on("click", this._showForm.bind(this));
  }
  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }
  _toggleElevationField() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _newWorkout(e) {
    const calidInputs = (...inputs) =>
      inputs.every((inp) => number.isFinite(inp));

    e.preventDefault();

    //Getdata from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    //If workout running, create running object
    if (type === "running") {
      //check if data is valid
      if (
        !Number.isFinite(distance) ||
        !Number.isFinite(duration) ||
        !Number.isFinite(cadence)
      )
        return alert("Inputs have  to be positive numbers");
      const cadence = +inputCadence.value;
    }
    //If workout cycling, create cycling object
    if (type === "cycling") {
      const elevation = +inputElevation.value;
    }
    //Add new object to workout array

    //Render workout on map as marker
    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.Popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: "running-popup",
        })
      )
      .setPopupContent("Workout")
      .openPopup();

    //hide form + clear input fields
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        "";
    //display marker
  }
}
const app = new App();
app._getPosition();
