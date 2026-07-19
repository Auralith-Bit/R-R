// ─────────────────────────────────────────────────────────────
//  Pages tab: edit the content of every page on the website.
// ─────────────────────────────────────────────────────────────
const PagesTab = (() => {
  const PAGE_DEFS = [
    { key: "home", label: "Home" },
    { key: "about", label: "About" },
    { key: "contact", label: "Contact" },
    { key: "manufacturing", label: "Manufacturing" },
    { key: "products", label: "Products" },
    { key: "shared", label: "Navbar & Footer" },
  ];

  let allPages = {};
  let activePage = "home";

  async function render(container) {
    container.innerHTML = `<p class="muted">Loading...</p>`;
    allPages = await Api.getPages();
    draw(container);
  }

  function draw(container) {
    container.innerHTML = `
      <p class="section-desc">Edit the text, headings, images, and content for each page on your website. Changes appear live once saved.</p>
      <div class="toolbar" style="margin-bottom:20px;">
        ${PAGE_DEFS.map((p) => `
          <button class="btn ${activePage === p.key ? "btn-primary" : "btn-secondary"} page-select-btn" data-page="${p.key}">
            ${p.label}
          </button>
        `).join("")}
      </div>
      <div id="page-editor"></div>
    `;
    container.querySelectorAll(".page-select-btn").forEach((btn) => {
      btn.onclick = () => {
        activePage = btn.dataset.page;
        draw(container);
      };
    });
    renderPageEditor(container.querySelector("#page-editor"));
  }

  function renderPageEditor(el) {
    const data = allPages[activePage] || {};
    const builders = {
      home: buildHomeEditor,
      about: buildAboutEditor,
      contact: buildContactEditor,
      manufacturing: buildManufacturingEditor,
      products: buildProductsEditor,
      shared: buildSharedEditor,
    };
    const html = builders[activePage] ? builders[activePage](data) : `<p class="muted">No content for this page yet.</p>`;
    el.innerHTML = `<form id="page-form">${html}<div style="text-align:right;margin-top:16px;">
      <button type="submit" class="btn btn-primary">Save ${PAGE_DEFS.find((p) => p.key === activePage)?.label || ""} Content</button>
    </div></form>`;
    el.querySelector("#page-form").onsubmit = async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button[type="submit"]');
      const payload = collectFormData(e.target);
      await UI.withBusy(btn, async () => {
        try {
          allPages[activePage] = payload;
          await Api.savePage(activePage, payload);
          UI.toast("Saved!");
        } catch (err) {
          UI.toast(err.message, true);
        }
      });
    };
  }

  function collectFormData(form) {
    const result = {};
    form.querySelectorAll("[data-field]").forEach((el) => {
      const path = el.dataset.field;
      const val = el.value;
      setNested(result, path, val);
    });
    form.querySelectorAll("[data-field-array]").forEach((el) => {
      const path = el.dataset.fieldArray;
      const val = el.value.split("\n").map((s) => s.trim()).filter(Boolean);
      setNested(result, path, val);
    });
    form.querySelectorAll("[data-field-objects]").forEach((el) => {
      const path = el.dataset.fieldObjects;
      const val = el.value.split("\n").map((s) => s.trim()).filter(Boolean).map((line) => {
        const parts = line.split("|").map((p) => p.trim());
        if (parts.length >= 3) return { title: parts[0], desc: parts[1], color: parts[2] };
        if (parts.length === 2) return { title: parts[0], desc: parts[1] };
        return { title: parts[0] };
      });
      setNested(result, path, val);
    });
    return result;
  }

  function setNested(obj, path, val) {
    const parts = path.split(".");
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cur[parts[i]] || typeof cur[parts[i]] !== "object") cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = val;
  }

  function txt(label, path, data, opts = {}) {
    const val = getNested(data, path) || "";
    return `<label>${label}
      <input type="text" data-field="${path}" value="${UI.escapeHtml(val)}" ${opts.hint ? `placeholder="${opts.hint}"` : ""} />
    </label>`;
  }

  function area(label, path, data, opts = {}) {
    const val = getNested(data, path) || "";
    const rows = opts.rows || 3;
    return `<label class="full">${label}
      <textarea data-field="${path}" rows="${rows}" style="width:100%;padding:9px 11px;border:1px solid var(--border-color);border-radius:8px;font-size:14px;font-family:inherit;resize:vertical;">${UI.escapeHtml(val)}</textarea>
    </label>`;
  }

  function listArea(label, path, data) {
    const arr = getNested(data, path) || [];
    const val = Array.isArray(arr) ? arr.join("\n") : "";
    return `<label class="full">${label} <span class="hint">(one per line)</span>
      <textarea data-field-array="${path}" rows="4" style="width:100%;padding:9px 11px;border:1px solid var(--border-color);border-radius:8px;font-size:14px;font-family:inherit;resize:vertical;">${UI.escapeHtml(val)}</textarea>
    </label>`;
  }

  function listAreaObjects(label, path, data, fmt) {
    const arr = getNested(data, path) || [];
    let val = "";
    if (Array.isArray(arr)) {
      val = arr.map((item) => {
        if (typeof item === "object" && item !== null) {
          if (fmt === "3") return `${item.title || ""}|${item.desc || ""}|${item.color || ""}`;
          return `${item.title || ""}|${item.desc || ""}`;
        }
        return String(item);
      }).join("\n");
    }
    return `<label class="full">${label} <span class="hint">(format: ${fmt === "3" ? "title|description|color" : "title|description"})</span>
      <textarea data-field-objects="${path}" rows="4" style="width:100%;padding:9px 11px;border:1px solid var(--border-color);border-radius:8px;font-size:14px;font-family:inherit;resize:vertical;">${UI.escapeHtml(val)}</textarea>
    </label>`;
  }

  function getNested(obj, path) {
    return path.split(".").reduce((o, k) => (o && o[k] !== undefined ? o[k] : ""), obj);
  }

  function sectionHead(title) {
    return `<h3 style="margin:20px 0 8px;padding-top:14px;border-top:1px solid var(--border-color);">${title}</h3>`;
  }

  function buildHomeEditor(d) {
    const h = d.hero || {};
    const na = d.newArrivals || {};
    const st = d.story || {};
    const fp = d.featuredProducts || {};
    const abs = d.aboutStory || {};
    const cta = d.ctaBanner || {};
    const tm = d.testimonials || {};
    const hw = d.howWeMakeIt || {};
    return `
      ${sectionHead("Hero Section")}
      <div class="form-grid">
        ${txt("Badge Text", "hero.badge", d)}
        ${txt("Heading", "hero.heading", d)}
        ${txt("Heading Highlight", "hero.headingHighlight", d)}
        ${txt("Subtitle", "hero.subtitle", d)}
        ${txt("Button 1 Text", "hero.cta1Text", d)}
        ${txt("Button 1 Link", "hero.cta1Link", d)}
        ${txt("Button 2 Text", "hero.cta2Text", d)}
        ${txt("Button 2 Link", "hero.cta2Link", d)}
        ${listArea("Hero Slide Images (one path per line)", "hero.slides", d)}
      </div>

      ${sectionHead("New Arrivals Section")}
      <div class="form-grid">
        ${txt("Section Tag", "newArrivals.tag", d)}
        ${txt("Heading", "newArrivals.heading", d)}
      </div>

      ${sectionHead("Healthy Living / Story Section")}
      <div class="form-grid">
        ${txt("Section Tag", "story.tag", d)}
        ${txt("Heading", "story.heading", d)}
        ${txt("Image Path", "story.image", d)}
        ${txt("CTA Text", "story.ctaText", d)}
      </div>
      ${listArea("Body Paragraphs", "story.body", d)}
      ${listArea("Feature Titles (one per line)", "story._featureTitles", d)}
      ${listArea("Feature Descriptions (one per line)", "story._featureDescs", d)}

      ${sectionHead("Featured Products Section")}
      <div class="form-grid">
        ${txt("Section Tag", "featuredProducts.tag", d)}
        ${txt("Heading", "featuredProducts.heading", d)}
        ${txt("CTA Text", "featuredProducts.ctaText", d)}
      </div>

      ${sectionHead("Perks Marquee (one title|desc per line)")}
      ${listArea("Perks (format: title|desc)", "perks", d)}

      ${sectionHead("About Story Section")}
      <div class="form-grid">
        ${txt("Section Tag", "aboutStory.tag", d)}
        ${txt("Heading", "aboutStory.heading", d)}
        ${txt("Image Path", "aboutStory.image", d)}
        ${txt("CTA Text", "aboutStory.ctaText", d)}
      </div>
      ${listArea("Body Paragraphs", "aboutStory.body", d)}

      ${sectionHead("CTA Banner")}
      <div class="form-grid">
        ${txt("Heading", "ctaBanner.heading", d)}
        ${txt("Body", "ctaBanner.body", d)}
        ${txt("Button 1 Text", "ctaBanner.button1Text", d)}
        ${txt("Button 1 Link", "ctaBanner.button1Link", d)}
        ${txt("Button 2 Text", "ctaBanner.button2Text", d)}
      </div>

      ${sectionHead("Testimonials Section")}
      <div class="form-grid">
        ${txt("Section Tag", "testimonials.tag", d)}
        ${txt("Heading", "testimonials.heading", d)}
      </div>

      ${sectionHead("How We Make It Section")}
      <div class="form-grid">
        ${txt("Section Tag", "howWeMakeIt.tag", d)}
        ${txt("Heading", "howWeMakeIt.heading", d)}
        ${txt("Video Path", "howWeMakeIt.video", d)}
        ${txt("CTA Text", "howWeMakeIt.ctaText", d)}
      </div>
      ${listArea("Body Paragraphs", "howWeMakeIt.body", d)}
    `;
  }

  function buildAboutEditor(d) {
    const h = d.hero || {};
    const st = d.story || {};
    const mv = d.missionVision || {};
    const q = d.quality || {};
    const sc = d.scale || {};
    const adv = d.advantages || {};
    const pb = d.peopleBehindUs || {};
    const cta = d.cta || {};
    return `
      ${sectionHead("Hero Section")}
      <div class="form-grid">
        ${txt("Breadcrumb", "hero.breadcrumb", d)}
        ${txt("Title", "hero.title", d)}
        ${txt("Subtitle", "hero.subtitle", d)}
        ${txt("Background Image", "hero.bgImage", d)}
      </div>

      ${sectionHead("Story Section")}
      <div class="form-grid">
        ${txt("Section Tag", "story.tag", d)}
        ${txt("Heading", "story.heading", d)}
        ${txt("Image Path", "story.image", d)}
      </div>
      ${listArea("Body Paragraphs", "story.body", d)}

      ${sectionHead("Mission & Vision")}
      <div class="form-grid">
        ${txt("Section Tag", "missionVision.tag", d)}
        ${txt("Section Heading", "missionVision.heading", d)}
        ${txt("Mission Title", "missionVision.mission.title", d)}
        ${txt("Mission Body", "missionVision.mission.body", d)}
        ${listArea("Mission Tags", "missionVision.mission.tags", d)}
        ${txt("Vision Title", "missionVision.vision.title", d)}
        ${txt("Vision Body", "missionVision.vision.body", d)}
        ${listArea("Vision Tags", "missionVision.vision.tags", d)}
      </div>

      ${sectionHead("Quality Section")}
      <div class="form-grid">
        ${txt("Section Tag", "quality.tag", d)}
        ${txt("Heading", "quality.heading", d)}
        ${txt("Video Path", "quality.video", d)}
        ${listArea("Trust Tags", "quality.tags", d)}
      </div>
      ${listArea("Body Paragraphs", "quality.body", d)}

      ${sectionHead("Manufacturing Scale")}
      <div class="form-grid">
        ${txt("Section Tag", "scale.tag", d)}
        ${txt("Heading", "scale.heading", d)}
      </div>

      ${sectionHead("Advantages Section")}
      <div class="form-grid">
        ${txt("Section Tag", "advantages.tag", d)}
        ${txt("Heading", "advantages.heading", d)}
      </div>

      ${sectionHead("People Behind Us")}
      <div class="form-grid">
        ${txt("Section Tag", "peopleBehindUs.tag", d)}
        ${txt("Heading", "peopleBehindUs.heading", d)}
        ${txt("Video Path", "peopleBehindUs.video", d)}
      </div>
      ${listArea("Body Paragraphs", "peopleBehindUs.body", d)}

      ${sectionHead("CTA Section")}
      <div class="form-grid">
        ${txt("Heading", "cta.heading", d)}
        ${txt("Body", "cta.body", d)}
        ${txt("Button Text", "cta.buttonText", d)}
        ${txt("Bulk Heading", "cta.bulkHeading", d)}
        ${txt("Bulk Body", "cta.bulkBody", d)}
        ${txt("Bulk Button 1", "cta.bulkButton1", d)}
        ${txt("Bulk Button 2", "cta.bulkButton2", d)}
      </div>
    `;
  }

  function buildContactEditor(d) {
    const h = d.hero || {};
    const ci = d.contactInfo || {};
    const wh = d.whatsappHelp || {};
    const f = d.form || {};
    const qh = d.quickHelp || {};
    const cta = d.cta || {};
    const faq = d.faq || {};
    return `
      ${sectionHead("Hero Section")}
      <div class="form-grid">
        ${txt("Breadcrumb", "hero.breadcrumb", d)}
        ${txt("Title", "hero.title", d)}
        ${txt("Subtitle", "hero.subtitle", d)}
        ${txt("Background Image", "hero.bgImage", d)}
      </div>

      ${sectionHead("Contact Info Card")}
      <div class="form-grid">
        ${txt("Heading", "contactInfo.heading", d)}
      </div>

      ${sectionHead("WhatsApp Help Box")}
      <div class="form-grid">
        ${txt("Heading", "whatsappHelp.heading", d)}
        ${txt("Body", "whatsappHelp.body", d)}
      </div>

      ${sectionHead("Contact Form")}
      <div class="form-grid">
        ${txt("Form Heading", "form.heading", d)}
        ${txt("Form Body", "form.body", d)}
        ${txt("Success Message", "form.successMessage", d)}
        ${txt("Submit Button Text", "form.fields.submitText", d)}
      </div>

      ${sectionHead("Quick Help Section")}
      <div class="form-grid">
        ${txt("Section Tag", "quickHelp.tag", d)}
        ${txt("Section Heading", "quickHelp.heading", d)}
      </div>

      ${sectionHead("CTA Section")}
      <div class="form-grid">
        ${txt("Heading", "cta.heading", d)}
        ${txt("Body", "cta.body", d)}
        ${txt("Button Text", "cta.buttonText", d)}
        ${txt("Bulk Heading", "cta.bulkHeading", d)}
        ${txt("Bulk Body", "cta.bulkBody", d)}
        ${txt("Bulk Button 1", "cta.bulkButton1", d)}
        ${txt("Bulk Button 2", "cta.bulkButton2", d)}
      </div>

      ${sectionHead("FAQ Section")}
      <div class="form-grid">
        ${txt("Section Tag", "faq.tag", d)}
        ${txt("Section Heading", "faq.heading", d)}
      </div>
    `;
  }

  function buildManufacturingEditor(d) {
    const h = d.hero || {};
    const ps = d.processSteps || {};
    const fc = d.facility || {};
    const cta = d.cta || {};
    const cap = d.capabilities || {};
    return `
      ${sectionHead("Hero Section")}
      <div class="form-grid">
        ${txt("Breadcrumb", "hero.breadcrumb", d)}
        ${txt("Title", "hero.title", d)}
        ${txt("Subtitle", "hero.subtitle", d)}
        ${txt("Background Image", "hero.bgImage", d)}
      </div>

      ${sectionHead("Process Steps Section")}
      <div class="form-grid">
        ${txt("Section Tag", "processSteps.tag", d)}
        ${txt("Heading", "processSteps.heading", d)}
      </div>
      ${listAreaObjects("Steps (format: title|description|color)", "processSteps.steps", d, "3")}

      ${sectionHead("Facility Section")}
      <div class="form-grid">
        ${txt("Section Tag", "facility.tag", d)}
        ${txt("Heading", "facility.heading", d)}
        ${txt("Body", "facility.body", d)}
        ${txt("Image Path", "facility.image", d)}
      </div>
      ${listAreaObjects("Features (format: title|description)", "facility.features", d)}

      ${sectionHead("CTA Section")}
      <div class="form-grid">
        ${txt("Heading", "cta.heading", d)}
        ${txt("Body", "cta.body", d)}
        ${txt("Button 1 Text", "cta.button1Text", d)}
        ${txt("Button 2 Text", "cta.button2Text", d)}
        ${listArea("Badges (one per line)", "cta.badges", d)}
      </div>

      ${sectionHead("Capabilities Section")}
      <div class="form-grid">
        ${txt("Section Tag", "capabilities.tag", d)}
        ${txt("Heading", "capabilities.heading", d)}
      </div>
      ${listAreaObjects("Items (format: title|description)", "capabilities.items", d)}
    `;
  }

  function buildProductsEditor(d) {
    const h = d.hero || {};
    return `
      ${sectionHead("Products Page Hero")}
      <div class="form-grid">
        ${txt("Breadcrumb", "hero.breadcrumb", d)}
        ${txt("Title", "hero.title", d)}
        ${txt("Subtitle", "hero.subtitle", d)}
        ${txt("Background Image", "hero.bgImage", d)}
      </div>
    `;
  }

  function buildSharedEditor(d) {
    const f = d.footer || {};
    return `
      ${sectionHead("Footer")}
      <div class="form-grid">
        ${txt("Tagline", "footer.tagline", d)}
        ${txt("Facebook URL", "footer.socialFacebook", d)}
        ${txt("Instagram URL", "footer.socialInstagram", d)}
        ${txt("Twitter URL", "footer.socialTwitter", d)}
        ${txt("Copyright Text", "footer.copyright", d)}
        ${txt("Subscribe Heading", "footer.subscribeHeading", d)}
        ${txt("Subscribe Description", "footer.subscribeDescription", d)}
      </div>

      ${sectionHead("Navbar")}
      <div class="form-grid">
        ${txt("WhatsApp Button Text", "navbar.whatsappText", d)}
      </div>
    `;
  }

  return { render };
})();
