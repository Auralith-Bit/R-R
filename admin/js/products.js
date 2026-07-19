// ─────────────────────────────────────────────────────────────
//  Products tab: list, search/filter, add, edit, delete.
//  This is the CMS's main screen — most day-to-day edits (prices,
//  photos, descriptions) happen here.
// ─────────────────────────────────────────────────────────────
const ProductsTab = (() => {
  let products = [];
  let categoryGroups = [];
  let search = "";
  let categoryFilter = "";

  function allCategoryLabels() {
    const labels = [];
    categoryGroups.forEach((g) => {
      if (g.label === "All Products") return;
      if (g.options?.length) g.options.forEach((o) => labels.push(o.label));
      else labels.push(g.label);
    });
    return labels;
  }

  async function render(container) {
    container.innerHTML = `<p class="muted">Loading products…</p>`;
    const [prods, groups] = await Promise.all([Api.getProducts(), Api.getCategories()]);
    products = prods;
    categoryGroups = groups;
    draw(container);
  }

  function draw(container) {
    const filtered = products.filter((p) => {
      const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    container.innerHTML = `
      <p class="section-desc">Everything here shows up on the Products page and product detail pages of your website within a few seconds of saving. Photos should be square-ish and under 8MB.</p>
      <div class="toolbar">
        <input type="search" id="product-search" placeholder="Search products…" value="${UI.escapeHtml(search)}" />
        <select id="product-category-filter">
          <option value="">All categories</option>
          ${allCategoryLabels().map((c) => `<option value="${UI.escapeHtml(c)}" ${c === categoryFilter ? "selected" : ""}>${UI.escapeHtml(c)}</option>`).join("")}
        </select>
        <span class="muted" style="margin-left:auto">${filtered.length} of ${products.length} products</span>
        <button class="btn btn-primary" id="add-product-btn">+ Add Product</button>
      </div>
      ${filtered.length === 0
        ? `<div class="empty-state">No products match. Try clearing your search or filter.</div>`
        : `<table>
            <thead><tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Badge</th><th></th></tr></thead>
            <tbody>
              ${filtered.map(rowHtml).join("")}
            </tbody>
          </table>`
      }
    `;

    container.querySelector("#product-search").oninput = (e) => { search = e.target.value; draw(container); };
    container.querySelector("#product-category-filter").onchange = (e) => { categoryFilter = e.target.value; draw(container); };
    container.querySelector("#add-product-btn").onclick = () => openForm(container, null);
    filtered.forEach((p) => {
      container.querySelector(`[data-edit="${p.id}"]`).onclick = () => openForm(container, p);
      container.querySelector(`[data-delete="${p.id}"]`).onclick = () => handleDelete(container, p);
    });
  }

  function rowHtml(p) {
    return `
      <tr>
        <td><img class="thumb" src="${UI.escapeHtml(p.image || "")}" onerror="this.style.visibility='hidden'" /></td>
        <td><strong>${UI.escapeHtml(p.name)}</strong><br/><span class="muted">Rs ${p.price} / ${UI.escapeHtml(p.unit || "")}</span></td>
        <td>${UI.escapeHtml(p.category)}</td>
        <td>Rs ${p.price}</td>
        <td>${p.badge ? `<span class="badge-pill">${UI.escapeHtml(p.badge)}</span>` : "—"}</td>
        <td class="row-actions">
          <button class="btn btn-secondary btn-small" data-edit="${p.id}">Edit</button>
          <button class="btn btn-danger btn-small" data-delete="${p.id}">Delete</button>
        </td>
      </tr>
    `;
  }

  async function handleDelete(container, product) {
    const ok = await UI.confirmDialog(`Delete "${product.name}"? This removes it from the website immediately and can't be undone.`);
    if (!ok) return;
    try {
      await Api.deleteProduct(product.id);
      UI.toast(`Deleted "${product.name}".`);
      render(container);
    } catch (err) {
      UI.toast(err.message, true);
    }
  }

  function sizeRowHtml(size = "", price = "") {
    return `
      <div class="size-row">
        <input type="text" placeholder="Size, e.g. 25g" class="size-size" value="${UI.escapeHtml(size)}" />
        <input type="number" placeholder="Price (Rs)" class="size-price" value="${price}" />
        <button type="button" class="btn btn-ghost btn-small" data-remove-size>✕</button>
      </div>
    `;
  }

  function openForm(container, product) {
    const isEdit = !!product;
    const categories = allCategoryLabels();
    const sizeOptions = product?.sizeOptions?.length ? product.sizeOptions : [{ size: product?.unit || "", price: product?.price || "" }];

    UI.openModal(`
      <h3>${isEdit ? "Edit Product" : "Add Product"}</h3>
      <p class="muted">${isEdit ? `Editing "${UI.escapeHtml(product.name)}"` : "Fill in the details below — everything except the badge is required."}</p>
      <form id="product-form">
        <div class="form-grid">
          <label class="full">Product Name
            <input type="text" name="name" required value="${UI.escapeHtml(product?.name || "")}" />
          </label>

          <label>Category
            <select name="category" required>
              ${categories.map((c) => `<option value="${UI.escapeHtml(c)}" ${product?.category === c ? "selected" : ""}>${UI.escapeHtml(c)}</option>`).join("")}
            </select>
          </label>
          <label>Badge <span class="hint">(optional, e.g. "Bestseller")</span>
            <input type="text" name="badge" value="${UI.escapeHtml(product?.badge || "")}" />
          </label>

          <label class="full">Photo
            <div class="image-drop" id="image-drop">
              <input type="file" id="image-input" accept="image/*" hidden />
              <span id="image-drop-label">${product?.image ? "Click to replace photo" : "Click to upload a photo"}</span>
              ${product?.image ? `<div><img class="image-preview" id="image-preview" src="${UI.escapeHtml(product.image)}" /></div>` : `<img class="image-preview" id="image-preview" hidden />`}
            </div>
            <input type="hidden" name="image" value="${UI.escapeHtml(product?.image || "")}" />
          </label>

          <label class="full">Short Description
            <textarea name="description" required>${UI.escapeHtml(product?.description || "")}</textarea>
          </label>

          <label class="full">Sizes &amp; Prices <span class="hint">— the first size is used as the default price shown on product cards</span>
            <div id="size-rows">${sizeOptions.map((s) => sizeRowHtml(s.size, s.price)).join("")}</div>
            <button type="button" class="btn btn-ghost btn-small" id="add-size-row" style="margin-top:8px">+ Add another size</button>
          </label>

          <label>Star Rating (1–5)
            <input type="number" name="rating" min="1" max="5" value="${product?.rating ?? 5}" />
          </label>
          <label>Number of Reviews
            <input type="number" name="reviews" min="0" value="${product?.reviews ?? 0}" />
          </label>

          <label class="full">Ingredients
            <textarea name="ingredients">${UI.escapeHtml(product?.ingredients || "")}</textarea>
          </label>
          <label class="full">Allergy Information
            <textarea name="allergy">${UI.escapeHtml(product?.allergy || "")}</textarea>
          </label>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" data-cancel>Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? "Save Changes" : "Add Product"}</button>
        </div>
      </form>
    `, {
      onMount: (modal) => {
        modal.querySelector("[data-cancel]").onclick = UI.closeModal;

        const dropZone = modal.querySelector("#image-drop");
        const fileInput = modal.querySelector("#image-input");
        const hiddenImage = modal.querySelector('input[name="image"]');
        const preview = modal.querySelector("#image-preview");
        const dropLabel = modal.querySelector("#image-drop-label");

        dropZone.onclick = () => fileInput.click();
        fileInput.onchange = async () => {
          const file = fileInput.files[0];
          if (!file) return;
          dropLabel.textContent = "Uploading…";
          try {
            const { url } = await Api.uploadImage(file);
            hiddenImage.value = url;
            preview.src = url;
            preview.hidden = false;
            dropLabel.textContent = "Click to replace photo";
          } catch (err) {
            UI.toast(err.message, true);
            dropLabel.textContent = "Click to upload a photo";
          }
        };

        modal.querySelector("#add-size-row").onclick = () => {
          modal.querySelector("#size-rows").insertAdjacentHTML("beforeend", sizeRowHtml());
          bindSizeRemovers(modal);
        };
        bindSizeRemovers(modal);

        modal.querySelector("#product-form").onsubmit = async (e) => {
          e.preventDefault();
          const form = e.target;
          const submitBtn = form.querySelector('button[type="submit"]');
          const sizeOptions = [...modal.querySelectorAll(".size-row")]
            .map((row) => ({
              size: row.querySelector(".size-size").value.trim(),
              price: Number(row.querySelector(".size-price").value) || 0,
            }))
            .filter((s) => s.size);

          if (sizeOptions.length === 0) {
            UI.toast("Add at least one size and price.", true);
            return;
          }

          const payload = {
            name: form.name.value.trim(),
            category: form.category.value,
            badge: form.badge.value.trim(),
            image: form.image.value,
            description: form.description.value.trim(),
            rating: Number(form.rating.value) || 5,
            reviews: Number(form.reviews.value) || 0,
            ingredients: form.ingredients.value.trim(),
            allergy: form.allergy.value.trim(),
            sizeOptions,
            price: sizeOptions[0].price,
            unit: sizeOptions[0].size,
          };

          await UI.withBusy(submitBtn, async () => {
            try {
              if (isEdit) {
                await Api.updateProduct(product.id, payload);
                UI.toast(`Saved "${payload.name}".`);
              } else {
                await Api.createProduct(payload);
                UI.toast(`Added "${payload.name}".`);
              }
              UI.closeModal();
              render(container);
            } catch (err) {
              UI.toast(err.message, true);
            }
          });
        };
      },
    });
  }

  function bindSizeRemovers(modal) {
    modal.querySelectorAll("[data-remove-size]").forEach((btn) => {
      btn.onclick = () => {
        const rows = modal.querySelectorAll(".size-row");
        if (rows.length > 1) btn.closest(".size-row").remove();
        else UI.toast("A product needs at least one size.", true);
      };
    });
  }

  return { render };
})();
