$(document).ready(function() {
  const countrySelect = $('#countrySelect');
  const citySelect = $('#citySelect');
  const timeSelect = $('#timeSelect');

  // Fetch countries and populate the country dropdown
  $.ajax({
    url: '/JC-Airlines/client/pages/GetDestinationCountries.php',
    method: 'GET',
    success: function(data) {
      const countries = JSON.parse(data);
      // Populate the country dropdown
      countries.forEach(country => {
        countrySelect.append(new Option(country, country));
      });
    },
    error: function(err) {
      console.log('Error fetching countries:', err);
    }
  });

  // When a country is selected, fetch and update cities
  countrySelect.change(function() {
    const selectedCountry = $(this).val();
    
    // Reset city and time selects
    citySelect.empty().append('<option value="">Select City</option>');
    timeSelect.empty().append('<option value="">Select Time</option>');

    if (selectedCountry) {
      $.ajax({
        url: 'GetDestinationCities.php',
        method: 'GET',
        data: { country: selectedCountry },
        success: function(data) {
          try {
            const cities = JSON.parse(data);

            // Populate city dropdown with cities from the selected country
            cities.forEach(city => {
              citySelect.append(new Option(city, city));
            });
          } catch (err) {
            console.error("Error parsing cities data:", err);
          }
        },
        error: function(err) {
          console.log('Error fetching cities:', err);
        }
      });
    }
  });

  // When a city is selected, fetch and update times
  citySelect.change(function() {
    const selectedCity = $(this).val();
    
    // Reset time select
    timeSelect.empty().append('<option value="">Select Time</option>');

    if (selectedCity) {
      $.ajax({
        url: 'GetFlightTimes.php',
        method: 'GET',
        data: { city: selectedCity },
        success: function(data) {
          try {
            const times = JSON.parse(data);

            // Populate time dropdown with available times for the selected city
            times.forEach(time => {
              timeSelect.append(new Option(time, time));
            });
          } catch (err) {
            console.error("Error parsing times data:", err);
          }
        },
        error: function(err) {
          console.log('Error fetching times:', err);
        }
      });
    }
  });
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
