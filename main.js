const year = document.getElementById("year");
const month = document.getElementById("month");
const search = document.getElementById("search");
const result = document.getElementById("result");

let certificates = [];

// 🔥 Year select → load JS file
year.addEventListener("change", () => {
    if (!year.value) return;

    loadYearFile(year.value);
});

// 🔹 Load JS dynamically
function loadYearFile(y) {
    // আগের script remove
    let old = document.getElementById("dataScript");
    if (old) old.remove();

    // নতুন script create
    let script = document.createElement("script");
    script.src = `data/${y}.js`;
    script.id = "dataScript";

    script.onload = () => {
        certificates = window.yearData || [];
        console.log("Loaded:", certificates);
        result.innerHTML = "";
        search.value = "";
    };

    document.body.appendChild(script);
}

// 🔍 Search
function runSearch() {
    let value = search.value.toLowerCase().trim();

    if (value === "") {
        result.innerHTML = "";
        return;
    }

    let filtered = certificates.filter(c =>
        (month.value === "" || c.month === month.value) &&
        c.name.toLowerCase().startsWith(value)
    );

    display(filtered);
}

// Events
search.addEventListener("input", runSearch);
month.addEventListener("change", runSearch);

// Display
function display(data) {
    result.innerHTML = "";

    if (data.length === 0) {
        result.innerHTML = "<p>No Record Found</p>";
        return;
    }

    data.forEach(c => {
        result.innerHTML += `
        <div>
            <b>${c.name}</b><br>
            ${c.certNo}<br>
            ${c.caste}
        </div>`;
    });
}
