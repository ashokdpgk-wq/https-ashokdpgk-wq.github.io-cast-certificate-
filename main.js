const year = document.getElementById("year");
const month = document.getElementById("month");
const searchBox = document.getElementById("searchBox");
const search = document.getElementById("search");
const result = document.getElementById("result");

let certificates = [];

// Load JSON from ROOT (🔥 changed here)
year.addEventListener("change", loadData);
month.addEventListener("change", filterData);

function loadData() {
    if (!year.value) return;

    fetch(`${year.value}.json`)   // 🔥 এখানে change
    .then(res => res.json())
    .then(data => {
        certificates = data;
        filterData();
    })
    .catch(() => {
        result.innerHTML = "<p style='color:red'>Data load error</p>";
    });
}

function filterData() {
    if (!month.value) {
        result.innerHTML = "";
        searchBox.style.display = "none";
        return;
    }

    searchBox.style.display = "block";

    let filtered = certificates.filter(c =>
        c.month === month.value
    );

    display(filtered);
}

// Live search
search.addEventListener("input", () => {
    let value = search.value.toLowerCase();

    let filtered = certificates.filter(c =>
        c.month === month.value &&
        (c.name.toLowerCase().includes(value) ||
         c.certNo.toLowerCase().includes(value))
    );

    display(filtered);
});

// Display
function display(data) {
    result.innerHTML = "";

    if (data.length === 0) {
        result.innerHTML = "<p style='color:red'>No Certificate Found</p>";
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
