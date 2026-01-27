// /js/pager.js
(() => {
  const DETAIL_BASE = "/perform/"; // 상세 페이지들이 있는 폴더 (절대경로 추천)
  const JSON_URL = "/data/perform.json"; // 작품 목록 JSON (절대경로)

  // 유틸: 현재 파일명(basename)
  function getBasename() {
    const path = window.location.pathname;
    const name = path.split("/").pop();
    return name || "index.html";
  }

  // ① Prev/Next 자동 세팅
  async function setupPager() {
    const pager = document.querySelector(".pager");
    if (!pager) return; // 상세 페이지가 아니면 스킵

    let list = [];
    try {
      const res = await fetch(JSON_URL, { cache: "no-store" });
      list = await res.json();
    } catch (e) {
      console.warn("perform.json 불러오기 실패:", e);
      return;
    }

    const order = list.map((it) => it.file);
    const file = getBasename();
    const i = order.indexOf(file);

    const $prev = pager.querySelector(".prev");
    const $next = pager.querySelector(".next");
    const $back = pager.querySelector(".back");

    if ($back) $back.href = "/performance.html"; // 어디서든 동작하게 절대경로

    // 이전
    if ($prev) {
      if (i > 0) {
        $prev.href = DETAIL_BASE + order[i - 1];
        $prev.style.visibility = "visible";
      } else {
        $prev.style.visibility = "hidden";
      }
    }

    // 다음
    if ($next) {
      if (i > -1 && i < order.length - 1) {
        $next.href = DETAIL_BASE + order[i + 1];
        $next.style.visibility = "visible";
      } else {
        $next.style.visibility = "hidden";
      }
    }
  }

  // ② 갤러리 자동 생성 (installation.html에서만 실행)
  async function buildGalleryIfNeeded() {
    const gallery = document.getElementById("gallery"); // 비어있는 컨테이너
    if (!gallery) return;

    let list = [];
    try {
      const res = await fetch(JSON_URL, { cache: "no-store" });
      list = await res.json();
    } catch (e) {
      console.warn("perform.json 불러오기 실패:", e);
      return;
    }

    // 기존 내용 비우고 생성
    gallery.innerHTML = "";
    list.forEach((item) => {
      const a = document.createElement("a");
      a.className = "project";
      a.href = `${DETAIL_BASE}${item.file}`;
      a.innerHTML = `
        <img src="${item.thumb}" alt="${item.title}" loading="lazy" />
        <div class="caption">
          <span class="title">${item.title}</span>
          <span class="year">${item.year}</span>
        </div>
      `;
      gallery.appendChild(a);
    });
  }

  // 실행
  document.addEventListener("DOMContentLoaded", () => {
    setupPager();
    buildGalleryIfNeeded();
  });
})();
