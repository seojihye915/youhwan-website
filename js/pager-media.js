(() => {
  const DETAIL_BASE = "/media-facade-pages/";
  const JSON_URL = "/data/media-facade.json";

  const join = (base, p) =>
    base.replace(/\/+$/, "") + "/" + (p || "").replace(/^\/+/, ""); // ★ 중복 슬래시 정리

  function getBasename() {
    const name = window.location.pathname.split("/").pop();
    return name || "index.html";
  }

  async function setupPager() {
    const pager = document.querySelector(".pager");
    if (!pager) return;

    let list = [];
    try {
      const res = await fetch(JSON_URL, { cache: "no-store" });
      list = await res.json();
    } catch (e) {
      console.warn("media-facade.json 불러오기 실패:", e);
      return;
    }

    // ★ order는 항상 basename으로 비교
    const order = list.map((it) => (it.file || "").split("/").pop());
    const file = getBasename();
    const i = order.indexOf(file);

    const $prev = pager.querySelector(".prev");
    const $next = pager.querySelector(".next");
    const $back = pager.querySelector(".back");
    if ($back) $back.href = "/media-facade.html";

    if ($prev) {
      if (i > 0) {
        $prev.href = join(DETAIL_BASE, order[i - 1]); // ★ join 사용
        $prev.style.visibility = "visible";
      } else {
        $prev.style.visibility = "hidden";
      }
    }
    if ($next) {
      if (i > -1 && i < order.length - 1) {
        $next.href = join(DETAIL_BASE, order[i + 1]); // ★ join 사용
        $next.style.visibility = "visible";
      } else {
        $next.style.visibility = "hidden";
      }
    }
  }

  async function buildGalleryIfNeeded() {
    const gallery = document.getElementById("gallery");
    if (!gallery) return;

    let list = [];
    try {
      const res = await fetch(JSON_URL, { cache: "no-store" });
      list = await res.json();
    } catch (e) {
      console.warn("media-facade.json 불러오기 실패:", e);
      return;
    }

    gallery.innerHTML = "";
    list.forEach((item) => {
      const a = document.createElement("a");
      a.className = "project";

      // ★ item.file이 "/media-facade-pages/xxx.html"이든 "xxx.html"이든 모두 처리
      const basename = (item.file || "").split("/").pop();
      a.href = join(DETAIL_BASE, basename);

      a.innerHTML = `
        <img src="${
          item.thumb.startsWith("/") ? item.thumb : "/" + item.thumb
        }" alt="${item.title}" loading="lazy" decoding="async"/>
        <div class="caption"><span class="title">${
          item.title
        }</span><span class="year">${item.year}</span></div>
      `;
      gallery.appendChild(a);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupPager();
    buildGalleryIfNeeded();
  });
})();
