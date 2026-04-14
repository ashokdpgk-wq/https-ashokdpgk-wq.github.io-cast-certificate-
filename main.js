const search = document.getElementById("search");
const month = document.getElementById("month");
const result = document.getElementById("result");

let certificates = [];

// 🔥 Load all data
async function loadData() {
    try {
        let res1 = await fetch("2024.json");
        let res2 = await fetch("2025.json");
        let res3 = await fetch("2026.json");

        let d1 = await res1.json();
        let d2 = await res2.json();
        let d3 = await res3.json();

        certificates = [...d1, ...d2, ...d3];
    } catch {
        result.innerHTML = "<p class='noData'>Data load error</p>";
    }
}

loadData();

// 🔍 Search
search.addEventListener("input", () => {
    let value = search.value.toLowerCase().trim();

    if (value === "") {
        result.innerHTML = "";
        return;
    }

    let filtered = certificates.filter(c =>
        (
            month.value === "" ||
            c.month.toLowerCase() === month.value.toLowerCase()
        ) &&
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
        result.innerHTML = "<p class='noData'>No Certificate Found</p>";
        return;
    }

    data.forEach(c => {
        result.innerHTML += `
        <div class="card">
            <b>Name:</b> ${c.name}<br>
            <b>Certificate No:</b> ${c.certNo}<br>
            <b>Caste:</b> ${c.caste}<br>
            <b>Month:</b> ${c.month}<br>
            <b>Year:</b> ${c.year}
        </div>
        `;
    });
}
