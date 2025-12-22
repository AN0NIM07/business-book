// ===============================
// CONFIG
// ===============================
const scriptURL = "https://script.google.com/macros/s/AKfycbze3eRW5j3DByeBGz2cy8sHZjPGE1ncSp3vslZADXKbeIqmakXbDIpNrRhXkdE46RAE/exec";

// ===============================
// DATE HANDLING (DD/MM/YYYY)
// ===============================
const dateInput = document.getElementById("date");
const cqInput = document.getElementById("cqDate");
const hiddenPicker = document.getElementById("hiddenDatePicker");

let activeInput = null;

// Auto-fill today's date
setToday(dateInput);

// Open calendar on click
dateInput.addEventListener("click", () => openPicker(dateInput));
cqInput.addEventListener("click", () => openPicker(cqInput));

function openPicker(input) {
  activeInput = input;
  hiddenPicker.value = ""; // reset
  hiddenPicker.click();
}

hiddenPicker.addEventListener("change", function () {
  if (!activeInput || !this.value) return;

  const d = new Date(this.value);
  activeInput.value = formatDDMMYYYY(d);
});

function setToday(input) {
  const d = new Date();
  input.value = formatDDMMYYYY(d);
}

function formatDDMMYYYY(d) {
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

// ===============================
// FORM SUBMISSION
// ===============================
document.getElementById("entryForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const fileInput = document.getElementById("photo");
  let imageBase64 = "";
  let imageType = "";

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    imageType = file.type;
    imageBase64 = await toBase64(file);
  }

  const payload = {
    date: dateInput.value,
    action: action.value,
    company: company.value,
    productType: productType.value,
    product: product.value,
    weight: weight.value,
    price: price.value,
    cqDate: cqInput.value,
    broker: broker.value,
    brokeri: brokeri.value,
    otherDetails: details.value,
    image: imageBase64,
    imageType: imageType
  };

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(resp => {
    alert("✅ Data submitted successfully!");
    document.getElementById("entryForm").reset();
    setToday(dateInput);
  })
  .catch(err => {
    alert("❌ Error submitting data");
    console.error(err);
  });
});

// ============================


