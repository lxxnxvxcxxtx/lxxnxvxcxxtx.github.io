const menuButton = document.querySelector(".menu-button");
const siteNavigation = document.querySelector(".site-nav");

if (menuButton && siteNavigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = siteNavigation.classList.toggle("is-open");

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "Close" : "Menu";
  });

  siteNavigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNavigation.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "Menu";
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      siteNavigation.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "Menu";
    }
  });
}

const logo = document.getElementById("site-logo");

if (logo) {
    logo.addEventListener("mouseenter", () => {
        logo.classList.remove("logo-blue", "logo-red");

        const randomColor =
            Math.random() < 0.5
                ? "logo-blue"
                : "logo-red";

        logo.classList.add(randomColor);
    });

    logo.addEventListener("mouseleave", () => {
        logo.classList.remove("logo-blue", "logo-red");
    });
}

document.addEventListener("mousedown", () => {
    const color =
        Math.random() < 0.5
            ? "var(--blue)"
            : "var(--rust)";

    document.documentElement.style.setProperty(
        "--selection-color",
        color
    );
});