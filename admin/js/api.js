// ─────────────────────────────────────────────────────────────
//  Talks to the CMS backend. Served from the same server as the
//  API, so requests just use relative paths — no configuration
//  needed no matter what domain this ends up hosted on.
// ─────────────────────────────────────────────────────────────
const Api = (() => {
  const TOKEN_KEY = "rr_cms_token";
  const USER_KEY = "rr_cms_user";

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }
  function setSession(token, username) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, username);
  }
  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
  function getUsername() {
    return localStorage.getItem(USER_KEY);
  }

  async function request(path, { method = "GET", body, isForm = false } = {}) {
    const headers = {};
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    if (!isForm && body !== undefined) headers["Content-Type"] = "application/json";

    const res = await fetch(path, {
      method,
      headers,
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      /* no body */
    }

    if (!res.ok) {
      if (res.status === 401) clearSession();
      throw new Error(data?.error || `Request failed (${res.status})`);
    }
    return data;
  }

  return {
    getToken,
    getUsername,
    clearSession,

    login: (username, password) =>
      request("/api/auth/login", { method: "POST", body: { username, password } }).then(
        (data) => {
          setSession(data.token, data.username);
          return data;
        }
      ),
    me: () => request("/api/auth/me"),
    changePassword: (currentPassword, newPassword) =>
      request("/api/auth/change-password", { method: "POST", body: { currentPassword, newPassword } }),

    getCatalog: () => request("/api/catalog"),

    getProducts: () => request("/api/products"),
    createProduct: (data) => request("/api/products", { method: "POST", body: data }),
    updateProduct: (id, data) => request(`/api/products/${id}`, { method: "PUT", body: data }),
    deleteProduct: (id) => request(`/api/products/${id}`, { method: "DELETE" }),

    getCategories: () => request("/api/categories"),
    saveCategories: (groups) => request("/api/categories", { method: "PUT", body: groups }),

    getTeam: () => request("/api/team"),
    saveTeam: (list) => request("/api/team", { method: "PUT", body: list }),

    getTestimonials: () => request("/api/testimonials"),
    saveTestimonials: (list) => request("/api/testimonials", { method: "PUT", body: list }),

    getSettings: () => request("/api/settings"),
    saveSettings: (data) => request("/api/settings", { method: "PUT", body: data }),

    getPages: () => request("/api/pages"),
    getPage: (key) => request(`/api/pages/${key}`),
    savePage: (key, data) => request(`/api/pages/${key}`, { method: "PUT", body: data }),

    uploadImage: (file) => {
      const form = new FormData();
      form.append("image", file);
      return request("/api/upload", { method: "POST", body: form, isForm: true });
    },
  };
})();
