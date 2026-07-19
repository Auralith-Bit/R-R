// ─────────────────────────────────────────────────────────────
//  App shell: handles login/logout and switching between tabs.
//  Set VIEW_SITE_URL below to your live storefront's address so
//  the "View live website" link in the header works.
// ─────────────────────────────────────────────────────────────
// Same-origin root — since the admin panel, API, and website are all
// served from the same server/domain now (e.g. rnrfood.com), "/" always
// points at the live site correctly, wherever this is deployed.
const VIEW_SITE_URL = "/";

const TABS = {
  products: ProductsTab,
  categories: CategoriesTab,
  team: TeamTab,
  testimonials: TestimonialsTab,
  pages: PagesTab,
  settings: SettingsTab,
};

const TAB_TITLES = {
  products: "Products",
  categories: "Categories",
  team: "Team",
  testimonials: "Testimonials",
  pages: "Page Content",
  settings: "Site Settings",
};

let currentTab = "products";

function showApp() {
  document.getElementById("login-screen").hidden = true;
  document.getElementById("app").hidden = false;
  document.getElementById("whoami").textContent = `Logged in as ${Api.getUsername()}`;
  document.getElementById("view-site-link").href = VIEW_SITE_URL;
  switchTab(currentTab);
}

function showLogin() {
  document.getElementById("login-screen").hidden = false;
  document.getElementById("app").hidden = true;
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll(".nav-link").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.hidden = panel.id !== `tab-${tab}`;
  });
  document.getElementById("page-title").textContent = TAB_TITLES[tab];
  const container = document.getElementById(`tab-${tab}`);
  TABS[tab].render(container).catch((err) => {
    container.innerHTML = `<div class="empty-state">Couldn't load this section: ${UI.escapeHtml(err.message)}</div>`;
  });
}

document.querySelectorAll(".nav-link").forEach((btn) => {
  btn.onclick = () => switchTab(btn.dataset.tab);
});

document.getElementById("login-form").onsubmit = async (e) => {
  e.preventDefault();
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;
  const errorEl = document.getElementById("login-error");
  errorEl.hidden = true;
  try {
    await Api.login(username, password);
    showApp();
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.hidden = false;
  }
};

document.getElementById("logout-btn").onclick = () => {
  Api.clearSession();
  showLogin();
};

// On load, if we already have a token, verify it still works before
// jumping straight into the app.
(async () => {
  if (Api.getToken()) {
    try {
      await Api.me();
      showApp();
      return;
    } catch {
      Api.clearSession();
    }
  }
  showLogin();
})();
