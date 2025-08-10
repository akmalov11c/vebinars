async function sendFormData() {
  const formDataRaw = localStorage.getItem("formData");
  if (!formDataRaw) {
    return;
  }

  const formDataObj = JSON.parse(formDataRaw);

  // Prepare FormData for API
  const formData = new FormData();
  formData.append("Ism", formDataObj.Ism);
  formData.append("Telefon raqam", formDataObj.TelefonRaqam);
  formData.append("Sana, Soat", formDataObj.SanaSoat);

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwZAi2YCAKbzFhZbCvujls7j7eDsOuss5pkHfZBsVTxazFV2zBZT3V0yJ8iEPhclHeG/exec",
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      localStorage.removeItem("formData");
    } else {
      throw new Error("API response was not ok");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    document.getElementById("errorMessage").style.display = "block";
  }
}

// Send data when page loads
window.onload = sendFormData;
