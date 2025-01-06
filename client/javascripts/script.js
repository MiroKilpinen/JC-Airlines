document.addEventListener("DOMContentLoaded", function () {
  const countrySelect = document.getElementById("countrySelect");
  const citySelect = document.getElementById("citySelect");
  const timeSelect = document.getElementById("timeSelect");
  const dateInput = document.getElementById("date");
  const continueButton = document.getElementById("continueButton");
  const availableSeatsElement = document.getElementById("availableSeats");
  const ticketAmount = document.getElementById("ticketAmount");
  const ticketCostElement = document.getElementById("ticketCost");

  let availableSeats = 0;
  let ticketCost = 0;

  // Function to check if all required fields are filled
  function checkFormValidity() {
    const dateValue = dateInput.value.trim();
    const countryValue = countrySelect.value.trim();
    const cityValue = citySelect.value.trim();
    const timeValue = timeSelect.value.trim();
    const ticketValue = ticketAmount.value.trim();

    // If all required fields are filled, enable jatka button
    if (
      dateValue &&
      countryValue &&
      cityValue &&
      timeValue &&
      ticketValue &&
      parseInt(ticketValue) > 0
    ) {
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

  countrySelect.addEventListener("change", function () {
    const selectedCountry = countrySelect.value;

    // Reset city and time selects
    citySelect.innerHTML = '<option value=""></option>';
    citySelect.disabled = true;
    timeSelect.innerHTML = '<option value=""></option>';
    timeSelect.disabled = true;

    // Reset available seats and ticket cost elements
    availableSeatsElement.textContent = "--";
    ticketCostElement.textContent = "--";

    checkFormValidity();

    if (selectedCountry) {
      fetch(
        `/JC-Airlines/server/GetDestinationCities.php?country=${encodeURIComponent(
          selectedCountry
        )}`
      )
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

  citySelect.addEventListener("change", function () {
    const selectedCity = citySelect.value;

    timeSelect.innerHTML = '<option value=""></option>';
    timeSelect.disabled = true;

    availableSeatsElement.textContent = "--";
    ticketCostElement.textContent = "--";

    checkFormValidity();

    if (selectedCity) {
      fetch(
        `/JC-Airlines/server/GetFlightTimes.php?city=${encodeURIComponent(
          selectedCity
        )}`
      )
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.json();
        })
        .then((timesWithPlanes) => {
          timesWithPlanes.forEach((timeWithPlane) => {
            const option = document.createElement("option");
            option.value = timeWithPlane; // Use the combined time and plane value
            option.textContent = timeWithPlane + " lentokoneella"; // Display the combined time and plane in the dropdown
            timeSelect.appendChild(option);
          });
          timeSelect.disabled = false;
          checkFormValidity();
        })
        .catch((err) => console.error("Error fetching times:", err));
    }
  });

  function updateAvailableSeatsAndCost() {
    const city = citySelect.value;
    const selectedTime = timeSelect.value;

    if (city && selectedTime) {
      fetch(
        `/JC-Airlines/server/GetFlightDetails.php?city=${encodeURIComponent(
          city
        )}&time=${encodeURIComponent(selectedTime)}`
      )
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.json();
        })
        .then((data) => {
          availableSeats = data.availableSeats;
          ticketCost = data.ticketCost;
          availableSeatsElement.textContent = `${availableSeats}`;
          ticketCostElement.textContent = `${ticketCost} €`;
        })
        .catch((err) => {
          console.error("Error fetching flight details:", err);
          availableSeatsElement.textContent = "--";
          ticketCostElement.textContent = "--";
        });
    } else {
      availableSeatsElement.textContent = "--";
      ticketCostElement.textContent = "--";
    }
  }

  // When the date input changes, check if all fields are filled
  dateInput.addEventListener("input", checkFormValidity);

  ticketAmount.addEventListener("input", function () {
    // Limit the ticketAmount to availableSeats
    const ticketValue = parseInt(ticketAmount.value);
    if (ticketValue > availableSeats) {
      ticketAmount.value = availableSeats; // Reset the value to availableSeats if the user exceeds it
      alert(
        `Lippujen määrä ei voi ylittää vapaiden paikkojen määrää (${availableSeats}).`
      );
    }
    checkFormValidity();
  });

  // When the user selects a country, city, or time, check if all fields are filled
  countrySelect.addEventListener("change", checkFormValidity);
  citySelect.addEventListener("change", checkFormValidity);
  timeSelect.addEventListener("change", checkFormValidity);

  // Update both available seats and ticket cost when city or time is selected
  citySelect.addEventListener("change", updateAvailableSeatsAndCost);
  timeSelect.addEventListener("change", updateAvailableSeatsAndCost);
});

// Function to dynamically add passenger information fields
function addPassengerInfoInputs() {
  const form = document.querySelector(".form");
  const passengerInfoDiv = document.createElement("div");
  passengerInfoDiv.classList.add("passengerInfo-container");

  const fields = [
    { label: "Nimi:", type: "text", name: "name" },
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
    input.required = true;

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

  const buyButton = document.createElement("button");
  buyButton.type = "button";
  buyButton.textContent = "Osta";
  buyButton.classList.add("buy-button");

  buyButton.addEventListener("click", () => {
    const date = form.querySelector('input[name="date"]').value.trim();
    const country = countrySelect.value.trim();
    const city = citySelect.value.trim();
    const timeAndPlane = timeSelect.value.trim();
    const tickets = ticketAmount.value.trim();
    const name = passengerInfoDiv
      .querySelector('input[name="name"]')
      .value.trim();
    const address = passengerInfoDiv
      .querySelector('input[name="address"]')
      .value.trim();
    const email = passengerInfoDiv
      .querySelector('input[name="email"]')
      .value.trim();
    const phone = passengerInfoDiv
      .querySelector('input[name="phone"]')
      .value.trim();

    if (
      !date ||
      !country ||
      !city ||
      !timeAndPlane ||
      !tickets ||
      !name ||
      !address ||
      !email ||
      !phone
    ) {
      alert("Täytä kaikki kentät!");
      return;
    }

    fetch("/JC-Airlines/server/SaveOrder.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date,
        country,
        city,
        timeAndPlane,
        availableSeats,
        tickets,
        name,
        address,
        email,
        phone,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Virhe tilauksen tallentamisessa.");
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          alert("Tilaus tallennettu onnistuneesti!");
          form.querySelector('input[name="date"]').value = "";
          ticketAmount.value = "";
          location.reload();
        } else {
          alert("Virhe: " + data.error);
        }
      })
      .catch((err) => {
        console.error("Error saving order:", err);
        alert("Virhe tilauksen tallentamisessa.");
      });
  });

  passengerInfoDiv.appendChild(backButton);
  passengerInfoDiv.appendChild(buyButton);

  form.insertBefore(
    passengerInfoDiv,
    document.querySelector("#continueButton")
  );

  const continueButton = document.querySelector("#continueButton");
  continueButton.style.display = "none";
}
