document.addEventListener("DOMContentLoaded", function () {
  var launcher = document.getElementById("yoriiLauncher");
  var panel = document.getElementById("yoriiPanel");
  var closeBtn = document.getElementById("yoriiClose");
  var messagesEl = document.getElementById("yoriiMessages");
  var form = document.getElementById("yoriiForm");
  var input = document.getElementById("yoriiInput");
  var badge = document.getElementById("yoriiLauncherBadge");

  if (!launcher || !panel || !form || !input || !messagesEl) return;

  var STORAGE_KEY = "yorii_chat_history";
  var chatUrl = form.getAttribute("data-chat-url");
  var leadUrl = form.getAttribute("data-lead-url");
  var waPhone = form.getAttribute("data-wa-phone") || "";
  var waLink = form.getAttribute("data-wa-link") || "";
  var isOpen = false;
  var isSending = false;
  var history = [];

  try {
    var saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) history = JSON.parse(saved) || [];
  } catch (e) {
    history = [];
  }

  function saveHistory() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-24)));
    } catch (e) {
      /* private browsing or storage full — chat still works, just won't persist */
    }
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Yorii mentions the studio's own WhatsApp number verbatim (it's given to
  // her in the system prompt), so a plain substring swap on the escaped
  // text is enough to turn it into a tappable wa.me link — no need for a
  // fragile generic phone-number regex.
  function linkifyAssistantText(text) {
    var escaped = escapeHtml(text);
    if (waPhone && waLink) {
      var escapedPhone = escapeHtml(waPhone);
      if (escapedPhone && escaped.indexOf(escapedPhone) !== -1) {
        var anchor = '<a href="' + waLink + '" target="_blank" rel="noopener">' + escapedPhone + "</a>";
        escaped = escaped.split(escapedPhone).join(anchor);
      }
    }
    return escaped;
  }

  function appendBubble(role, text) {
    var bubble = document.createElement("div");
    bubble.className = "yorii-bubble yorii-bubble-" + role;
    if (role === "assistant") {
      bubble.innerHTML = linkifyAssistantText(text);
    } else {
      bubble.textContent = text;
    }
    messagesEl.appendChild(bubble);
    scrollToBottom();
    return bubble;
  }

  function showTyping() {
    var typing = document.createElement("div");
    typing.className = "yorii-bubble yorii-bubble-assistant yorii-typing";
    typing.innerHTML = "<span></span><span></span><span></span>";
    messagesEl.appendChild(typing);
    scrollToBottom();
    return typing;
  }

  // Offered when Yorii judges the visitor is serious enough to hand off to
  // the internal team — a real choice, not more freeform LLM text, so it's
  // rendered as actual buttons rather than parsed from a reply.
  function appendHandoffOffer() {
    var card = document.createElement("div");
    card.className = "yorii-action-card";

    var question = document.createElement("p");
    question.className = "yorii-action-question";
    question.textContent = "Apakah berkenan disambungkan ke tim internal kami?";
    card.appendChild(question);

    var btnRow = document.createElement("div");
    btnRow.className = "yorii-action-buttons";

    var yesBtn = document.createElement("button");
    yesBtn.type = "button";
    yesBtn.className = "yorii-action-btn yorii-action-yes";
    yesBtn.textContent = "Boleh";

    var noBtn = document.createElement("button");
    noBtn.type = "button";
    noBtn.className = "yorii-action-btn yorii-action-no";
    noBtn.textContent = "Belum";

    btnRow.appendChild(yesBtn);
    btnRow.appendChild(noBtn);
    card.appendChild(btnRow);
    messagesEl.appendChild(card);
    scrollToBottom();

    yesBtn.addEventListener("click", function () {
      card.remove();
      appendLeadForm();
    });

    noBtn.addEventListener("click", function () {
      card.remove();
      appendBubble("assistant", "Oke, no problem! Lanjut aja kalau ada pertanyaan lain ya 😊");
    });
  }

  function appendLeadForm() {
    if (!leadUrl) return;

    var card = document.createElement("div");
    card.className = "yorii-action-card";

    var label = document.createElement("p");
    label.className = "yorii-action-question";
    label.textContent = "Boleh tau dengan siapa saya bicara, dan nomor WhatsApp yang bisa dihubungi?";
    card.appendChild(label);

    var nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "Nama kamu";
    nameInput.className = "yorii-action-input";
    nameInput.maxLength = 255;

    var waInput = document.createElement("input");
    waInput.type = "tel";
    waInput.placeholder = "Nomor WhatsApp";
    waInput.className = "yorii-action-input";
    waInput.maxLength = 50;

    var errorEl = document.createElement("p");
    errorEl.className = "yorii-action-error";
    errorEl.style.display = "none";

    var submitBtn = document.createElement("button");
    submitBtn.type = "button";
    submitBtn.className = "yorii-action-btn yorii-action-yes";
    submitBtn.textContent = "Kirim";

    card.appendChild(nameInput);
    card.appendChild(waInput);
    card.appendChild(errorEl);
    card.appendChild(submitBtn);
    messagesEl.appendChild(card);
    scrollToBottom();
    nameInput.focus();

    var submit = function () {
      var name = nameInput.value.trim();
      var wa = waInput.value.trim();

      if (!name || !wa) {
        errorEl.textContent = "Nama dan nomor WhatsApp wajib diisi ya.";
        errorEl.style.display = "block";
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Mengirim...";
      errorEl.style.display = "none";

      var token = document.querySelector('meta[name="csrf-token"]');
      fetch(leadUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token ? token.getAttribute("content") : "",
          Accept: "application/json",
        },
        body: JSON.stringify({ name: name, whatsapp: wa }),
      })
        .then(function (res) {
          if (!res.ok) throw new Error("failed");
          return res.json();
        })
        .then(function () {
          card.remove();
          appendBubble("assistant", "Sip, makasih " + name + "! Tim kami bakal segera hubungi kamu ya 🤝");
        })
        .catch(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "Kirim";
          errorEl.textContent = "Gagal mengirim, coba lagi ya.";
          errorEl.style.display = "block";
        });
    };

    submitBtn.addEventListener("click", submit);
    waInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") submit();
    });
  }

  function renderHistory() {
    messagesEl.innerHTML = "";
    if (history.length === 0) {
      appendBubble(
        "assistant",
        "Hai! Aku Yorii dari Suddenly Creative Studio 👋 Ada yang bisa aku bantu soal visual production, motion design, 3D, event, atau website & apps?"
      );
    } else {
      history.forEach(function (turn) {
        appendBubble(turn.role, turn.content);
      });
    }
  }

  function openPanel() {
    isOpen = true;
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    if (badge) badge.style.display = "none";
    renderHistory();
    window.setTimeout(function () {
      input.focus();
    }, 100);
  }

  function closePanel() {
    isOpen = false;
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
  }

  launcher.addEventListener("click", function () {
    if (isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closePanel);
    closeBtn.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        closePanel();
      }
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen) {
      closePanel();
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (isSending || !chatUrl) return;

    var text = input.value.trim();
    if (!text) return;

    input.value = "";
    appendBubble("user", text);
    history.push({ role: "user", content: text });
    saveHistory();

    isSending = true;
    var typingEl = showTyping();
    var startedAt = Date.now();
    // Randomized minimum delay before the reply appears, so it reads like
    // someone actually typing back instead of an instant API response dump.
    var minDelay = 900 + Math.random() * 1300;
    var token = document.querySelector('meta[name="csrf-token"]');

    var finishWith = function (reply, offerHandoff) {
      var elapsed = Date.now() - startedAt;
      var wait = Math.max(0, minDelay - elapsed);
      window.setTimeout(function () {
        typingEl.remove();
        appendBubble("assistant", reply);
        history.push({ role: "assistant", content: reply });
        saveHistory();
        isSending = false;
        if (offerHandoff) {
          appendHandoffOffer();
        }
      }, wait);
    };

    fetch(chatUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": token ? token.getAttribute("content") : "",
        Accept: "application/json",
      },
      body: JSON.stringify({
        message: text,
        history: history.slice(0, -1).slice(-20),
      }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        finishWith((data && data.reply) || "Maaf, boleh diulang pertanyaannya?", data && data.offer_handoff);
      })
      .catch(function () {
        finishWith("Maaf, koneksi lagi terganggu. Coba lagi sebentar, atau chat kami langsung lewat WhatsApp.", false);
      });
  });
});
