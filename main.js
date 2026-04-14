const year = document.getElementById("year");
const month = document.getElementById("month");
const searchBox = document.getElementById("searchBox");
const search = document.getElementById("search");
const result = document.getElementById("result");

let certificates = [];

year.addEventListener("change", loadData);

month.addEventListener("change", () => {
    if (month.value) {
        searchBox.style.display = "block";
    } else {
        searchBox.style.display = "none";
        result.innerHTML = "";
    }
});

function loadData() {
    if (!year.value) return;

    fetch(`${year.value}.json`)
    .then(res => res.json())
    .then(data => {
        certificates = data;
        result.innerHTML = "";
        search.value = "";
    })
    .catch(() => {
        result.innerHTML = "<p style='color:red'>Data load error</p>";
    });
}

search.addEventListener("input", () => {
    let value = search.value.toLowerCase().trim();

    if (value === "") {
        result.innerHTML = "";
        return;
    }

    let filtered = certificates.filter(c =>
        c.month === month.value &&
        c.name.toLowerCase().startsWith(value)
    );

    result.innerHTML = "";

    filtered.forEach(c => {
        result.innerHTML += `
        <div style="background:#fff;padding:10px;margin:10px;border-radius:8px;">
            ${c.name} - ${c.certNo}
        </div>`;
    });
});
