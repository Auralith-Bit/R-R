// ─────────────────────────────────────────────────────────────
//  Settings tab: contact details used across the site (Contact
//  page, footer, WhatsApp order links), plus changing the admin
//  password.
// ─────────────────────────────────────────────────────────────
const SettingsTab = (() => {
  async function render(container) {
    container.innerHTML = `<p class="muted">Loading…</p>`;
    const settings = await Api.getSettings();
    draw(container, settings);
  }

  function draw(container, settings) {
    container.innerHTML = `
      <p class="section-desc">These details appear in your website's footer, Contact page, and the WhatsApp number used for order requests.</p>
      <div class="card">
        <h3>Contact Details</h3>
        <form id="settings-form" class="form-grid">
          <label class="full">Site Name
            <input type="text" name="siteName" value="${UI.escapeHtml(settings.siteName)}" />
          </label>
          <label>Contact Email
            <input type="email" name="contactEmail" value="${UI.escapeHtml(settings.contactEmail)}" />
          </label>
          <label>Contact Phone
            <input type="text" name="contactPhone" value="${UI.escapeHtml(settings.contactPhone)}" />
          </label>
          <label>WhatsApp Number <span class="hint">(digits only, with country code, e.g. 9779800000000)</span>
            <input type="text" name="whatsappNumber" value="${UI.escapeHtml(settings.whatsappNumber)}" />
          </label>
          <label class="full">Address
            <input type="text" name="address" value="${UI.escapeHtml(settings.address)}" />
          </label>
          <div class="full" style="text-align:right;">
            <button type="submit" class="btn btn-primary">Save Settings</button>
          </div>
        </form>
      </div>

      <div class="card">
        <h3>Change Your Password</h3>
        <form id="password-form" class="form-grid">
          <label>Current Password
            <input type="password" name="currentPassword" required />
          </label>
          <label>New Password <span class="hint">(at least 6 characters)</span>
            <input type="password" name="newPassword" required minlength="6" />
          </label>
          <div class="full" style="text-align:right;">
            <button type="submit" class="btn btn-secondary">Update Password</button>
          </div>
        </form>
      </div>
    `;

    container.querySelector("#settings-form").onsubmit = async (e) => {
      e.preventDefault();
      const form = e.target;
      const button = form.querySelector('button[type="submit"]');
      const payload = Object.fromEntries(new FormData(form).entries());
      await UI.withBusy(button, async () => {
        try {
          const saved = await Api.saveSettings(payload);
          UI.toast("Settings saved.");
          draw(container, saved);
        } catch (err) {
          UI.toast(err.message, true);
        }
      });
    };

    container.querySelector("#password-form").onsubmit = async (e) => {
      e.preventDefault();
      const form = e.target;
      const button = form.querySelector('button[type="submit"]');
      const { currentPassword, newPassword } = Object.fromEntries(new FormData(form).entries());
      await UI.withBusy(button, async () => {
        try {
          await Api.changePassword(currentPassword, newPassword);
          UI.toast("Password updated.");
          form.reset();
        } catch (err) {
          UI.toast(err.message, true);
        }
      });
    };
  }

  return { render };
})();
