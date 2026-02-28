const btn = document.querySelector(".menu-btn");
const links = document.querySelector(".nav-links");

if (btn && links) {
  const closeMenu = () => {
    links.style.display = "none";
    btn.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    links.style.display = "flex";
    links.style.position = "absolute";
    links.style.top = "3.6rem";
    links.style.right = ".75rem";
    links.style.flexDirection = "column";
    links.style.background = "#fff";
    links.style.padding = ".5rem";
    links.style.border = "1px solid #e4e4e7";
    links.style.borderRadius = ".6rem";
    btn.setAttribute("aria-expanded", "true");
  };

  btn.addEventListener("click", () => {
    const isOpen = links.style.display === "flex";
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (window.innerWidth >= 768) return;
    if (event.target === btn || btn.contains(event.target)) return;
    if (links.contains(event.target)) return;
    closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      links.style.display = "";
      links.style.position = "";
      links.style.top = "";
      links.style.right = "";
      links.style.flexDirection = "";
      links.style.background = "";
      links.style.padding = "";
      links.style.border = "";
      links.style.borderRadius = "";
      btn.setAttribute("aria-expanded", "false");
    }
  });
}
