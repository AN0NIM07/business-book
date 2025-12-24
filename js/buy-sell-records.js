const scriptURL = "https://script.google.com/macros/s/AKfycbxGMoefx5yf_gZ5CW49_uSF-WUHtvY2505ONQDI9kp3OvinqCKT--hPvjnQuA3BQwwj/exec";

const container = document.getElementById("recordsContainer");
const imagePopup = document.getElementById("imagePopup");
const popupImage = document.getElementById("popupImage");
const closePopup = document.getElementById("closeImagePopup");

fetch(scriptURL)
  .then(res => res.json())
  .then(data => {

    container.innerHTML = "";

    if (!data || data.length === 0) {
      container.innerHTML = "<p>No records found.</p>";
      return;
    }

    data.reverse().forEach(row => {

      const card = document.createElement("div");
      card.className = "record-card";

      const imageIcon = row.mamoLink
        ? `<span class="image-icon" data-img="${row.mamoLink}">📷</span>`
        : "";

      card.innerHTML = `
        <div class="record-header">
          <span>📅 ${row.date}</span>
          <span>
            <span class="badge ${row.action === "BUY" ? "buy" : "sell"}">
              ${row.action}
            </span>
            ${imageIcon}
          </span>
        </div>

        <div class="record-row"><b>Company:</b> ${row.company}</div>
        <div class="record-row"><b>Product:</b> ${row.productType} – ${row.product}</div>
        <div class="record-row"><b>Weight:</b> ${row.weight}</div>
        <div class="record-row"><b>Price:</b> ${row.price}</div>
        <div class="record-row"><b>CQ Date:</b> ${row.cqDate}</div>
        <div class="record-row"><b>Broker:</b> ${row.broker}</div>
        <div class="record-row"><b>Other Details:</b> ${row.otherDetails || ""}</div>
        <div class="record-row"><b>Payment:</b> ${row.payment}</div>
      `;

      container.appendChild(card);
    });

    // Image click
    document.querySelectorAll(".image-icon").forEach(icon => {
      icon.addEventListener("click", () => {
  window.open(icon.dataset.img, "_blank");
});

    });

  })
  .catch(err => {
    console.error(err);
    container.innerHTML = "<p>Error loading data</p>";
  });

// Close popup
closePopup.onclick = () => imagePopup.style.display = "none";
imagePopup.onclick = e => {
  if (e.target === imagePopup) imagePopup.style.display = "none";
};
