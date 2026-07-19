// ─────────────────────────────────────────────────────────────
//  Categories tab: edit the category groups that power the
//  filter row on the Products page and the "What We Manufacture"
//  grid on the About page. Groups can optionally have sub-options
//  (e.g. "Chips/Kurkure/Cheese Balls" → Chips, Kurkure, Cheese Balls).
//
//  IMPORTANT for the client: a product's Category (set on the
//  Products tab) must exactly match either a group's name (if it
//  has no sub-options) or one of its sub-option names. Renaming a
//  category here will NOT automatically rename it on existing
//  products — update those products too if you rename something.
// ─────────────────────────────────────────────────────────────
const CategoriesTab = (() => {
  let groups = [];

  async function render(container) {
    container.innerHTML = `<p class="muted">Loading categories…</p>`;
    groups = await Api.getCategories();
    draw(container);
  }

  function draw(container) {
    container.innerHTML = `
      <p class="section-desc">These control the filter buttons on your Products page and the grid on your About page. "All Products" is a special entry your website needs — don't delete it.
      Changing a name here does <strong>not</strong> rename it on products that already use the old name — edit those products too.</p>

      <div id="groups-list">
        ${groups.map((g, i) => groupCardHtml(g, i)).join("")}
      </div>
      <button class="btn btn-primary" id="add-group-btn" style="margin-top: 6px;">+ Add Category Group</button>
      <div class="modal-actions" style="border-top:none; justify-content:flex-start; padding-top: 24px;">
        <button class="btn btn-primary" id="save-categories-btn">Save All Category Changes</button>
      </div>
    `;

    groups.forEach((g, i) => bindGroupCard(container, i));
    container.querySelector("#add-group-btn").onclick = () => {
      groups.push({ label: "", image: "", options: [] });
      draw(container);
    };
    container.querySelector("#save-categories-btn").onclick = (e) => save(container, e.target);
  }

  function groupCardHtml(g, i) {
    const isProtected = g.label === "All Products";
    return `
      <div class="group-card" data-group="${i}">
        <div class="group-card-head">
          <input type="text" class="group-label" placeholder="Group name" value="${UI.escapeHtml(g.label)}" style="flex:1; padding:8px 10px; border:1px solid var(--border-color); border-radius:6px;" ${isProtected ? "disabled" : ""} />
          ${!isProtected ? `<button class="btn btn-danger btn-small" data-remove-group>Delete Group</button>` : `<span class="muted">Required</span>`}
        </div>
        ${!isProtected ? `
          <div class="option-list">
            ${(g.options || []).map((o, oi) => optionRowHtml(o, oi)).join("")}
          </div>
          <button type="button" class="btn btn-ghost btn-small" data-add-option style="margin: 8px 0 0 20px;">+ Add sub-category</button>
          <p class="hint" style="margin-left:20px;">Leave sub-categories empty if this group should just be one flat category.</p>
        ` : ""}
      </div>
    `;
  }

  function optionRowHtml(o, oi) {
    return `
      <div class="option-row" data-option="${oi}">
        <input type="text" class="option-label" placeholder="Sub-category name" value="${UI.escapeHtml(o.label)}" />
        <button type="button" class="btn btn-ghost btn-small" data-remove-option>✕</button>
      </div>
    `;
  }

  function bindGroupCard(container, i) {
    const card = container.querySelector(`[data-group="${i}"]`);
    if (!card) return;
    const g = groups[i];

    const labelInput = card.querySelector(".group-label");
    if (labelInput) labelInput.oninput = (e) => (g.label = e.target.value);

    const removeGroupBtn = card.querySelector("[data-remove-group]");
    if (removeGroupBtn) {
      removeGroupBtn.onclick = async () => {
        const ok = await UI.confirmDialog(`Delete the "${g.label}" category group? Any products using this category should be reassigned first.`);
        if (!ok) return;
        groups.splice(i, 1);
        draw(container);
      };
    }

    const addOptionBtn = card.querySelector("[data-add-option]");
    if (addOptionBtn) {
      addOptionBtn.onclick = () => {
        g.options = g.options || [];
        g.options.push({ label: "", image: g.image || "" });
        draw(container);
      };
    }

    (g.options || []).forEach((o, oi) => {
      const row = card.querySelector(`[data-option="${oi}"]`);
      if (!row) return;
      row.querySelector(".option-label").oninput = (e) => (o.label = e.target.value);
      row.querySelector("[data-remove-option]").onclick = () => {
        g.options.splice(oi, 1);
        draw(container);
      };
    });
  }

  async function save(container, button) {
    const cleaned = groups
      .filter((g) => g.label.trim())
      .map((g) => ({
        ...g,
        label: g.label.trim(),
        options: (g.options || []).filter((o) => o.label.trim()).map((o) => ({ ...o, label: o.label.trim() })),
      }));

    await UI.withBusy(button, async () => {
      try {
        groups = await Api.saveCategories(cleaned);
        UI.toast("Categories saved.");
        draw(container);
      } catch (err) {
        UI.toast(err.message, true);
      }
    });
  }

  return { render };
})();
