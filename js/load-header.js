// /js/load-header.js
(() => {
  const HEADER_URL = document.currentScript?.dataset.path || "/header.html"; // 필요시 './header.html'로

  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const res = await fetch(HEADER_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);

      const html = await res.text();

      // 1) 임시 컨테이너로 파싱
      const tmp = document.createElement("div");
      tmp.innerHTML = html.trim();

      // 2) 헤더 마크업을 먼저 body 맨 앞에 삽입
      const frag = document.createDocumentFragment();
      while (tmp.firstChild) frag.appendChild(tmp.firstChild);
      document.body.insertBefore(frag, document.body.firstChild);

      // 3) (선택) header.html 안의 <script> 실행되도록 재주입
      //    헤더에 스크립트가 없다면 이 블록은 삭제해도 됨
      document.querySelectorAll("header script").forEach((old) => {
        const s = document.createElement("script");
        [...old.attributes].forEach((attr) =>
          s.setAttribute(attr.name, attr.value)
        );
        s.text = old.textContent || "";
        old.replaceWith(s); // 실행
      });

      // 4) 내부 링크를 루트 기준으로 정리
      document.querySelectorAll("header a[href]").forEach((a) => {
        const href = a.getAttribute("href") || "";
        if (
          !href ||
          href.startsWith("#") ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:")
        )
          return;
        if (/^https?:\/\//i.test(href)) return; // 외부 링크는 건드리지 않음
        if (!href.startsWith("/"))
          a.setAttribute("href", "/" + href.replace(/^\.?\//, ""));
      });

      // 5) 메뉴 init 훅 (있을 때만)
      if (typeof window.initMenu === "function") window.initMenu();
    } catch (e) {
      console.error("header.html 로드 실패:", e);
    }
  });
})();
