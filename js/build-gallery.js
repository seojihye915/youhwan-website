(async function () {
  const res = await fetch("/data/installation.json", { cache: "no-store" });
  const list = await res.json();
  const wrap = document.getElementById("gallery");

  wrap.innerHTML = list
    .map(
      (item) => `
    <a class="project" href="installation/${item.file}">
      <img src="${item.thumb}" alt="${item.title}" loading="lazy" />
      <div class="caption">
        <span class="title">${item.title}</span>
        <span class="year">${item.year}</span>
      </div>
    </a>
  `
    )
    .join("");
})();
