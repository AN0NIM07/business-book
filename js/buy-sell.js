// ===============================
// CONFIG
// ===============================
const scriptURL = "https://script.google.com/macros/s/AKfycbxGMoefx5yf_gZ5CW49_uSF-WUHtvY2505ONQDI9kp3OvinqCKT--hPvjnQuA3BQwwj/exec";

// ===============================
// ELEMENTS
// ===============================
const form = document.getElementById("entryForm");
const dateInput = document.getElementById("date");
const cqInput = document.getElementById("cqDate");
const fileInput = document.getElementById("photo");

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

const successPopup = document.getElementById("successPopup");
const closePopup = document.getElementById("closePopup");

// ===============================
// AUTO-FILL TODAY DATE
// ===============================
const today = new Date().toISOString().split("T")[0];
dateInput.value = today;
cqInput.value = today;

// ===============================
// HELPERS
// ===============================
function convertToDDMMYYYY(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
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
// FORM SUBMISSION
// ===============================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = form.querySelector(".submit-btn");
  submitBtn.disabled = true;
  submitBtn.style.opacity = 0.6;

  let imageBase64 = "";
  let imageType = "";

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    imageType = file.type;
    imageBase64 = await toBase64(file);
  }

  const payload = {
    date: convertToDDMMYYYY(dateInput.value),
    action: actionInput.value,
    company: companyInput.value,
    productType: productTypeInput.value,
    product: productInput.value,
    weight: weightInput.value,
    price: priceInput.value,
    payment: paymentInput.value,
    cqDate: convertToDDMMYYYY(cqInput.value),
    broker: brokerInput.value,
    brokeri: brokeriInput.value,
    otherDetails: detailsInput.value,
    image: imageBase64,
    imageType: imageType
  };

  try {
    const res = await fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    const resp = await res.json();

    if (resp.status !== "success") {
      throw new Error(resp.message);
    }

    // ✅ SUCCESS
    successPopup.style.display = "block";
    form.reset();
    dateInput.value = today;
    cqInput.value = today;

  } catch (err) {
    alert("❌ Submission error. Check console.");
    console.error(err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.style.opacity = 1;
  }
});

// ===============================
// POPUP CLOSE HANDLERS
// ===============================
closePopup.onclick = () => {
  successPopup.style.display = "none";
};

window.onclick = (e) => {
  if (e.target === successPopup) {
    successPopup.style.display = "none";
  }
};
