// ===============================
// CONFIG
// ===============================
const loadingOverlay = document.getElementById("loadingOverlay");
const scriptURL = "https://script.google.com/macros/s/AKfycbydAYSxaobAi6LWq54_CtmakkHcuX4q2palpxfY62819yDXm4crfGvWAEmdVHZ9cny7/exec";

// ===============================
// ELEMENTS
// ===============================
const dateInput = document.getElementById("date");
const cqInput = document.getElementById("cqDate");
const form = document.getElementById("entryForm");
const fileInput = document.getElementById("photo");

// Other fields
const actionInput = document.getElementById("action");
const companyInput = document.getElementById("company");
const productTypeInput = document.getElementById("productType");
const productInput = document.getElementById("product");
const weightInput = document.getElementById("weight");
const priceInput = document.getElementById("price");
const paymentInput = document.getElementById("payment");
const brokerInput = document.getElementById("broker");
const brokeriInput = document.getElementById("brokeri");
const detailsInput = document.getElementById("details");

// ===============================
// AUTO-FILL TODAY DATE
// ===============================
const today = new Date().toISOString().split('T')[0];
dateInput.value = today;
cqInput.value = today;

// ===============================
// HELPER: Convert YYYY-MM-DD → DD/MM/YYYY
// ===============================
function convertToDDMMYYYY(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

// ===============================
// IMAGE → BASE64
// ===============================
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ===============================
// FORM SUBMISSION
// ===============================
form.addEventListener("submit", async function(e) {
  e.preventDefault();
  
  // Show loading overlay
  //loadingOverlay.style.display = "flex";
  
  // Disable submit button to prevent double click
  const submitBtn = form.querySelector(".submit-btn");
  submitBtn.disabled = true;
  submitBtn.style.opacity = 0.6; // optional visual feedback

  // Handle image if uploaded
  let imageBase64 = "";
  let imageType = "";
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    imageType = file.type;
    imageBase64 = await toBase64(file);
  }

  // Prepare payload
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
	payment: paymentInput.value,
    image: imageBase64,
    imageType: imageType
  };

  // Send data to Google Apps Script
  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(resp => {
    if(resp.status === "success") {
      // Get popup elements
const successPopup = document.getElementById("successPopup");
const closePopup = document.getElementById("closePopup");

// Inside fetch .then(resp => ...)
if(resp.status === "success") {
  successPopup.style.display = "block";  // Show popup
  form.reset();
  // Reset date fields
  dateInput.value = today;
  cqInput.value = today;
} else {
  alert("❌ Submission error: " + resp.message);
  console.error(resp);
}

// Close popup when user clicks X
closePopup.onclick = function() {
  successPopup.style.display = "none";
}

// Optional: Close popup when clicking outside
window.onclick = function(event) {
  if(event.target == successPopup){
    successPopup.style.display = "none";
  }
}
	const submitBtn = form.querySelector(".submit-btn");
	  submitBtn.disabled = false;
	  submitBtn.style.opacity = 1; // optional visual feedback
      form.reset();
      // Reset date fields to today
      dateInput.value = today;
      cqInput.value = today;
    } else {
      alert("❌ Submission error: " + resp.message);
      console.error(resp);
    }
  })
  .catch(err => {
    alert("❌ Error submitting data. See console for details.");
    console.error(err);
  });

});
