// KaTeX render + horizontal carousel center detection
document$.subscribe(() => {
  if (typeof renderMathInElement === "function") {
    renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true }
      ],
      throwOnError: false
    });
  }

  document.querySelectorAll("[data-hcarousel]").forEach(root => {
    const track = root.querySelector(".hcarousel__track");
    const cards = [...root.querySelectorAll(".hcard")];
    if (!track || !cards.length) return;

    const update = () => {
      const center = track.scrollLeft + track.clientWidth / 2;
      let best = null, bestDist = Infinity;
      cards.forEach(c => {
        const mid = c.offsetLeft + c.offsetWidth / 2;
        const d = Math.abs(mid - center);
        if (d < bestDist) { bestDist = d; best = c; }
      });
      cards.forEach(c => c.classList.toggle("is-active", c === best));
    };

    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    // initial: scroll to first card center
    requestAnimationFrame(() => {
      cards[0].scrollIntoView({ inline: "center", block: "nearest" });
      update();
    });
  });
});
