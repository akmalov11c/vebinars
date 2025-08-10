document.addEventListener("DOMContentLoaded", () => {
  // ======= TIMER SECTION =======
  const timers = document.querySelectorAll(".date__timer");
  timers.forEach((el) => {
    const raw = (el.dataset.start || el.textContent || "").trim();
    const match = raw.match(/(\d+)\s*:\s*(\d+)/);
    if (!match) return;

    let minutes = +match[1] || 0;
    let seconds = +match[2] || 0;
    let totalSeconds = minutes * 60 + seconds;

    const update = () => {
      const m = Math.floor(totalSeconds / 60);
      const s = totalSeconds % 60;
      el.textContent = `${m.toString().padStart(2, "0")}:${s
        .toString()
        .padStart(2, "0")}`;

      if (totalSeconds <= 0) {
        clearInterval(el._timerInterval);
        el.dispatchEvent(new CustomEvent("timer-ended", { bubbles: true }));
      } else {
        totalSeconds--;
      }
    };

    update();
    el._timerInterval = setInterval(update, 1000);
  });

  // ======= REGISTRATION MODAL SECTION =======
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

  const phoneFormats = {
    "+998": {
      placeholder: "88 888 88 88",
      validate: /^\d{2} \d{3} \d{2} \d{2}$/,
    },
    "+996": { placeholder: "555 123 456", validate: /^\d{3} \d{3} \d{3}$/ },
    "+992": { placeholder: "55 555 5555", validate: /^\d{2} \d{3} \d{4}$/ },
    "+993": { placeholder: "6 123 4567", validate: /^\d{1} \d{3} \d{4}$/ },
    "+7": { placeholder: "700 123 4567", validate: /^\d{3} \d{3} \d{4}$/ },
    "+49": { placeholder: "170 123 4567", validate: /^\d{3} \d{3} \d{4}$/ },
    "+90": { placeholder: "532 123 4567", validate: /^\d{3} \d{3} \d{4}$/ },
    "+375": { placeholder: "29 123 4567", validate: /^\d{2} \d{3} \d{4}$/ },
    "+380": { placeholder: "50 123 4567", validate: /^\d{2} \d{3} \d{4}$/ },
    "+1": { placeholder: "555 123 4567", validate: /^\d{3} \d{3} \d{4}$/ },
    "+82": { placeholder: "10 1234 5678", validate: /^\d{2} \d{4} \d{4}$/ },
  };

  let currentCountryCode = "+998";

  // Build dropdown once
  countryDropdown.innerHTML = countries
    .map(
      (c) => `
      <div class="country-option${
        c.code === currentCountryCode ? " selected" : ""
      }" data-code="${c.code}">
        <span>${c.name}</span>
        <span class="country-code">${c.code}</span>
      </div>
    `
    )
    .join("");

  // Country selection
  countryDropdown.addEventListener("click", (e) => {
    const option = e.target.closest(".country-option");
    if (!option) return;
    currentCountryCode = option.dataset.code;
    selectedCountryCode.textContent = currentCountryCode;
    phoneInput.placeholder = phoneFormats[currentCountryCode].placeholder;
    phoneInput.value = "";
    phoneError.style.display = "none";
    countryDropdown.style.display = "none";
  });

  selectedCountry.addEventListener("click", () => {
    countryDropdown.style.display =
      countryDropdown.style.display === "block" ? "none" : "block";
  });

  // Phone input formatting
  phoneInput.addEventListener("input", (e) => {
    let digits = e.target.value.replace(/\D/g, "");
    const format = phoneFormats[currentCountryCode];
    // Simple grouping based on placeholder
    const groups = format.placeholder.split(" ").map((g) => g.length);
    let formatted = "";
    let index = 0;
    groups.forEach((len, i) => {
      if (digits.length > index) {
        if (i > 0) formatted += " ";
        formatted += digits.slice(index, index + len);
        index += len;
      }
    });
    e.target.value = formatted;
    phoneError.style.display = "none";
  });

  nameInput.addEventListener("input", () => {
    nameError.style.display = "none";
  });

  // Modal open (delegation)
  document.body.addEventListener("click", (e) => {
    if (e.target.matches(".hero__registerBtn")) {
      registrationModal.style.display = "block";
      document.body.style.overflowY = "hidden";
    }
  });

  const closeModal = () => {
    registrationModal.style.display = "none";
    document.body.style.overflowY = "";
  };
  closeModalBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);

  // Form submit
  registrationForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!nameInput.value.trim()) {
      nameError.style.display = "block";
      return;
    }
    if (!phoneFormats[currentCountryCode].validate.test(phoneInput.value)) {
      phoneError.style.display = "block";
      return;
    }

    submitBtn.textContent = "YUBORILMOQDA...";
    submitBtn.disabled = true;

    const now = new Intl.DateTimeFormat("uz-UZ", {
      dateStyle: "short",
      timeStyle: "medium",
    }).format(new Date());

    localStorage.setItem(
      "formData",
      JSON.stringify({
        Ism: nameInput.value,
        TelefonRaqam: `${currentCountryCode} ${phoneInput.value}`,
        SanaSoat: now,
      })
    );

    window.location.href = "/thankYou.html";
  });
});
