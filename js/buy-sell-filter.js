const scriptURL = "https://script.google.com/macros/s/AKfycbxGMoefx5yf_gZ5CW49_uSF-WUHtvY2505ONQDI9kp3OvinqCKT--hPvjnQuA3BQwwj/exec";

const container = document.getElementById("recordsContainer");
const cqDateFilter = document.getElementById("cqDateFilter");
const applyFilterBtn = document.getElementById("applyFilterBtn");
const copyAllBtn = document.getElementById("copyAllBtn");

let allData = [];

// Fetch all records
fetch(scriptURL)
  .then(res => res.json())
  .then(data => {
    allData = data.reverse();
    displayRecords(allData);
  })
  .catch(err => {
    console.error(err);
    container.innerHTML = "<p>Error loading data</p>";
  });

// Display records grouped by CQ-Date and Product
function displayRecords(data) {
  container.innerHTML = "";

  if (!data || data.length === 0) {
    container.innerHTML = "<p>No records found.</p>";
    return;
  }

  // Group by CQ-Date + Product
  const grouped = {};
  data.forEach(row => {
    const key = `${row.cqDate} - ${row.productType} ${row.product}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(row);
  });

  Object.keys(grouped).forEach(groupKey => {
    const groupRows = grouped[groupKey];

    // Group Header
    const groupHeader = document.createElement("div");
    groupHeader.className = "group-header";
    groupHeader.innerText = groupKey;
    container.appendChild(groupHeader);

    ["BUY", "SELL"].forEach(action => {
      const actionData = groupRows.filter(r => r.action === action);
      if (actionData.length === 0) return;

      const actionHeader = document.createElement("div");
      actionHeader.className = `record-action-header ${action.toLowerCase()}`;
      actionHeader.innerText = action;
      container.appendChild(actionHeader);

      actionData.forEach(row => {
        const card = document.createElement("div");
        card.className = "record-row";

        card.innerHTML = `
          <span>${row.company}</span>
          <span>${row.weight}</span>
          <span>${row.price}</span>
          <span>B: ${row.broker}</span>
          <span>${row.payment}</span>
        `;

        container.appendChild(card);
      });
    });
  });
}

// Filter Button
applyFilterBtn.addEventListener("click", () => {
  const filterDate = cqDateFilter.value; // YYYY-MM-DD
  if (!filterDate) return displayRecords(allData);

  const [year, month, day] = filterDate.split("-");
  const filterStr = `${day}-${month}-${year}`; // DD-MM-YYYY string

  const filtered = allData.filter(r => r.cqDate === filterStr);

  if(filtered.length === 0) {
    container.innerHTML = "<p>No records found for this CQ-Date.</p>";
    return;
  }

  displayRecords(filtered);
});

// Copy All Button - one line per record
copyAllBtn.addEventListener("click", () => {
  let text = "";
  const containerChildren = container.children;

  for (let i = 0; i < containerChildren.length; i++) {
    const el = containerChildren[i];

    if(el.classList.contains("group-header") || el.classList.contains("record-action-header")) {
      text += el.innerText + "\n";
    } 
    else if(el.classList.contains("record-row")) {
      const spans = Array.from(el.querySelectorAll("span"));
      const line = spans.map(s => s.innerText).join(" "); // join all fields with space
      text += line + "\n";
    }
  }

  navigator.clipboard.writeText(text).then(() => {
    alert("All filtered data copied!");
  });
});
