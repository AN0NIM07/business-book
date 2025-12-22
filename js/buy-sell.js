document.addEventListener("DOMContentLoaded", function() {

  // ===============================
  // CONFIG
  // ===============================
  const scriptURL = "https://script.google.com/macros/s/AKfycbze3eRW5j3DByeBGz2cy8sHZjPGE1ncSp3vslZADXKbeIqmakXbDIpNrRhXkdE46RAE/exec"; // <-- replace with your GAS Web App URL

  // ===============================
  // ELEMENTS
  // ===============================
  const form = document.getElementById("entryForm");
  const dateInput = document.getElementById("date");
  const cqInput = document.getElementById("cqDate");
  const actionInput = document.getElementById("action");
  const companyInput = document.getElementById("company");
  const productTypeInput = document.getElementById("productType");
  const productInput = document.getElementById("product");
  const weightInput = document.getElementById("weight");
  const priceInput = document.getElementById("price");
  const brokerInput = document.getElementById("broker");
  const brokeriInput = document.getElementById("brokeri");
  const detailsInput = document.getElementById("details");
  const fileInput = document.getElementById("photo");
  const submitBtn = form.querySelector(".submit-btn");
  const loadingOverlay = document.getElementById("loadingOverlay");
  const successPopup = document.getElementById("successPopup");
  const closePopup = document.getElementById("closePopup");

  // ===============================
  // INITIAL STATE
  // ===============================
  loadingOverlay.style.display = "none";
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;
  cqInput.value = today;

  // ===============================
  // HELPERS
  // ===============================
  function convertToDDMMYYYY(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
  }

  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // ===============================
  // FORM SUBMIT
  // ===============================
  form.addEventListener("submit", async function(e){
    e.preventDefault();

    console.log("✅ Submit clicked");

    // Show loading overlay
    loadingOverlay.style.display = "flex";

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.style.opacity = 0.6;

    // Handle image file
    let imageBase64 = "";
    let imageType = "";
    if(fileInput.files.length > 0){
      const file = fileInput.files[0];
      imageType = file.type;
      try {
        imageBase64 = await toBase64(file);
      } catch(err){
        console.error("Error reading image file:", err);
      }
    }

    // Build payload
    const payload = {
      date: convertToDDMMYYYY(dateInput.value),
      action: actionInput.value,
      company: companyInput.value,
      productType: productTypeInput.value,
      product: productInput.value,
      weight: weightInput.value,
      price: priceInput.value,
      cqDate: convertToDDMMYYYY(cqInput.value),
      broker: brokerInput.value,
      brokeri: brokeriInput.value,
      otherDetails: detailsInput.value,
      image: imageBase64,
      imageType: imageType
    };

    console.log("Payload:", payload);

    // Send to Google Apps Script
    fetch(scriptURL, { method: "POST", body: JSON.stringify(payload) })
      .then(res => {
        console.log("Raw fetch response:", res);
        return res.json();
      })
      .then(resp => {
        console.log("Parsed response:", resp);

        // Hide loading & enable button
        loadingOverlay.style.display = "none";
        submitBtn.disabled = false;
        submitBtn.style.opacity = 1;

        // Success
        if(resp.status === "success"){
          successPopup.style.display = "block";
          form.reset();
          dateInput.value = today;
          cqInput.value = today;
        } else {
          alert("❌ Submission error: " + (resp.message || JSON.stringify(resp)));
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        loadingOverlay.style.display = "none";
        submitBtn.disabled = false;
        submitBtn.style.opacity = 1;
        alert("❌ Error submitting data. See console for details.");
      });
  });

  // ===============================
  // POPUP HANDLING
  // ===============================
  closePopup.onclick = function() {
    successPopup.style.display = "none";
  };

  window.onclick = function(event) {
    if(event.target == successPopup){
      successPopup.style.display = "none";
    }
  };

});
