document.addEventListener("DOMContentLoaded", function() {

  const scriptURL = "https://script.google.com/macros/s/AKfycbze3eRW5j3DByeBGz2cy8sHZjPGE1ncSp3vslZADXKbeIqmakXbDIpNrRhXkdE46RAE/exec"; // <-- replace with your GAS Web App URL

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

  // Initial state
  loadingOverlay.style.display = "none";
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;
  cqInput.value = today;

  // Helpers
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

  // Form submit
  form.addEventListener("submit", async function(e){
    e.preventDefault();

    // Show loading
    loadingOverlay.style.display = "flex";
    submitBtn.disabled = true;

    // Handle image
    let imageBase64 = "";
    let imageType = "";
    if(fileInput.files.length > 0){
      const file = fileInput.files[0];
      imageType = file.type;
      try { imageBase64 = await toBase64(file); } catch(err){ console.error(err); }
    }

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

    fetch(scriptURL, { method: "POST", body: JSON.stringify(payload) })
      .then(res => res.json())
      .then(resp => {
        loadingOverlay.style.display = "none";
        submitBtn.disabled = false;

        if(resp.status === "success"){
          successPopup.style.display = "flex";
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
        alert("❌ Error submitting data. See console.");
      });
  });

  // Popup close
  closePopup.onclick = function(){ successPopup.style.display = "none"; };
  window.onclick = function(event){ if(event.target == successPopup) successPopup.style.display = "none"; };

});
