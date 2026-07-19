// ─────────────────────────────────────────────────────────────
//  Small shared helpers used across every tab: toasts, the modal
//  dialog, an "are you sure?" confirm, and an HTML-escape helper
//  so product names/descriptions can never break the page.
// ─────────────────────────────────────────────────────────────
const UI = (() => {
  let toastTimer = null;

  function toast(message, isError = false) {
    const el = document.getElementById("toast");
    el.textContent = message;
    el.classList.toggle("error", isError);
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (el.hidden = true), 3200);
  }

  function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  function openModal(html, { onMount } = {}) {
    const backdrop = document.getElementById("modal-backdrop");
    const modal = document.getElementById("modal");
    modal.innerHTML = `<button class="modal-close" data-close>&times;</button>${html}`;
    backdrop.hidden = false;
    backdrop.querySelector("[data-close]").onclick = closeModal;
    backdrop.onclick = (e) => { if (e.target === backdrop) closeModal(); };
    if (onMount) onMount(modal);
  }

  function closeModal() {
    document.getElementById("modal-backdrop").hidden = true;
    document.getElementById("modal").innerHTML = "";
  }

  function confirmDialog(message) {
    return new Promise((resolve) => {
      openModal(`
        <h3>Please confirm</h3>
        <p class="muted">${escapeHtml(message)}</p>
        <div class="modal-actions">
          <button class="btn btn-secondary" data-cancel>Cancel</button>
          <button class="btn btn-danger" data-yes>Yes, do it</button>
        </div>
      `, {
        onMount: (modal) => {
          modal.querySelector("[data-cancel]").onclick = () => { closeModal(); resolve(false); };
          modal.querySelector("[data-yes]").onclick = () => { closeModal(); resolve(true); };
        },
      });
    });
  }

  async function withBusy(button, fn) {
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = "Saving…";
    try {
      await fn();
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  }

  return { toast, escapeHtml, openModal, closeModal, confirmDialog, withBusy };
})();
