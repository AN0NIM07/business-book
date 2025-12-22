const scriptURL = "https://script.google.com/macros/s/AKfycbze3eRW5j3DByeBGz2cy8sHZjPGE1ncSp3vslZADXKbeIqmakXbDIpNrRhXkdE46RAE/exec";

document.getElementById("date").valueAsDate = new Date();

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
    date: formatDate(date.value),
    action: action.value,
    company: company.value,
    productType: productType.value,
    product: product.value,
    weight: weight.value,
    price: price.value,
    cqDate: formatDate(cqDate.value),
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
    alert("Data submitted successfully!");
    document.getElementById("entryForm").reset();
  })
  .catch(err => alert("Error submitting data"));
});

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
