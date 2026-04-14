const month = document.getElementById("month");
const searchBox = document.getElementById("searchBox");
const search = document.getElementById("search");
const result = document.getElementById("result");

let certificates = [];

// 🔥 Page load → সব data load + search box show
window.onload = () => {
    searchBox.style.display = "block"; // 🔥 সব সময় visible

    Promise.all([
        fetch("2024.json").then(res => res.json()),
        fetch("2025.json").then(res => res.json()),
        fetch("2026.json").then(res => res.json())
    ])
    .then(data => {
        certificates = data.flat();
    })
    .catch(() => {
        result.innerHTML = "<p style='color:red'>Data load error</p>";
    });
};

// 🔍 Search (All Year + Optional Month)
search.addEventListener("input", () => {
    let value = search.value.toLowerCase().trim();

    if (value === "") {
        result.innerHTML = "";
        return;
    }

    let filtered = certificates.filter(c =>
        // Month optional
        (month.value === "" || c.month === month.value) &&
        
        // Search match
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
            <b>Month:</b> ${c.month}<br>
            <b>Year:</b> ${c.year}
        </div>
        `;
    });
}
