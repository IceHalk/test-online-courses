const data = [
  {
    src: "src/assets/images/person-1.png",
    badge: {
      title: "Marketing",
      type: "marketing",
    },
    title: "The Ultimate Google Ads Training Course",
    price: "$100",
    speaker: "by Jerome Bell",
  },
  {
    src: "src/assets/images/person-2.png",
    badge: {
      title: "Management",
      type: "management",
    },
    title: "Prduct Management Fundamentals",
    price: "$480",
    speaker: "by Marvin McKinne",
  },
  {
    src: "src/assets/images/person-3.png",
    badge: {
      title: "HR & Recruting",
      type: "hr",
    },
    title: "HR Management and Analytics",
    price: "$200",
    speaker: "by Leslie Alexander Li",
  },
  {
    src: "src/assets/images/person-4.png",
    badge: {
      title: "Marketing",
      type: "marketing",
    },
    title: "Brand Management & PR Communications",
    price: "$530",
    speaker: "by Kristin Watson",
  },
  {
    src: "src/assets/images/person-5.png",
    badge: {
      title: "Design",
      type: "design",
    },
    title: "Graphic Design Basic",
    price: "$500",
    speaker: "by Guy Hawkins",
  },
  {
    src: "src/assets/images/person-6.png",
    badge: {
      title: "Management",
      type: "management",
    },
    title: "Business Development Management",
    price: "$400",
    speaker: "by Dianne Russell",
  },
  {
    src: "src/assets/images/person-7.png",
    badge: {
      title: "Development",
      type: "dev",
    },
    title: "Highload Software Architecture",
    price: "$600",
    speaker: "by Brooklyn Simmons",
  },
  {
    src: "src/assets/images/person-8.png",
    badge: {
      title: "HR & Recruting",
      type: "hr",
    },
    title: "Human Resources – Selection and Recruitment",
    price: "$150",
    speaker: "by Kathryn Murphy",
  },
  {
    src: "src/assets/images/person-9.png",
    badge: {
      title: "Design",
      type: "design",
    },
    title: "User Experience. Human-centered Design",
    price: "$240",
    speaker: "by Cody Fisher",
  },
];

const sizeList = 5;

const list = new Array(sizeList).fill(0).reduce((acc) => [...acc, ...data], []);

const state = {
  search: "",
  type: "all",
  limit: 9,
};

/* UTILS */
const getClassByBadge = (type) => {
  switch (type) {
    case "marketing":
      return "card__badge--marketing";
    case "management":
      return "card__badge--management";
    case "hr":
      return "card__badge--hr";
    case "design":
      return "card__badge--design";
    case "dev":
      return "card__badge--dev";
    default:
      return "card__badge--marketing";
  }
};

function getCounts(data) {
  const counts = {};

  data.forEach((item) => {
    const type = item.badge.type;
    counts[type] = (counts[type] || 0) + 1;
  });

  return counts;
}

const searchFilter = (items) =>
  items.filter((item) => item.title.toLowerCase().includes(state.search));
/* UTILS */

/* GET HTML ELEMENTS */
const buttons = document.getElementsByClassName("tab");
const listEl = document.getElementById("list");
const loadMoreBtn = document.getElementById("loadMore");
const searchInput = document.querySelector(".search__input");
/* GET HTML ELEMENTS */

/* UPD DOM */
function updateTabCounts() {
  let filteredBySearch = [...list];

  if (state.search) {
    filteredBySearch = searchFilter(filteredBySearch);
  }

  const counts = getCounts(filteredBySearch);

  Array.from(buttons).forEach((button) => {
    const type = button.dataset.type;

    if (type === "all") {
      // Общее количество
      button.getElementsByClassName("tab__badge")[0].textContent =
        filteredBySearch.length;
    } else {
      button.getElementsByClassName("tab__badge")[0].textContent =
        counts[type] || 0;
    }
  });
}

function renderList(elements) {
  listEl.innerHTML = "";

  elements.forEach((item) => {
    const card = document.createElement("div");
    card.className = "grid__item";

    card.innerHTML = `
    <div class="card">
        <img
            src="${item.src}"
            alt="${item.title}"
            class="card__image"
        />
        <div class="card__content">
            <span class="card__badge ${getClassByBadge(item.badge.type)}">${
      item.badge.title
    }</span>
            <span class="card__title"
            >${item.title}</span
            >
            <h3 class="card__info">
            <span class="card__price">${item.price}</span>
            <span class="card__divider">|</span>
            <span class="card__speaker">${item.speaker}</span>
            </h3>
        </div>
    </div>
    `;

    listEl.appendChild(card);
  });
}
/* UPD DOM */

/* EVENT HANDLER */
Array.from(buttons).forEach((button) => {
  button.addEventListener("click", () => {
    Array.from(buttons).forEach((btn) => btn.classList.remove("tab--active"));

    button.classList.add("tab--active");

    state.type = button.dataset.type;

    state.limit = 9;

    applyFilters();
  });
});

loadMoreBtn.addEventListener("click", () => {
  state.limit += 9;
  applyFilters();
});

searchInput.addEventListener("input", (e) => {
  state.search = e.target.value.toLowerCase();
  state.limit = 9;
  applyFilters();
});

const observer = new IntersectionObserver(
  (entries) => {
    const entry = entries[0];

    if (entry.isIntersecting) {
      state.limit += 9;
      applyFilters();
    }
  },
  {
    root: null,
    rootMargin: "0px 0px -45px 0px",
    threshold: 1,
  }
);

observer.observe(loadMoreBtn);
/* EVENT HANDLER */

/* FILTER */
function applyFilters() {
  let result = [...list];

  if (state.search) {
    result = searchFilter(result);
  }

  if (state.type !== "all") {
    result = result.filter((item) => item.badge.type === state.type);
  }

  const visibleItems = result.slice(0, state.limit);

  renderList(visibleItems);

  loadMoreBtn.style.display =
    result.length > visibleItems.length ? "flex" : "none";

  updateTabCounts();
}
/* FILTER */

applyFilters();
