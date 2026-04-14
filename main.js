const year = document.getElementById("year");
const month = document.getElementById("month");
const searchBox = document.getElementById("searchBox");
const search = document.getElementById("search");
const result = document.getElementById("result");

let certificates = [];

// 🔥 সব year data load (auto)
window.onload = loadAllData;

function loadAllData() {
    Promise.all([
        fetch("2024.json").then(res => res.json()),
        fetch("2025.json").then(res => res.json()),
        fetch("2026.json").then(res => res.json())
    ])
    .then(data => {
        // সব data merge
        certificates = data.flat();
        console.log("All Data Loaded:", certificates);
    })
    .catch(() => {
        result.innerHTML = "<p style='color:red'>Data load error</p>";
    });
}

// 🔹 Month select → show search
month.addEventListener("change", () => {
    if (month.value) {
        searchBox.style.display = "block";
        result.innerHTML = "";
    } else {
        searchBox.style.display = "none";
        result.innerHTML = "";
    }
});

// 🔍 All year search
search.addEventListener("input", () => {
    let value = search.value.toLowerCase().trim();

    if (value === "") {
        result.innerHTML = "";
        return;
    }

    let filtered = certificates.filter(c =>
        // Month filter (optional)
        (month.value === "" || c.month === month.value) &&
        
        // Name / Certificate match
        (
            c.name.toLowerCase().startsWith(value) ||
            c.certNo.toLowerCase().startsWith(value)
        )
    );

    display(filtered);
});

// 🔹 Display
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
            <b>Caste:</b> ${c.caste}<br>
            <b>Year:</b> ${c.year}
        </div>
        `;
    });
}
