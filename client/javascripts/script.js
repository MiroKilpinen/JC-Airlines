document.addEventListener("DOMContentLoaded", function () {
  const countrySelect = document.getElementById("countrySelect");
  const citySelect = document.getElementById("citySelect");
  const timeSelect = document.getElementById("timeSelect");
  const dateInput = document.getElementById("date");
  const continueButton = document.getElementById("continueButton");
  const passengerAmount = document.getElementById("PassengerAmount");

  // Function to check if all required fields are filled
  function checkFormValidity() {
    const dateValue = dateInput.value.trim();
    const countryValue = countrySelect.value.trim();
    const cityValue = citySelect.value.trim();
    const timeValue = timeSelect.value.trim();
    const passengerValue = passengerAmount.value.trim();

    // If all required fields are filled, enable jatka button
    if (dateValue && countryValue && cityValue && timeValue && passengerValue && parseInt(passengerValue) > 0) {
      continueButton.disabled = false;
    } else {
      continueButton.disabled = true;
    }
  }

  // Fetch countries and populate the country dropdown
  fetch("/JC-Airlines/server/GetDestinationCountries.php")
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((countries) => {
      countries.forEach((country) => {
        const option = document.createElement("option");
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
      });
    })
    .catch((err) => console.error("Error fetching countries:", err));

  // When a country is selected, fetch and update cities
  countrySelect.addEventListener("change", function () {
    const selectedCountry = countrySelect.value;

    // Reset city and time selects
    citySelect.innerHTML = '<option value=""></option>';
    citySelect.disabled = true;
    timeSelect.innerHTML = '<option value=""></option>';
    timeSelect.disabled = true;

    checkFormValidity();

    if (selectedCountry) {
      fetch(`/JC-Airlines/server/GetDestinationCities.php?country=${encodeURIComponent(selectedCountry)}`)
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.json();
        })
        .then((cities) => {
          cities.forEach((city) => {
            const option = document.createElement("option");
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
          });
          citySelect.disabled = false;
        })
        .catch((err) => console.error("Error fetching cities:", err));
    }
  });

  // When a city is selected, fetch and update times
  citySelect.addEventListener("change", function () {
    const selectedCity = citySelect.value;

    // Reset time select
    timeSelect.innerHTML = '<option value=""></option>';
    timeSelect.disabled = true;

    checkFormValidity();

    if (selectedCity) {
      fetch(`/JC-Airlines/server/GetFlightTimes.php?city=${encodeURIComponent(selectedCity)}`)
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.json();
        })
        .then((times) => {
          times.forEach((time) => {
            const option = document.createElement("option");
            option.value = time;
            option.textContent = time;
            timeSelect.appendChild(option);
          });
          timeSelect.disabled = false;
          checkFormValidity();
        })
        .catch((err) => console.error("Error fetching times:", err));
    }
  });

  // When the date input changes, check if all fields are filled
  dateInput.addEventListener("input", checkFormValidity);
  passengerAmount.addEventListener("input", checkFormValidity);


  // When the user selects a country, city, or time, check if all fields are filled
  countrySelect.addEventListener("change", checkFormValidity);
  citySelect.addEventListener("change", checkFormValidity);
  timeSelect.addEventListener("change", checkFormValidity);

});

// Function to dynamically add passenger information fields
function addPassengerInfoInputs() {
  const form = document.querySelector(".form");

  const passengerInfoDiv = document.createElement("div");
  passengerInfoDiv.classList.add("passengerInfo-container");

  const fields = [
    { label: "Etunimi:", type: "text", name: "firstName" },
    { label: "Sukunimi:", type: "text", name: "lastName" },
    { label: "Osoite:", type: "text", name: "address" },
    { label: "Sähköposti:", type: "email", name: "email" },
    { label: "Puhelinnumero:", type: "phone", name: "phone" },
  ];

  fields.forEach((field) => {
    const label = document.createElement("label");
    label.textContent = field.label;
    label.setAttribute("for", field.name);

    const input = document.createElement("input");
    input.type = field.type;
    input.name = field.name;

    passengerInfoDiv.appendChild(label);
    passengerInfoDiv.appendChild(input);
  });

  const backButton = document.createElement("button");
  backButton.type = "button";
  backButton.textContent = "Takaisin";
  backButton.classList.add("remove-button");

  backButton.addEventListener("click", () => {
    passengerInfoDiv.remove();
    const continueButton = document.querySelector("#continueButton");
    continueButton.style.display = "block";
  });

  passengerInfoDiv.appendChild(backButton);

  form.insertBefore(
    passengerInfoDiv,
    document.querySelector("#continueButton")
  );

  const continueButton = document.querySelector("#continueButton");
  continueButton.style.display = "none";
}
