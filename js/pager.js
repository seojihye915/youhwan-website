// /js/pager.js — Installation 전용 (최적화)
(() => {
  // ====== 설정 ======
  const DETAIL_BASE = "/installation-pages/"; // 상세 HTML 폴더
  const JSON_URL = "/data/installation.json"; // 목록 JSON (정적 파일)
  const LIST_PAGE = "/installation.html"; // 목록(뒤로가기) 대상

  // ====== 유틸 ======
  const join = (base, p) =>
    base.replace(/\/+$/, "") + "/" + (p || "").replace(/^\/+/, "");

  const toAbs = (p) =>
    !p ? "" : p.startsWith("/") ? p : "/" + p.replace(/^\.?\//, "");

  const basename = (path) => (path || "").split("/").pop();
  const curBasename = () => basename(window.location.pathname) || "index.html";

  // ====== JSON 로드(메모이즈 + 캐시 허용) ======
  let _listPromise = null;
  async function loadList() {
    if (_listPromise) return _listPromise;
    _listPromise = (async () => {
      // 정적 JSON은 기본 캐시 전략(ETag/Last-Modified)로 충분
      const res = await fetch(JSON_URL);
      const raw = await res.json();

      // 데이터 정규화: file은 basename, thumb는 절대경로
      return raw.map((it) => ({
        fileBase: basename(it.file),
        thumb: toAbs(it.thumb),
        title: it.title,
        year: it.year,
        // 선택: JSON에 w/h 키가 있으면 그대로 사용 (없으면 undefined)
        w: it.w,
        h: it.h,
      }));
    })();
    return _listPromise;
  }

  // ====== 상세 페이지 Pager ======
  async function setupPager() {
    const pager = document.querySelector(".pager");
    if (!pager) return;

    let list;
    try {
      list = await loadList();
    } catch (e) {
      console.warn("installation.json 로드 실패:", e);
      return;
    }

    const order = list.map((it) => it.fileBase);
    const cur = curBasename();
    const i = order.indexOf(cur);

    const $prev = pager.querySelector(".prev");
    const $next = pager.querySelector(".next");
    const $back = pager.querySelector(".back");

    if ($back) $back.href = LIST_PAGE;

    if ($prev) {
      if (i > 0) {
        $prev.href = join(DETAIL_BASE, order[i - 1]);
        $prev.style.visibility = "visible";
      } else {
        $prev.style.visibility = "hidden";
      }
    }

    if ($next) {
      if (i > -1 && i < order.length - 1) {
        $next.href = join(DETAIL_BASE, order[i + 1]);
        $next.style.visibility = "visible";
      } else {
        $next.style.visibility = "hidden";
      }
    }
  }

  // ====== 목록 페이지 갤러리 ======
  async function buildGalleryIfNeeded() {
    const gallery = document.getElementById("gallery");
    if (!gallery) return;

    let list;
    try {
      list = await loadList();
    } catch (e) {
      console.warn("installation.json 로드 실패:", e);
      return;
    }

    // 한 번에 렌더(리플로우/리페인트 최소화)
    const html = list
      .map((item) => {
        // JSON에 w/h가 있으면 width/height 속성 추가 (없으면 생략)
        const size =
          item.w && item.h ? ` width="${item.w}" height="${item.h}"` : "";

        return `
          <a class="project" href="${join(DETAIL_BASE, item.fileBase)}">
            <img class="thumb"
            src="${item.thumb}"
            alt="${item.title || ""}"
            loading="lazy"
            decoding="async"${size} />
            <div class="caption">
              <span class="title">${item.title || ""}</span>
              <span class="year">${item.year ?? ""}</span>
            </div>
          </a>
        `;
      })
      .join("");

    gallery.innerHTML = html;
  }

  // ====== 실행 ======
  document.addEventListener("DOMContentLoaded", () => {
    setupPager();
    buildGalleryIfNeeded();
  });
})();
