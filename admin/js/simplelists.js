// ─────────────────────────────────────────────────────────────
//  One reusable editor for the two "small list" content types:
//  Team members and Testimonials. Each is a short
//  list edited as a whole, with add/remove and a Save button —
//  simpler than the full Products screen since these change rarely.
// ─────────────────────────────────────────────────────────────
function makeSimpleListTab(config) {
  // config: { title, description, load, save, fields, emptyItem, itemTitle }
  let items = [];

  async function render(container) {
    container.innerHTML = `<p class="muted">Loading…</p>`;
    items = await config.load();
    draw(container);
  }

  function draw(container) {
    container.innerHTML = `
      <p class="section-desc">${config.description}</p>
      <div id="list-items">
        ${items.map((item, i) => itemCardHtml(item, i)).join("") || `<div class="empty-state">Nothing here yet — add your first one below.</div>`}
      </div>
      <button class="btn btn-primary" id="add-item-btn" style="margin-top:6px;">+ Add ${config.title}</button>
      <div class="modal-actions" style="border-top:none; justify-content:flex-start; padding-top:24px;">
        <button class="btn btn-primary" id="save-list-btn">Save Changes</button>
      </div>
    `;

    items.forEach((item, i) => bindItemCard(container, i));
    container.querySelector("#add-item-btn").onclick = () => {
      items.push({ ...config.emptyItem(items) });
      draw(container);
    };
    container.querySelector("#save-list-btn").onclick = (e) => save(container, e.target);
  }

  function itemCardHtml(item, i) {
    return `
      <div class="list-item-card" data-item="${i}">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong>${config.itemTitle(item) || `${config.title} #${i + 1}`}</strong>
          <button type="button" class="btn btn-danger btn-small" data-remove-item>Delete</button>
        </div>
        <div class="form-grid">
          ${config.fields.map((f) => fieldHtml(item, f)).join("")}
        </div>
      </div>
    `;
  }

  function fieldHtml(item, f) {
    const value = UI.escapeHtml(item[f.key] ?? "");
    const cls = f.full ? "full" : "";
    if (f.type === "textarea") {
      return `<label class="${cls}">${f.label}<textarea data-field="${f.key}">${value}</textarea></label>`;
    }
    if (f.type === "select") {
      return `<label class="${cls}">${f.label}<select data-field="${f.key}">${f.options
        .map((o) => `<option value="${o}" ${String(item[f.key]) === String(o) ? "selected" : ""}>${o}</option>`)
        .join("")}</select></label>`;
    }
    if (f.type === "image") {
      return `
        <label class="${cls}">${f.label}
          <div class="image-drop" data-image-drop>
            <input type="file" accept="image/*" hidden data-image-input />
            <span data-image-label>${item[f.key] ? "Click to replace photo" : "Click to upload a photo"}</span>
            <div><img class="image-preview" data-image-preview src="${value}" ${item[f.key] ? "" : "hidden"} /></div>
          </div>
          <input type="hidden" data-field="${f.key}" value="${value}" />
        </label>`;
    }
    return `<label class="${cls}">${f.label}<input type="${f.type || "text"}" data-field="${f.key}" value="${value}" /></label>`;
  }

  function bindItemCard(container, i) {
    const card = container.querySelector(`[data-item="${i}"]`);
    if (!card) return;
    const item = items[i];

    card.querySelector("[data-remove-item]").onclick = async () => {
      const ok = await UI.confirmDialog(`Delete "${config.itemTitle(item) || config.title}"?`);
      if (!ok) return;
      items.splice(i, 1);
      draw(container);
    };

    config.fields.forEach((f) => {
      if (f.type === "image") {
        const dropZone = card.querySelector("[data-image-drop]");
        const fileInput = card.querySelector("[data-image-input]");
        const hidden = card.querySelector(`[data-field="${f.key}"]`);
        const preview = card.querySelector("[data-image-preview]");
        const label = card.querySelector("[data-image-label]");
        dropZone.onclick = () => fileInput.click();
        fileInput.onchange = async () => {
          const file = fileInput.files[0];
          if (!file) return;
          label.textContent = "Uploading…";
          try {
            const { url } = await Api.uploadImage(file);
            hidden.value = url;
            item[f.key] = url;
            preview.src = url;
            preview.hidden = false;
            label.textContent = "Click to replace photo";
          } catch (err) {
            UI.toast(err.message, true);
            label.textContent = "Click to upload a photo";
          }
        };
      } else {
        const el = card.querySelector(`[data-field="${f.key}"]`);
        el.oninput = el.onchange = (e) => {
          item[f.key] = f.type === "number" ? Number(e.target.value) : e.target.value;
          if (f.affectsTitle) card.querySelector("strong").textContent = config.itemTitle(item) || config.title;
        };
      }
    });
  }

  async function save(container, button) {
    await UI.withBusy(button, async () => {
      try {
        items = await config.save(items);
        UI.toast("Saved.");
        draw(container);
      } catch (err) {
        UI.toast(err.message, true);
      }
    });
  }

  return { render };
}

const TeamTab = makeSimpleListTab({
  title: "Team Member",
  description: `Shown on your About page. "Initials" are used as a fallback avatar if no photo is uploaded.`,
  load: () => Api.getTeam(),
  save: (items) => Api.saveTeam(items),
  itemTitle: (item) => item.name,
  emptyItem: (items) => ({ id: (items.reduce((m, i) => Math.max(m, Number(i.id) || 0), 0) + 1), name: "", role: "", initials: "", image: "" }),
  fields: [
    { key: "name", label: "Name", full: true, affectsTitle: true },
    { key: "role", label: "Role / Title", full: true },
    { key: "initials", label: "Initials (fallback avatar)" },
    { key: "image", label: "Photo", type: "image", full: true },
  ],
});

const TestimonialsTab = makeSimpleListTab({
  title: "Testimonial",
  description: `Customer quotes shown on your Home page. Keep these short and genuine — one or two sentences reads best.`,
  load: () => Api.getTestimonials(),
  save: (items) => Api.saveTestimonials(items),
  itemTitle: (item) => item.name,
  emptyItem: (items) => ({ id: (items.reduce((m, i) => Math.max(m, Number(i.id) || 0), 0) + 1), text: "", name: "", location: "", rating: 5 }),
  fields: [
    { key: "text", label: "Quote", type: "textarea", full: true },
    { key: "name", label: "Customer Name", affectsTitle: true },
    { key: "location", label: "Location" },
    { key: "rating", label: "Rating", type: "select", options: [1, 2, 3, 4, 5] },
  ],
});
