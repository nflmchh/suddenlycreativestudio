document.addEventListener("DOMContentLoaded", function () {
  var launcher = document.getElementById("suciLauncher");
  var panel = document.getElementById("suciPanel");
  var closeBtn = document.getElementById("suciClose");
  var messagesEl = document.getElementById("suciMessages");
  var form = document.getElementById("suciForm");
  var input = document.getElementById("suciInput");
  var badge = document.getElementById("suciLauncherBadge");

  if (!launcher || !panel || !form || !input || !messagesEl) return;

  var STORAGE_KEY = "suci_chat_history";
  var chatUrl = form.getAttribute("data-chat-url");
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

  function appendBubble(role, text) {
    var bubble = document.createElement("div");
    bubble.className = "suci-bubble suci-bubble-" + role;
    bubble.textContent = text;
    messagesEl.appendChild(bubble);
    scrollToBottom();
    return bubble;
  }

  function showTyping() {
    var typing = document.createElement("div");
    typing.className = "suci-bubble suci-bubble-assistant suci-typing";
    typing.innerHTML = "<span></span><span></span><span></span>";
    messagesEl.appendChild(typing);
    scrollToBottom();
    return typing;
  }

  function renderHistory() {
    messagesEl.innerHTML = "";
    if (history.length === 0) {
      appendBubble(
        "assistant",
        "Hai! Aku Suci dari Suddenly Creative Studio 👋 Ada yang bisa aku bantu soal visual production, motion design, 3D, event, atau website & apps?"
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

    var finishWith = function (reply) {
      var elapsed = Date.now() - startedAt;
      var wait = Math.max(0, minDelay - elapsed);
      window.setTimeout(function () {
        typingEl.remove();
        appendBubble("assistant", reply);
        history.push({ role: "assistant", content: reply });
        saveHistory();
        isSending = false;
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
        finishWith((data && data.reply) || "Maaf, boleh diulang pertanyaannya?");
      })
      .catch(function () {
        finishWith("Maaf, koneksi lagi terganggu. Coba lagi sebentar, atau chat kami langsung lewat WhatsApp.");
      });
  });
});
