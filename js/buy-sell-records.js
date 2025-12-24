const scriptURL = "https://script.google.com/macros/s/AKfycbxGMoefx5yf_gZ5CW49_uSF-WUHtvY2505ONQDI9kp3OvinqCKT--hPvjnQuA3BQwwj/exec";

const container = document.getElementById("recordsContainer");

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

      // Image icon
      const imageIcon = row.mamoLink
        ? `<span class="image-icon" data-img="${row.mamoLink}">📷</span>`
        : "";

      // Copy ID icon
      const copyIdIcon = `<span class="copy-id-icon" data-id="${row.id}" title="Copy ID">🆔</span>`;

      card.innerHTML = `
        <div class="record-header">
          <span>📅 ${row.date}</span>
          <span>
            <span class="badge ${row.action === "BUY" ? "buy" : "sell"}">${row.action}</span>
            ${imageIcon}
            ${copyIdIcon}
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

    // Copy ID click
    document.querySelectorAll(".copy-id-icon").forEach(icon => {
      icon.addEventListener("click", () => {
        const id = icon.dataset.id;
        navigator.clipboard.writeText(id).then(() => {
          alert("Copied ID: " + id);
        });
      });
    });

  })
  .catch(err => {
    console.error(err);
    container.innerHTML = "<p>Error loading data</p>";
  });
