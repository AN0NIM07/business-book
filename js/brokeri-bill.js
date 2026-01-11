document.addEventListener("DOMContentLoaded", () => {
  const scriptURL = "https://script.google.com/macros/s/AKfycbxT6Yfvahp6bHChS1GoNx9qXi719JWVz38XMEKnW9Cw8vLP5HorA0w4-jYjDaJKBSHcdQ/exec";
  const recordsContainer = document.getElementById("recordsContainer");
  const payBtn = document.getElementById("payBtn");
  const payDateInput = document.getElementById("payDate");

  let allData = [];

  function parseDate(str) {
    if (!str || str === "N/A") return null;
    const parts = str.split("/");
    if (parts.length !== 3) return null;
    const [day, month, year] = parts.map(Number);
    return new Date(year, month - 1, day);
  }

  // Fetch all records
  async function fetchData() {
    try {
      const res = await fetch(scriptURL);
      const data = await res.json();
      allData = data.reverse();
      displayRecords(allData);
    } catch (err) {
      console.error(err);
      recordsContainer.innerHTML = "<p class='no-data'>Error loading data</p>";
    }
  }

  fetchData();

  function displayRecords(data) {
    if (!recordsContainer) return;
    recordsContainer.innerHTML = "";

    if (!data || data.length === 0) {
      recordsContainer.innerHTML = "<p class='no-data'>No records found.</p>";
      return;
    }

    const today = new Date();

    const unpaidClose = data.filter(r => (!r.ACTION || r.ACTION === "N/A") && parseDate(r["CQ-DATE"]) && parseDate(r["CQ-DATE"]) <= today);
    const unpaidFuture = data.filter(r => (!r.ACTION || r.ACTION === "N/A") && parseDate(r["CQ-DATE"]) && parseDate(r["CQ-DATE"]) > today);
    const paid = data.filter(r => r.ACTION === "PAID");

    unpaidClose.sort((a,b) => a.BROKER.localeCompare(b.BROKER));
    unpaidFuture.sort((a,b) => a.BROKER.localeCompare(b.BROKER));
    paid.sort((a,b) => a.BROKER.localeCompare(b.BROKER));

    if (unpaidClose.length) renderGroup("Unpaid (CQ Passed)", unpaidClose, "unpaid");
    if (unpaidFuture.length) renderGroup("Unpaid (Future CQ)", unpaidFuture, "unpaid-future");
    if (paid.length) renderGroup("Paid", paid, "paid");
  }

  function renderGroup(title, rows, type) {
    const groupDiv = document.createElement("div");

    const header = document.createElement("div");
    header.className = "group-header";
    header.innerText = title;
    groupDiv.appendChild(header);

    rows.forEach(row => {
      const card = document.createElement("div");
      card.className = `record-card ${type === "paid" ? "paid-card" : ""}`;
      card.dataset.id = row.ID;

      const infoDiv = document.createElement("div");
      infoDiv.className = "record-info";
      infoDiv.innerHTML = `
        <strong>${row.BROKER}</strong> | CQ: ${row["CQ-DATE"]} | ৳${row.AMOUNT} <br>
        <span class="details">${row.DETAILS}</span>
      `;

      const checkBox = document.createElement("input");
      checkBox.type = "checkbox";
      checkBox.className = "pay-checkbox";
      if (type === "paid") checkBox.disabled = true;

      card.appendChild(infoDiv);
      card.appendChild(checkBox);
      groupDiv.appendChild(card);
    });

    recordsContainer.appendChild(groupDiv);
  }

  // PAY button
  if (payBtn) {
    payBtn.addEventListener("click", async () => {
      const checkboxes = document.querySelectorAll(".pay-checkbox:checked");
      if (!checkboxes.length) return alert("Select at least one brokeri to mark as PAID.");

      const payDate = payDateInput.value;
      if (!payDate) return alert("Select a Pay Date.");

      const [yyyy, mm, dd] = payDate.split("-");
      const formattedDate = `${dd}/${mm}/${yyyy}`;

      const ids = Array.from(checkboxes).map(cb => cb.parentElement.dataset.id);

      // Disable button during update
      payBtn.disabled = true;
      payBtn.innerText = "Updating...";

      try {
        const res = await fetch(scriptURL, {
          method: "POST",
          body: JSON.stringify({
            action: "markPaid",
            ids,
            payDate: formattedDate
          })
        });
        const result = await res.json();
        if (result.status === "success") {
          alert("✅ Selected brokeri marked as PAID.");
          fetchData();
        } else {
          alert("Failed to update brokeri");
        }
      } catch (err) {
        console.error(err);
        alert("Error updating brokeri: " + err.message);
      } finally {
        payBtn.disabled = false;
        payBtn.innerText = "Mark Selected as PAID";
      }
    });
  }
});
