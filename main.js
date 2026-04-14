const year = document.getElementById("year");
const month = document.getElementById("month");
const searchBox = document.getElementById("searchBox");
const search = document.getElementById("search");
const result = document.getElementById("result");

let certificates = [];

// Year change → load data
year.addEventListener("change", loadData);

// Month change → show search box only
month.addEventListener("change", () => {
    if (month.value) {
        searchBox.style.display = "block";
    } else {
        searchBox.style.display = "none";
        result.innerHTML = "";
    }
});

// Load JSON
function loadData() {
    if (!year.value) return;

    fetch(`${year.value}.json`)
    .then(res => res.json())
    .then(data => {
        certificates = data;
        result.innerHTML = ""; // reset
        search.value = "";
    })
    .catch(() => {
        result.innerHTML = "<p class='noData'>Data load error</p>";
    });
}

// 🔍 Live search
search.addEventListener("input", () => {
search.addEventListener("input", () => {
    let value = search.value.toLowerCase().trim();

    // ❌ empty হলে কিছুই দেখাবে না
    if (value === "") {
        result.innerHTML = "";
        return;
    }

    let filtered = certificates.filter(c =>
        c.month === month.value &&
        (
            c.name.toLowerCase().startsWith(value) ||
            c.certNo.toLowerCase().startsWith(value)
        )
    );

    display(filtered);
});
// Show result
function display(data) {
    result.innerHTML = "";

    if (data.length === 0) {
        result.innerHTML = "<p class='noData'>No Certificate Found</p>";
        return;
    }

    data.forEach(c => {
        result.innerHTML += `
        <div class="card">
            <b>Name:</b> ${c.name}<br>
            <b>Certificate No:</b> ${c.certNo}<br>
            <b>Caste:</b> ${c.caste}
        </div>
        `;
    });
}
