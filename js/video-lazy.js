document.addEventListener("click", (e) => {
  const btn = e.target.closest(".video-lazy");
  if (!btn) return;

  const id = btn.dataset.yt; // 예: "Dn2V1-ycM8o"
  const title = btn.dataset.title || "YouTube video";

  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;
  iframe.title = title;
  iframe.loading = "eager";
  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "0";
  btn.replaceWith(iframe);
});
