const year = document.getElementById("year");
const month = document.getElementById("month");
const search = document.getElementById("search");
const result = document.getElementById("result");
const countBox = document.getElementById("countBox");

let certificates = [];

/* =========================
   LOAD DATA (ONLY COUNT)
========================= */
function loadData() {

    if (!year.value || !month.value) {
        result.innerHTML = "";
        countBox.innerHTML = "";
        return;
    }

    const monthNames = {
        "01": "January","02": "February","03": "March","04": "April","05": "May",
		"06": "June","07": "July","08": "August","09": "September","10": "October",
		"11": "November","12": "December"
    };

    const fileName = `${year.value}-${monthNames[month.value]}.js`;

    const old = document.getElementById("dataScript");
    if (old) old.remove();

    const script = document.createElement("script");
    script.id = "dataScript";
    script.src = fileName + "?v=" + Date.now();

    script.onload = () => {
        certificates = window.yearData || [];

        // ✅ শুধু total count
        countBox.innerHTML = `Total Customer: ${certificates.length}`;

        // ❌ data show না
        result.innerHTML = "";
    };

    script.onerror = () => {
        result.innerHTML = "<p class='message'>File Not Found</p>";
        countBox.innerHTML = "";
    };

    document.body.appendChild(script);
}

year.addEventListener("change", loadData);
month.addEventListener("change", loadData);

/* =========================
   SEARCH (SHOW DATA)
========================= */
search.addEventListener("input", () => {

    let value = search.value.toLowerCase().trim();

    if (!value) {
        result.innerHTML = "";
        countBox.innerHTML = `Total Customer: ${certificates.length}`;
        return;
    }

    let filtered = certificates.filter(c =>
        (c.name && c.name.toLowerCase().includes(value)) ||
        (c.certNo && c.certNo.toLowerCase().includes(value)) ||
        (c.father && c.father.toLowerCase().includes(value))
    );

    countBox.innerHTML = `Found: ${filtered.length}`;
    display(filtered);
});

/* =========================
   DISPLAY TABLE
========================= */
function display(data) {

    if (!data.length) {
        result.innerHTML = "<p class='message'>No Record Found</p>";
        return;
    }

    let html = `
    <div class="table-container">
    <table>
        <tr>
            <th>Application No</th>
			<th>Application Date</th>
            <th>Name</th>
            <th>Father</th>
            <th>Certificate No</th>
            <th>Issue Date</th>
			<th>applied For</th>
            <th>Address</th>
        </tr>
    `;

    data.forEach(c => {
        html += `
        <tr>
            <td>${c.appNo || "-"}</td>
			<td>${c.applDate || "-"}</td>
            <td>${c.name || "-"}</td>
            <td>${c.father || "-"}</td>
            <td>${c.certNo || "-"}</td>
            <td>${c.issueDate || "-"}</td>
			<td>${c.appliedFor || "-"}</td>
            <td>${c.address || "-"}</td>
        </tr>
        `;
    });

    html += `</table></div>`;
    result.innerHTML = html;
}

function downloadExcel() {

    let data = [];

    let value = search.value.toLowerCase().trim();

    // 🔍 যদি search করা থাকে → filtered data export
    if (value) {
        data = certificates.filter(c =>
            (c.name && c.name.toLowerCase().includes(value)) ||
            (c.certNo && c.certNo.toLowerCase().includes(value)) ||
            (c.father && c.father.toLowerCase().includes(value))
        );
    } else {
        // 📊 না থাকলে সব data export
        data = certificates;
    }

    if (!data.length) {
        alert("No data to download");
        return;
    }

    let csv = "Application No,Name,Father,Certificate No,Issue Date,Status\n";

    data.forEach(c => {
        csv += `${c.appNo || ""},${c.name || ""},${c.father || ""},${c.certNo || ""},${c.issueDate || ""},${c.status || ""}\n`;
    });

    let blob = new Blob([csv], { type: "text/csv" });
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "certificate_data.csv";
    a.click();

    URL.revokeObjectURL(url);
}