/* waitrocket embed sdk v1.0.0 — waitrocket.com */
(function () {
  "use strict";

  var script = document.currentScript;
  if (!script) return;

  var slug = script.getAttribute("data-slug");
  if (!slug) { console.error("[waitrocket] missing data-slug attribute"); return; }

  var BASE_URL = script.src.replace(/\/v1\.js.*$/, "");
  var STORAGE_KEY = "wr_" + slug;
  var urlParams = new URLSearchParams(window.location.search);
  var urlRef = urlParams.get("ref") || null;

  // ── Container ────────────────────────────────────────────────────────────────
  var container = document.getElementById("waitrocket-widget");
  if (!container) {
    container = document.createElement("div");
    container.id = "waitrocket-widget";
    script.parentNode.insertBefore(container, script);
  }
  container.setAttribute("data-wr", "1");

  // ── State ────────────────────────────────────────────────────────────────────
  var state = {
    loading: true,
    meta: null,
    signup: JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"),
    error: null,
    submitting: false,
    copied: false,
  };

  // ── Styles ───────────────────────────────────────────────────────────────────
  function injectStyles(brandColor) {
    if (document.getElementById("wr-styles")) return;
    var color = brandColor || "#7c3aed";
    var style = document.createElement("style");
    style.id = "wr-styles";
    style.textContent = [
      "#waitrocket-widget{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;box-sizing:border-box;width:100%;max-width:480px;margin:0 auto}",
      "#waitrocket-widget *{box-sizing:border-box;margin:0;padding:0}",
      ".wr-box{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:32px;text-align:center}",
      ".wr-logo{height:32px;margin:0 auto 16px;display:block}",
      ".wr-headline{font-size:22px;font-weight:700;color:#0f172a;margin-bottom:8px;line-height:1.3}",
      ".wr-reward{font-size:14px;color:#64748b;margin-bottom:24px;line-height:1.5}",
      ".wr-form{display:flex;flex-direction:column;gap:10px}",
      ".wr-input{width:100%;padding:12px 16px;border:1px solid #e2e8f0;border-radius:10px;font-size:15px;color:#0f172a;outline:none;transition:border-color .15s}",
      ".wr-input:focus{border-color:VAR_COLOR}",
      ".wr-btn{width:100%;padding:13px;background:VAR_COLOR;color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer;transition:opacity .15s}",
      ".wr-btn:disabled{opacity:.6;cursor:not-allowed}",
      ".wr-position{font-size:48px;font-weight:800;color:VAR_COLOR;margin:12px 0 4px}",
      ".wr-pos-label{font-size:13px;color:#64748b;margin-bottom:20px}",
      ".wr-refbox{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;margin-bottom:16px}",
      ".wr-reflink{font-size:12px;color:#64748b;word-break:break-all;display:block;margin-bottom:10px}",
      ".wr-copy{width:100%;padding:10px;background:VAR_COLOR;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer}",
      ".wr-powered{margin-top:16px;font-size:11px;color:#94a3b8;text-align:center}",
      ".wr-powered a{color:#94a3b8;text-decoration:none}",
      ".wr-powered a:hover{text-decoration:underline}",
      ".wr-error{font-size:13px;color:#ef4444;margin-top:4px}",
      ".wr-count{font-size:13px;color:#64748b;margin-top:16px}",
      "@media(max-width:480px){.wr-box{border-radius:12px;padding:24px}.wr-headline{font-size:20px}}",
    ].join("").replace(/VAR_COLOR/g, color);
    document.head.appendChild(style);
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  function render() {
    if (state.loading) {
      container.innerHTML = '<div class="wr-box"><div class="wr-reward">Loading...</div></div>';
      return;
    }
    if (state.error) {
      container.innerHTML = '<div class="wr-box"><div class="wr-reward">' + escHtml(state.error) + '</div></div>';
      return;
    }
    var meta = state.meta;
    injectStyles(meta.brandColor);

    if (state.signup) {
      renderSuccess(meta, state.signup);
    } else {
      renderForm(meta);
    }
  }

  function renderForm(meta) {
    var logo = meta.logoUrl ? '<img class="wr-logo" src="' + escHtml(meta.logoUrl) + '" alt="logo">' : "";
    var powered = meta.isPoweredByHidden ? "" :
      '<p class="wr-powered">Powered by <a href="https://waitrocket.com" target="_blank" rel="noopener">Waitrocket</a></p>';
    var count = meta.totalSignups > 0
      ? '<p class="wr-count">' + meta.totalSignups.toLocaleString() + ' already joined</p>'
      : "";

    container.innerHTML = [
      '<div class="wr-box">',
      logo,
      '<h2 class="wr-headline">' + escHtml(meta.name) + '</h2>',
      '<p class="wr-reward">' + escHtml(meta.headline || meta.rewardCopy || "") + '</p>',
      '<form class="wr-form" id="wr-form">',
      '  <input class="wr-input" type="text" id="wr-name" placeholder="Your name (optional)">',
      '  <input class="wr-input" type="email" id="wr-email" placeholder="Your email address" required>',
      '  <div class="wr-error" id="wr-err" style="display:none"></div>',
      '  <button class="wr-btn" id="wr-submit" type="submit">Join the waitlist →</button>',
      '</form>',
      count,
      powered,
      '</div>',
    ].join("");

    document.getElementById("wr-form").addEventListener("submit", handleSubmit);
  }

  function renderSuccess(meta, signup) {
    var refLink = signup.referralLink;
    var powered = meta.isPoweredByHidden ? "" :
      '<p class="wr-powered">Powered by <a href="https://waitrocket.com" target="_blank" rel="noopener">Waitrocket</a></p>';
    var reward = meta.rewardCopy || "Share your link to move up the queue!";

    container.innerHTML = [
      '<div class="wr-box">',
      '<div class="wr-position">#' + signup.currentPosition + '</div>',
      '<p class="wr-pos-label">your position in the queue</p>',
      '<p class="wr-reward">' + escHtml(reward) + '</p>',
      '<div class="wr-refbox">',
      '  <span class="wr-reflink">' + escHtml(refLink) + '</span>',
      '  <button class="wr-copy" id="wr-copy">' + (state.copied ? "✓ Copied!" : "Copy referral link") + '</button>',
      '</div>',
      powered,
      '</div>',
    ].join("");

    document.getElementById("wr-copy").addEventListener("click", function () {
      navigator.clipboard.writeText(refLink).then(function () {
        state.copied = true;
        render();
        setTimeout(function () { state.copied = false; render(); }, 2000);
      });
    });
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  function handleSubmit(e) {
    e.preventDefault();
    if (state.submitting) return;

    var email = (document.getElementById("wr-email").value || "").trim().toLowerCase();
    var name = (document.getElementById("wr-name").value || "").trim();
    var errEl = document.getElementById("wr-err");
    errEl.style.display = "none";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errEl.textContent = "Please enter a valid email address.";
      errEl.style.display = "block";
      return;
    }

    state.submitting = true;
    document.getElementById("wr-submit").disabled = true;
    document.getElementById("wr-submit").textContent = "Joining...";

    var body = { email: email };
    if (name) body.name = name;
    if (urlRef) body.ref = urlRef;

    fetch(BASE_URL + "/api/waitlist/" + encodeURIComponent(slug) + "/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        state.submitting = false;
        if (data.error) {
          var errEl2 = document.getElementById("wr-err");
          if (errEl2) { errEl2.textContent = data.error; errEl2.style.display = "block"; }
          var btn = document.getElementById("wr-submit");
          if (btn) { btn.disabled = false; btn.textContent = "Join the waitlist →"; }
          return;
        }
        var signup = {
          signupId: data.signupId,
          currentPosition: data.currentPosition,
          referralLink: data.referralLink,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(signup));
        state.signup = signup;
        render();
      })
      .catch(function () {
        state.submitting = false;
        var errEl3 = document.getElementById("wr-err");
        if (errEl3) { errEl3.textContent = "Network error. Please try again."; errEl3.style.display = "block"; }
        var btn2 = document.getElementById("wr-submit");
        if (btn2) { btn2.disabled = false; btn2.textContent = "Join the waitlist →"; }
      });
  }

  // ── Init ─────────────────────────────────────────────────────────────────────
  function init() {
    // If user already signed up, fetch fresh position
    if (state.signup) {
      fetch(BASE_URL + "/api/waitlist/" + encodeURIComponent(slug) + "/position/" + encodeURIComponent(state.signup.signupId))
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (data) {
          if (data && typeof data.currentPosition === "number") {
            state.signup.currentPosition = data.currentPosition;
            state.signup.referralLink = data.referralLink;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.signup));
          }
        })
        .catch(function () {});
    }

    fetch(BASE_URL + "/api/waitlist/" + encodeURIComponent(slug))
      .then(function (res) {
        if (!res.ok) throw new Error("Waitlist not found");
        return res.json();
      })
      .then(function (meta) {
        state.meta = meta;
        state.loading = false;
        render();
      })
      .catch(function (err) {
        state.loading = false;
        state.error = err.message || "Failed to load waitlist";
        render();
      });
  }

  // ── Utils ────────────────────────────────────────────────────────────────────
  function escHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Boot
  render();
  init();
})();
