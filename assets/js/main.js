const btn = document.querySelector(".menu-btn");
const links = document.querySelector(".nav-links");

if (btn && links) {
  btn.addEventListener("click", () => {
    links.style.display = links.style.display === "flex" ? "none" : "flex";
    if (links.style.display === "flex") {
      links.style.position = "absolute";
      links.style.top = "3.6rem";
      links.style.right = ".75rem";
      links.style.flexDirection = "column";
      links.style.background = "#fff";
      links.style.padding = ".5rem";
      links.style.border = "1px solid #e4e4e7";
      links.style.borderRadius = ".6rem";
    }
  });
}
