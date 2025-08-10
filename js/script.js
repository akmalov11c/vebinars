document.addEventListener("DOMContentLoaded", () => {
  const timers = document.querySelectorAll(".date__timer");
  if (!timers.length) return;

  timers.forEach((el) => {
    // read start time from element text or data-start attribute (fallback)
    const raw = (el.dataset.start || el.textContent || "").trim();
    const match = raw.match(/(\d+)\s*:\s*(\d+)/);
    if (!match) return; // can't parse, skip

    let minutes = parseInt(match[1], 10);
    let seconds = parseInt(match[2], 10);
    if (isNaN(minutes)) minutes = 0;
    if (isNaN(seconds)) seconds = 0;

    let totalSeconds = minutes * 60 + seconds;

    // update function
    function update() {
      const m = Math.floor(totalSeconds / 60);
      const s = totalSeconds % 60;
      el.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(
        2,
        "0"
      )}`;

      if (totalSeconds <= 0) {
        clearInterval(el._timerInterval);
        // dispatch event so you can listen for it
        el.dispatchEvent(new CustomEvent("timer-ended", { bubbles: true }));
      } else {
        totalSeconds--;
      }
    }

    // run immediately then every second
    update();
    el._timerInterval = setInterval(update, 1000);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const registerBtns = document.querySelectorAll(".hero__registerBtn"); // Hamma buttonlar tanlanadi
  const registrationModal = document.getElementById("registrationModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modalOverlay = document.querySelector(".homeModalOverlay");
  const registrationForm = document.getElementById("registrationForm");
  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const nameError = document.getElementById("nameError");
  const phoneError = document.getElementById("phoneError");
  const submitBtn = document.getElementById("submitBtn");
  const selectedCountry = document.getElementById("selectedCountry");
  const selectedCountryCode = document.getElementById("selectedCountryCode");
  const countryDropdown = document.getElementById("countryDropdown");
  const dropdownIcon = document.getElementById("dropdownIcon");

  // Countries data
  const countries = [
    { name: "Uzbekistan", code: "+998" },
    { name: "Qirgiziston", code: "+996" },
    { name: "Tojikiston", code: "+992" },
    { name: "Turkmaniston", code: "+993" },
    { name: "Qozogiston", code: "+7" },
    { name: "Rossiya", code: "+7" },
    { name: "Germaniya", code: "+49" },
    { name: "Turkiya", code: "+90" },
    { name: "Belarusiya", code: "+375" },
    { name: "Ukraina", code: "+380" },
    { name: "AQSH", code: "+1" },
    { name: "Janubiy Koreya", code: "+82" },
  ];

  // Phone formats for different country codes
  const phoneFormats = {
    "+998": {
      placeholder: "88 888 88 88",
      format: function (digits) {
        let formatted = "";
        if (digits.length > 0)
          formatted += digits.slice(0, Math.min(2, digits.length));
        if (digits.length > 2)
          formatted += " " + digits.slice(2, Math.min(5, digits.length));
        if (digits.length > 5)
          formatted += " " + digits.slice(5, Math.min(7, digits.length));
        if (digits.length > 7)
          formatted += " " + digits.slice(7, Math.min(9, digits.length));
        return formatted;
      },
      validate: function (value) {
        return /^\d{2} \d{3} \d{2} \d{2}$/.test(value);
      },
    },
    "+996": {
      placeholder: "555 123 456",
      format: function (digits) {
        let formatted = "";
        if (digits.length > 0)
          formatted += digits.slice(0, Math.min(3, digits.length));
        if (digits.length > 3)
          formatted += " " + digits.slice(3, Math.min(6, digits.length));
        if (digits.length > 6)
          formatted += " " + digits.slice(6, Math.min(9, digits.length));
        return formatted;
      },
      validate: function (value) {
        return /^\d{3} \d{3} \d{3}$/.test(value);
      },
    },
    "+992": {
      placeholder: "55 555 5555",
      format: function (digits) {
        let formatted = "";
        if (digits.length > 0)
          formatted += digits.slice(0, Math.min(2, digits.length));
        if (digits.length > 2)
          formatted += " " + digits.slice(2, Math.min(5, digits.length));
        if (digits.length > 5)
          formatted += " " + digits.slice(5, Math.min(9, digits.length));
        return formatted;
      },
      validate: function (value) {
        return /^\d{2} \d{3} \d{4}$/.test(value);
      },
    },
    "+993": {
      placeholder: "6 123 4567",
      format: function (digits) {
        let formatted = "";
        if (digits.length > 0)
          formatted += digits.slice(0, Math.min(1, digits.length));
        if (digits.length > 1)
          formatted += " " + digits.slice(1, Math.min(4, digits.length));
        if (digits.length > 4)
          formatted += " " + digits.slice(4, Math.min(8, digits.length));
        return formatted;
      },
      validate: function (value) {
        return /^\d{1} \d{3} \d{4}$/.test(value);
      },
    },
    "+7": {
      placeholder: "700 123 4567",
      format: function (digits) {
        let formatted = "";
        if (digits.length > 0)
          formatted += digits.slice(0, Math.min(3, digits.length));
        if (digits.length > 3)
          formatted += " " + digits.slice(3, Math.min(6, digits.length));
        if (digits.length > 6)
          formatted += " " + digits.slice(6, Math.min(10, digits.length));
        return formatted;
      },
      validate: function (value) {
        return /^\d{3} \d{3} \d{4}$/.test(value);
      },
    },
    "+49": {
      placeholder: "170 123 4567",
      format: function (digits) {
        let formatted = "";
        if (digits.length > 0)
          formatted += digits.slice(0, Math.min(3, digits.length));
        if (digits.length > 3)
          formatted += " " + digits.slice(3, Math.min(6, digits.length));
        if (digits.length > 6)
          formatted += " " + digits.slice(6, Math.min(10, digits.length));
        return formatted;
      },
      validate: function (value) {
        return /^\d{3} \d{3} \d{4}$/.test(value);
      },
    },
    "+90": {
      placeholder: "532 123 4567",
      format: function (digits) {
        let formatted = "";
        if (digits.length > 0)
          formatted += digits.slice(0, Math.min(3, digits.length));
        if (digits.length > 3)
          formatted += " " + digits.slice(3, Math.min(6, digits.length));
        if (digits.length > 6)
          formatted += " " + digits.slice(6, Math.min(10, digits.length));
        return formatted;
      },
      validate: function (value) {
        return /^\d{3} \d{3} \d{4}$/.test(value);
      },
    },
    "+375": {
      placeholder: "29 123 4567",
      format: function (digits) {
        let formatted = "";
        if (digits.length > 0)
          formatted += digits.slice(0, Math.min(2, digits.length));
        if (digits.length > 2)
          formatted += " " + digits.slice(2, Math.min(5, digits.length));
        if (digits.length > 5)
          formatted += " " + digits.slice(5, Math.min(9, digits.length));
        return formatted;
      },
      validate: function (value) {
        return /^\d{2} \d{3} \d{4}$/.test(value);
      },
    },
    "+380": {
      placeholder: "50 123 4567",
      format: function (digits) {
        let formatted = "";
        if (digits.length > 0)
          formatted += digits.slice(0, Math.min(2, digits.length));
        if (digits.length > 2)
          formatted += " " + digits.slice(2, Math.min(5, digits.length));
        if (digits.length > 5)
          formatted += " " + digits.slice(5, Math.min(9, digits.length));
        return formatted;
      },
      validate: function (value) {
        return /^\d{2} \d{3} \d{4}$/.test(value);
      },
    },
    "+1": {
      placeholder: "555 123 4567",
      format: function (digits) {
        let formatted = "";
        if (digits.length > 0)
          formatted += digits.slice(0, Math.min(3, digits.length));
        if (digits.length > 3)
          formatted += " " + digits.slice(3, Math.min(6, digits.length));
        if (digits.length > 6)
          formatted += " " + digits.slice(6, Math.min(10, digits.length));
        return formatted;
      },
      validate: function (value) {
        return /^\d{3} \d{3} \d{4}$/.test(value);
      },
    },
    "+82": {
      placeholder: "10 1234 5678",
      format: function (digits) {
        let formatted = "";
        if (digits.length > 0)
          formatted += digits.slice(0, Math.min(2, digits.length));
        if (digits.length > 2)
          formatted += " " + digits.slice(2, Math.min(6, digits.length));
        if (digits.length > 6)
          formatted += " " + digits.slice(6, Math.min(10, digits.length));
        return formatted;
      },
      validate: function (value) {
        return /^\d{2} \d{4} \d{4}$/.test(value);
      },
    },
  };

  // Current selected country code
  let currentCountryCode = "+998";

  // Populate country dropdown
  function populateCountryDropdown() {
    countryDropdown.innerHTML = "";
    countries.forEach((country) => {
      const option = document.createElement("div");
      option.className = "country-option";
      if (country.code === currentCountryCode) {
        option.classList.add("selected");
      }

      option.innerHTML = `
        <span>${country.name}</span>
        <span class="country-code">${country.code}</span>
        ${
          country.code === currentCountryCode
            ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'
            : ""
        }
      `;

      option.addEventListener("click", function () {
        selectCountry(country);
      });

      countryDropdown.appendChild(option);
    });
  }

  // Format phone number based on country code
  function formatPhoneNumber(value, countryCode) {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");

    // Get the format for the selected country or default to Uzbekistan
    const format = phoneFormats[countryCode] || phoneFormats["+998"];

    return format.format(digits);
  }

  // Validate phone number based on country code
  function validatePhoneNumber(value, countryCode) {
    const format = phoneFormats[countryCode] || phoneFormats["+998"];
    return format.validate(value);
  }

  // Select a country
  function selectCountry(country) {
    currentCountryCode = country.code;
    selectedCountryCode.textContent = country.code;
    countryDropdown.style.display = "none";

    // Update phone input placeholder
    const format = phoneFormats[country.code] || phoneFormats["+998"];
    phoneInput.placeholder = format.placeholder;

    // Clear phone input when country changes
    phoneInput.value = "";
    phoneError.style.display = "none";

    // Update dropdown icon
    dropdownIcon.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
  }

  // Toggle country dropdown
  selectedCountry.addEventListener("click", function () {
    const isOpen = countryDropdown.style.display === "block";

    if (isOpen) {
      countryDropdown.style.display = "none";
      dropdownIcon.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
    } else {
      populateCountryDropdown();
      countryDropdown.style.display = "block";
      dropdownIcon.innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function (event) {
    if (
      !selectedCountry.contains(event.target) &&
      !countryDropdown.contains(event.target)
    ) {
      countryDropdown.style.display = "none";
      dropdownIcon.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
    }
  });

  // Phone input formatting
  phoneInput.addEventListener("input", function (e) {
    const inputValue = e.target.value;
    const formatted = formatPhoneNumber(inputValue, currentCountryCode);
    phoneInput.value = formatted;
    phoneError.style.display = "none";
  });

  // Name input validation
  nameInput.addEventListener("input", function () {
    nameError.style.display = "none";
  });

  // Open modal for all register buttons
  registerBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      registrationModal.style.display = "block";
      document.body.style.overflowY = "hidden";
    });
  });

  // Close modal
  function closeModal() {
    registrationModal.style.display = "none";
    document.body.style.overflowY = "scroll";
  }

  closeModalBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);

  // Form submission
  registrationForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!nameInput.value.trim()) {
      nameError.style.display = "block";
      phoneError.style.display = "none";
      return;
    }

    nameError.style.display = "none";

    if (!validatePhoneNumber(phoneInput.value, currentCountryCode)) {
      phoneError.style.display = "block";
      return;
    }

    phoneError.style.display = "none";
    submitBtn.textContent = "YUBORILMOQDA...";
    submitBtn.disabled = true;

    const now = new Date();
    const formattedDate = now.toLocaleDateString("uz-UZ");
    const formattedTime = now.toLocaleTimeString("uz-UZ");

    // Create form data object
    const formData = {
      Ism: nameInput.value,
      TelefonRaqam: `${currentCountryCode} ${phoneInput.value}`,
      SanaSoat: `${formattedDate} - ${formattedTime}`,
    };

    // Save to localStorage
    localStorage.setItem("formData", JSON.stringify(formData));

    // Redirect to thankYou.html
    window.location.href = "/thankYou.html";

    // Reset form
    submitBtn.textContent = "DAVOM ETISH";
    submitBtn.disabled = false;
    nameInput.value = "";
    phoneInput.value = "";
    closeModal();
  });
});
