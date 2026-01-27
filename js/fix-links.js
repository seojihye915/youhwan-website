// js/fix-links.js
(() => {
  // 로컬 개발 환경에서는 실행하지 않음 (Live Server 포함)
  const host = location.hostname;
  const isLocal =
    host === "127.0.0.1" ||
    host === "localhost" ||
    host === "0.0.0.0" ||
    host.endsWith(".local");

  if (isLocal) return;

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href") || "";

      // 제외할 케이스
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        /^https?:\/\//i.test(href)
      ) {
        return;
      }

      // ".html"로 끝나면 제거
      if (href.endsWith(".html")) {
        a.setAttribute("href", href.replace(/\.html$/, ""));
      }
    });
  });
})();
