const scriptURL = "https://script.google.com/macros/s/AKfycbxGMoefx5yf_gZ5CW49_uSF-WUHtvY2505ONQDI9kp3OvinqCKT--hPvjnQuA3BQwwj/exec";

const container = document.getElementById("recordsContainer");

// ===============================
// FORMAT RECORD FOR COPY
// ===============================
function formatRecordForCopy(row) {
  // Convert DD-MM-YYYY → DD/MM/YYYY
  const formattedDate = row.date.replaceAll("-", "/");

  let text = "";
  text += formattedDate + "\n";
  text += row.action + "\n";
  text += row.company + "\n";
  text += `${row.product} ${row.weight} @${row.price}\n`;
  text += `Pay: ${row.cqDate}\n`;
  text += `B: ${row.broker}\n`;

  if (row.otherDetails && row.otherDetails.trim() !== "") {
    text += row.otherDetails;
  }

  return text;
}

// ===============================
// FETCH RECORDS
// ===============================
fetch(scriptURL)
  .then(res => res.json())
  .then(data => {

    container.innerHTML = "";

    if (!data || data.length === 0) {
      container.innerHTML = "<p>No records found.</p>";
      return;
    }

    const reversedData = data.reverse();

    reversedData.forEach(row => {

      const card = document.createElement("div");
      card.className = "record-card";

      // Image icon
      const imageIcon = row.mamoLink
        ? `<span class="image-icon" data-img="${row.mamoLink}" title="View Image">📷</span>`
        : "";

      // Copy ID icon
      const copyIdIcon = `<span class="copy-id-icon" data-id="${row.id}" title="Copy ID">🆔</span>`;

      // Copy Record icon
      const copyRecordIcon = `<span class="copy-record-icon" title="Copy Record">📋</span>`;

      card.innerHTML = `
        <div class="record-header">
          <span>📅 ${row.date}</span>
          <span>
            <span class="badge ${row.action === "BUY" ? "buy" : "sell"}">${row.action}</span>
            ${imageIcon}
            ${copyIdIcon}
            ${copyRecordIcon}
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

    // ===============================
    // IMAGE CLICK
    // ===============================
    document.querySelectorAll(".image-icon").forEach(icon => {
      icon.addEventListener("click", () => {
        window.open(icon.dataset.img, "_blank");
      });
    });

    // ===============================
    // COPY ID CLICK
    // ===============================
    document.querySelectorAll(".copy-id-icon").forEach(icon => {
      icon.addEventListener("click", () => {
        const id = icon.dataset.id;
        navigator.clipboard.writeText(id).then(() => {
          alert("Copied ID: " + id);
        });
      });
    });

    // ===============================
    // COPY RECORD CLICK
    // ===============================
    document.querySelectorAll(".copy-record-icon").forEach((icon, index) => {
      icon.addEventListener("click", () => {
        const row = reversedData[index];
        const text = formatRecordForCopy(row);

        navigator.clipboard.writeText(text).then(() => {
          icon.innerText = "✅";
          setTimeout(() => icon.innerText = "📋", 800);
        });
      });
    });

  })
  .catch(err => {
    console.error(err);
    container.innerHTML = "<p>Error loading data</p>";
  });
