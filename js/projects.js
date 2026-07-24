const projectContainer = document.querySelector("[data-project-container]");
const filterButtons = document.querySelectorAll("[data-filter]");
const modal = document.querySelector("[data-modal]");
const modalCloseButton = document.querySelector("[data-modal-close]");
const modalFrame = document.querySelector("[data-modal-frame]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalDescription = document.querySelector("[data-modal-description]");
const modalDetails = document.querySelector("[data-modal-details]");

const validFilters = [
  "all",
  "events",
  "long-form",
  "music",
  "fashion"
];

function formatCategory(category) {
  const names = {
    music: "MUSIC",
    fashion: "FASHION",
    events: "EVENTS",
    "long-form": "LONG FORM"
  };

  return names[category] || category;
}

function createProjectCard(project) {
  const article = document.createElement("article");
  article.className = "project-card";

  article.innerHTML = `
    <button
      class="project-button"
      type="button"
      data-project-id="${project.id}"
      aria-label="View ${project.title}"
    >
      <div class="project-image-wrap">
        <img
          class="project-image"
          src="${project.thumbnail}"
          alt="${project.title}"
          loading="lazy"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';"
        >

        <div class="placeholder-image" style="display:none;">
          Add image: ${project.thumbnail}
        </div>
      </div>

      <div class="project-meta">
        <div>
          <h2 class="project-title">
            ${project.title}
          </h2>

          <p class="project-category">
            ${formatCategory(project.category)}
          </p>
        </div>

        <p class="project-year">
          ${project.year}
        </p>
      </div>

      <p class="project-description">
        ${project.description}
      </p>

      <p class="project-details">
        ${project.client} / ${project.role}
      </p>
    </button>
  `;

  return article;
}

function renderProjects(filter = "all") {
  if (!projectContainer) {
    return;
  }

  projectContainer.innerHTML = "";

  let visibleProjects = projects;

  if (projectContainer.dataset.featured === "true") {
    visibleProjects = visibleProjects.filter(
      (project) => project.featured
    );
  }

  if (filter !== "all") {
    visibleProjects = visibleProjects.filter(
      (project) =>
        project.category.toLowerCase() === filter.toLowerCase()
    );
  }

  visibleProjects.forEach((project) => {
    projectContainer.appendChild(
      createProjectCard(project)
    );
  });

  if (visibleProjects.length === 0) {
    projectContainer.innerHTML = `
      <p class="empty-projects-message">
        No projects found in this category.
      </p>
    `;
  }
}

function setActiveFilter(selectedFilter) {
  filterButtons.forEach((button) => {
    button.classList.toggle(
      "is-active",
      button.dataset.filter === selectedFilter
    );
  });
}

function updateFilterUrl(selectedFilter) {
  const url = new URL(window.location.href);

  if (selectedFilter === "all") {
    url.searchParams.delete("filter");
  } else {
    url.searchParams.set("filter", selectedFilter);
  }

  window.history.replaceState(
    {},
    "",
    `${url.pathname}${url.search}${url.hash}`
  );
}

function openModal(project) {
  // Instagram projects open on Instagram.
  if (project.instagram) {
    window.open(
      project.instagram,
      "_blank",
      "noopener,noreferrer"
    );

    return;
  }

  if (!modal || !modalFrame) {
    return;
  }

  const isPlaceholder =
    !project.youtubeId ||
    project.youtubeId === "PLACEHOLDER_YOUTUBE_ID";

  modalFrame.classList.toggle(
    "is-vertical",
    project.orientation === "vertical"
  );

  if (isPlaceholder) {
    modalFrame.innerHTML = `
      <div class="placeholder-image">
        Add a YouTube ID or Instagram URL in projects-data.js
      </div>
    `;
  } else {
    modalFrame.innerHTML = `
      <iframe
        src="https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1"
        title="${project.title}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    `;
  }

  if (modalTitle) {
    modalTitle.textContent = project.title;
  }

  if (modalDescription) {
    modalDescription.textContent = project.description;
  }

  if (modalDetails) {
    modalDetails.textContent =
      `${project.client} / ${project.year} / ${project.role}`;
  }

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  modalCloseButton?.focus();
}

function closeModal() {
  if (!modal || !modalFrame) {
    return;
  }

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  modalFrame.innerHTML = "";
}

document.addEventListener("click", (event) => {
  const projectButton = event.target.closest(
    "[data-project-id]"
  );

  if (projectButton) {
    const project = projects.find(
      (item) =>
        item.id === projectButton.dataset.projectId
    );

    if (project) {
      openModal(project);
    }
  }

  if (event.target === modal) {
    closeModal();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;

    setActiveFilter(selectedFilter);
    renderProjects(selectedFilter);
    updateFilterUrl(selectedFilter);
  });
});

modalCloseButton?.addEventListener(
  "click",
  closeModal
);

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    modal?.classList.contains("is-open")
  ) {
    closeModal();
  }
});

const urlParameters = new URLSearchParams(
  window.location.search
);

const requestedFilter =
  urlParameters.get("filter") || "all";

const initialFilter = validFilters.includes(
  requestedFilter.toLowerCase()
)
  ? requestedFilter.toLowerCase()
  : "all";

setActiveFilter(initialFilter);
renderProjects(initialFilter);