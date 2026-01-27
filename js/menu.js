function initMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const menuOverlay = document.getElementById("menuOverlay");
  const closeMenu = document.getElementById("closeMenu");

  if (menuToggle && menuOverlay && closeMenu) {
    menuToggle.addEventListener("click", () => {
      menuOverlay.classList.add("open");
      document.body.classList.add("no-scroll");
    });
    closeMenu.addEventListener("click", () => {
      menuOverlay.classList.remove("open");
      document.body.classList.remove("no-scroll");
    });
  }
}

// 페이지 전환 (부드러운 페이드)
document.addEventListener("click", (e) => {
  const link = e.target.closest("a");
  if (!link) return;

  const isNavLink = link.matches(
    ".navbar-brand, .menu a, .overlay-menu-list a"
  );
  if (!isNavLink) return;

  const href = link.getAttribute("href");
  if (
    !href ||
    href.startsWith("#") ||
    link.target === "_blank" ||
    e.metaKey ||
    e.ctrlKey
  )
    return;

  e.preventDefault();
  document.body.classList.add("fade-out");
  setTimeout(() => {
    window.location.href = href;
  }, 500);
});

document.addEventListener("DOMContentLoaded", initMenu);
