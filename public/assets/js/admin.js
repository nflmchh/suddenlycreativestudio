document.addEventListener("DOMContentLoaded", function () {
  // Push notifications — lets the admin (using "Add to Home Screen" on
  // Safari/iOS) get notified on their phone whenever Suci captures a lead.
  var pushBtn = document.getElementById("pushToggleBtn");
  var pushBanner = document.getElementById("pushStatusBanner");

  function showPushBanner(message) {
    if (!pushBanner) return;
    pushBanner.textContent = message;
    pushBanner.style.display = "block";
  }

  function urlBase64ToUint8Array(base64String) {
    var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    var base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);
    for (var i = 0; i < rawData.length; i++) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  if (pushBtn && "serviceWorker" in navigator && "PushManager" in window) {
    var subscribeUrl = pushBtn.getAttribute("data-subscribe-url");
    var unsubscribeUrl = pushBtn.getAttribute("data-unsubscribe-url");
    var publicKeyUrl = pushBtn.getAttribute("data-public-key-url");
    var csrfToken = document.querySelector('meta[name="csrf-token"]');

    function setButtonState(isSubscribed) {
      pushBtn.innerHTML = isSubscribed
        ? '<i class="ph-fill ph-bell-ringing"></i> Notifikasi Aktif'
        : '<i class="ph ph-bell"></i> Aktifkan Notifikasi';
      pushBtn.dataset.subscribed = isSubscribed ? "1" : "0";
    }

    navigator.serviceWorker
      .register("/sw.js")
      .then(function (registration) {
        return registration.pushManager.getSubscription().then(function (sub) {
          setButtonState(!!sub);
        });
      })
      .catch(function () {
        /* service worker registration failed — button stays in default state */
      });

    pushBtn.addEventListener("click", function () {
      if (pushBtn.dataset.subscribed === "1") {
        navigator.serviceWorker.ready.then(function (registration) {
          registration.pushManager.getSubscription().then(function (sub) {
            if (!sub) return;
            var endpoint = sub.endpoint;
            sub.unsubscribe().then(function () {
              fetch(unsubscribeUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrfToken ? csrfToken.getAttribute("content") : "" },
                body: JSON.stringify({ endpoint: endpoint }),
              }).finally(function () {
                setButtonState(false);
                showPushBanner("Notifikasi dimatikan di perangkat ini.");
              });
            });
          });
        });
        return;
      }

      Notification.requestPermission().then(function (permission) {
        if (permission !== "granted") {
          showPushBanner("Izin notifikasi ditolak. Aktifkan lewat pengaturan browser/HP kalau berubah pikiran.");
          return;
        }

        fetch(publicKeyUrl)
          .then(function (res) {
            return res.json();
          })
          .then(function (data) {
            if (!data.publicKey) {
              showPushBanner("Notifikasi belum dikonfigurasi di server (VAPID key belum diisi).");
              return;
            }
            return navigator.serviceWorker.ready.then(function (registration) {
              return registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(data.publicKey),
              });
            });
          })
          .then(function (subscription) {
            if (!subscription) return;
            return fetch(subscribeUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrfToken ? csrfToken.getAttribute("content") : "" },
              body: JSON.stringify(subscription.toJSON()),
            }).then(function () {
              setButtonState(true);
              showPushBanner("Notifikasi aktif di perangkat ini — kamu akan dapat notif kalau ada lead baru dari Suci.");
            });
          })
          .catch(function () {
            showPushBanner("Gagal mengaktifkan notifikasi. Pastikan situs ini sudah di-“Add to Home Screen” dan dibuka dari sana (khusus iPhone/Safari).");
          });
      });
    });
  } else if (pushBtn) {
    pushBtn.style.display = "none";
  }

  // Show the "Demo URL" field only for Web & Apps Development events —
  // it's not relevant for visual/event categories.
  var categorySelect = document.getElementById("category");
  var demoUrlField = document.getElementById("demoUrlField");
  if (categorySelect && demoUrlField) {
    var toggleDemoUrlField = function () {
      demoUrlField.style.display = categorySelect.value === "web-apps" ? "" : "none";
    };
    categorySelect.addEventListener("change", toggleDemoUrlField);
    toggleDemoUrlField();
  }

  // Client logos — WebP/SVG get converted to PNG in the browser before
  // upload, since GD on this host can't decode WebP at all and SVG mime
  // sniffing is unreliable server-side. Rasterizing here also strips any
  // script content an SVG might carry, since it's redrawn onto a canvas.
  var clientLogosForm = document.getElementById("clientLogosForm");
  if (clientLogosForm) {
    var logosInput = document.getElementById("logos");

    var convertToPngIfNeeded = function (file) {
      var needsConversion =
        file.type === "image/webp" ||
        file.type === "image/svg+xml" ||
        /\.(webp|svg)$/i.test(file.name);

      if (!needsConversion) {
        return Promise.resolve(file);
      }

      return new Promise(function (resolve) {
        var img = new Image();
        img.onload = function () {
          var width = img.naturalWidth || 480;
          var height = img.naturalHeight || 480;
          var canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d").drawImage(img, 0, 0, width, height);
          URL.revokeObjectURL(img.src);

          canvas.toBlob(function (blob) {
            if (!blob) {
              resolve(file);
              return;
            }
            var newName = file.name.replace(/\.[^.]+$/, "") + ".png";
            resolve(new File([blob], newName, { type: "image/png" }));
          }, "image/png");
        };
        img.onerror = function () {
          resolve(file);
        };
        img.src = URL.createObjectURL(file);
      });
    };

    clientLogosForm.addEventListener("submit", function (e) {
      if (!logosInput || !logosInput.files.length || clientLogosForm.dataset.converted === "1") {
        return;
      }

      e.preventDefault();
      var submitBtn = clientLogosForm.querySelector('button[type="submit"]');
      var originalLabel = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Memproses logo...";
      }

      Promise.all(Array.prototype.slice.call(logosInput.files).map(convertToPngIfNeeded)).then(function (files) {
        var dataTransfer = new DataTransfer();
        files.forEach(function (file) {
          dataTransfer.items.add(file);
        });
        logosInput.files = dataTransfer.files;
        clientLogosForm.dataset.converted = "1";
        clientLogosForm.submit();
      }).catch(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
        clientLogosForm.dataset.converted = "1";
        clientLogosForm.submit();
      });
    });
  }

  function regeneratePoster(btn) {
    var figure = btn.closest("figure");
    var videoSrc = figure ? figure.getAttribute("data-video-src") : null;
    var postUrl = btn.getAttribute("data-media-poster-url");
    if (!videoSrc || !postUrl) {
      return Promise.resolve({ ok: false, message: "Data video tidak ditemukan di halaman." });
    }

    var originalLabel = btn.textContent;
    var failReason = "";
    btn.disabled = true;
    btn.textContent = "Memproses...";

    return fetch(videoSrc)
      .then(function (res) {
        if (!res.ok) {
          throw new Error("Video gagal diambil dari server (status " + res.status + ")");
        }
        return res.blob();
      })
      .then(function (blob) {
        return capturePosterFrame(blob, function (why) {
          failReason = why;
        });
      })
      .then(function (dataUrl) {
        if (!dataUrl) {
          throw new Error(failReason || "Tidak diketahui");
        }
        var token = document.querySelector('meta[name="csrf-token"]');
        return fetch(postUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": token ? token.getAttribute("content") : "",
            Accept: "application/json",
          },
          body: JSON.stringify({ poster: dataUrl }),
        });
      })
      .then(function (res) {
        if (res.ok) return res.json();
        return res
          .json()
          .catch(function () {
            return {};
          })
          .then(function (data) {
            throw new Error(data.message || "Server menolak (status " + res.status + ")");
          });
      })
      .then(function (data) {
        var img = figure.querySelector(".media-thumb-img");
        if (img && data.poster_url) {
          img.src = data.poster_url + "?t=" + Date.now();
        }
        btn.textContent = originalLabel;
        btn.disabled = false;
        return { ok: true };
      })
      .catch(function (err) {
        btn.textContent = originalLabel;
        btn.disabled = false;
        return { ok: false, message: err.message };
      });
  }

  document.querySelectorAll(".regenerate-poster-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      regeneratePoster(btn).then(function (result) {
        if (!result.ok) {
          alert("Gagal membuat thumbnail:\n" + result.message + "\n\nScreenshot pesan ini kalau perlu dikirim untuk diperbaiki.");
        }
      });
    });
  });

  var regenerateAllBtn = document.getElementById("regenerateAllPostersBtn");
  if (regenerateAllBtn) {
    regenerateAllBtn.addEventListener("click", function () {
      var buttons = Array.prototype.slice.call(document.querySelectorAll(".regenerate-poster-btn"));
      var errors = [];
      var originalLabel = regenerateAllBtn.textContent;
      regenerateAllBtn.disabled = true;

      buttons
        .reduce(function (chain, btn, index) {
          return chain.then(function () {
            regenerateAllBtn.textContent = "Memproses (" + (index + 1) + "/" + buttons.length + ")...";
            return regeneratePoster(btn).then(function (result) {
              if (!result.ok) {
                errors.push(index + 1 + ". " + result.message);
              }
            });
          });
        }, Promise.resolve())
        .then(function () {
          regenerateAllBtn.disabled = false;
          regenerateAllBtn.textContent = originalLabel;
          if (errors.length) {
            alert("Selesai, tapi " + errors.length + " video gagal dibuat thumbnail-nya:\n" + errors.join("\n"));
          }
        });
    });
  }

  // Manual thumbnail upload — a guaranteed fallback that doesn't depend on
  // the browser being able to decode the video at all. Take a screenshot
  // of the video (or export a frame in QuickTime Player) and upload it here.
  document.querySelectorAll(".manual-poster-input").forEach(function (input) {
    input.addEventListener("change", function () {
      var file = input.files[0];
      if (!file) return;

      var postUrl = input.getAttribute("data-media-poster-url");
      var figure = input.closest("figure");
      var token = document.querySelector('meta[name="csrf-token"]');

      var formData = new FormData();
      formData.append("poster_image", file);

      input.disabled = true;

      fetch(postUrl, {
        method: "POST",
        headers: {
          "X-CSRF-TOKEN": token ? token.getAttribute("content") : "",
          Accept: "application/json",
        },
        body: formData,
      })
        .then(function (res) {
          if (res.ok) return res.json();
          return res
            .json()
            .catch(function () {
              return {};
            })
            .then(function (data) {
              throw new Error(data.message || "Server menolak (status " + res.status + ")");
            });
        })
        .then(function (data) {
          var img = figure.querySelector(".media-thumb-img");
          if (img && data.poster_url) {
            img.src = data.poster_url + "?t=" + Date.now();
          }
          input.disabled = false;
          input.value = "";
        })
        .catch(function (err) {
          alert("Gagal upload thumbnail manual: " + err.message);
          input.disabled = false;
          input.value = "";
        });
    });
  });

  var form = document.getElementById("eventForm");
  if (!form) {
    return;
  }

  var videoInput = document.getElementById("videos");
  var imageInput = document.getElementById("images");
  var progressWrap = document.getElementById("uploadProgress");
  var progressBar = document.getElementById("uploadProgressBar");
  var progressLabel = document.getElementById("uploadProgressLabel");
  var submitBtn = form.querySelector('button[type="submit"]');

  var IMAGE_RESIZE_THRESHOLD = 2 * 1024 * 1024; // 2MB
  var IMAGE_MAX_DIMENSION = 1920;

  function setProgress(percent, label) {
    if (!progressWrap) return;
    progressWrap.style.display = "block";
    progressBar.style.width = Math.max(0, Math.min(100, percent)) + "%";
    progressLabel.textContent = label;
  }

  function hideProgress() {
    if (!progressWrap) return;
    progressWrap.style.display = "none";
  }

  function resizeImage(file) {
    if (file.size <= IMAGE_RESIZE_THRESHOLD) {
      return Promise.resolve(file);
    }

    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        var scale = Math.min(1, IMAGE_MAX_DIMENSION / Math.max(img.width, img.height));
        var canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(img.src);

        canvas.toBlob(
          function (blob) {
            if (!blob) {
              resolve(file);
              return;
            }
            var newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
            resolve(new File([blob], newName, { type: "image/jpeg" }));
          },
          "image/jpeg",
          0.85
        );
      };
      img.onerror = function () {
        resolve(file);
      };
      img.src = URL.createObjectURL(file);
    });
  }

  function capturePosterFrame(file, onReason) {
    return new Promise(function (resolve) {
      var settled = false;
      var report = function (why) {
        if (onReason) onReason(why);
      };

      // Safari frequently never fires loadeddata/seeked on a <video> that
      // isn't attached to the document, leaving the frame capture stuck
      // until the timeout — so it's appended (invisibly) to the DOM here,
      // and both "seeked" and "timeupdate" can trigger the grab since
      // Safari doesn't always fire "seeked" reliably either.
      var video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.preload = "auto";
      video.style.cssText = "position:fixed; top:0; left:0; width:2px; height:2px; opacity:0; pointer-events:none;";
      document.body.appendChild(video);

      var finish = function (dataUrl, why) {
        if (settled) return;
        settled = true;
        URL.revokeObjectURL(video.src);
        if (video.parentNode) video.parentNode.removeChild(video);
        if (!dataUrl) report(why || "Tidak diketahui");
        resolve(dataUrl || "");
      };

      var grabFrame = function () {
        if (settled) return;
        try {
          if (!video.videoWidth) return;
          var maxWidth = 480;
          var scale = Math.min(1, maxWidth / video.videoWidth);
          var canvas = document.createElement("canvas");
          canvas.width = video.videoWidth * scale;
          canvas.height = video.videoHeight * scale;
          canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
          finish(canvas.toDataURL("image/jpeg", 0.8));
        } catch (e) {
          finish("", "Gagal menggambar frame ke canvas: " + e.message);
        }
      };

      video.addEventListener("loadedmetadata", function () {
        try {
          video.currentTime = Math.min(1, (video.duration || 2) / 2);
        } catch (e) {
          /* timeupdate below still catches the frame once buffered */
        }
      });

      video.addEventListener("seeked", grabFrame);
      video.addEventListener("timeupdate", function () {
        // Ignore the very first frames of playback so this doesn't grab a
        // black/blank intro frame before the seek-to-middle above lands.
        if (video.currentTime > 0.15) {
          grabFrame();
        }
      });

      video.addEventListener("error", function () {
        var code = video.error ? video.error.code : "?";
        finish("", "Video tidak bisa dibaca browser (kode error " + code + ") — kemungkinan format/codec tidak didukung.");
      });

      video.src = URL.createObjectURL(file);
      video.load();
      var playAttempt = video.play();
      if (playAttempt && playAttempt.catch) {
        playAttempt.catch(function () {});
      }

      window.setTimeout(function () {
        finish("", "Waktu habis (8 detik) — video tidak kunjung termuat di browser (readyState=" + video.readyState + ", networkState=" + video.networkState + ").");
      }, 8000);
    });
  }

  function uploadWithProgress(formData, url) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      xhr.setRequestHeader("Accept", "application/json");

      xhr.upload.addEventListener("progress", function (e) {
        if (e.lengthComputable) {
          var pct = Math.round((e.loaded / e.total) * 100);
          setProgress(pct, "Mengupload... " + pct + "%");
        }
      });

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400) {
          resolve(xhr);
        } else {
          reject(xhr);
        }
      };
      xhr.onerror = function () {
        reject(xhr);
      };

      xhr.send(formData);
    });
  }

  function showErrors(xhr) {
    var message = "Terjadi kesalahan saat menyimpan. Coba lagi.";
    try {
      var data = JSON.parse(xhr.responseText);
      if (data.message) {
        message = data.message;
      }
      if (data.errors) {
        message = Object.values(data.errors).flat().join(" ");
      }
    } catch (e) {
      /* keep default message */
    }
    alert(message);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (submitBtn) submitBtn.disabled = true;
    setProgress(0, "Menyiapkan foto & thumbnail video...");

    var videoFiles = videoInput ? Array.prototype.slice.call(videoInput.files) : [];
    var imageFiles = imageInput ? Array.prototype.slice.call(imageInput.files) : [];

    // Capture posters one at a time — doing all of them in parallel makes
    // the browser decode many videos at once and several silently time out.
    var posterPromise = videoFiles.reduce(function (chain, file, index) {
      return chain.then(function (results) {
        setProgress(0, "Membuat thumbnail video " + (index + 1) + " dari " + videoFiles.length + "...");
        return capturePosterFrame(file).then(function (dataUrl) {
          results.push(dataUrl);
          return results;
        });
      });
    }, Promise.resolve([]));

    var resizedImagesPromise = Promise.all(imageFiles.map(resizeImage));

    Promise.all([resizedImagesPromise, posterPromise])
      .then(function (results) {
        var resizedImages = results[0];
        var posters = results[1];

        var formData = new FormData(form);
        formData.delete("images[]");
        formData.delete("video_posters[]");

        resizedImages.forEach(function (file) {
          formData.append("images[]", file);
        });
        posters.forEach(function (dataUrl) {
          formData.append("video_posters[]", dataUrl);
        });

        setProgress(0, "Mengupload... 0%");

        return uploadWithProgress(formData, form.action);
      })
      .then(function (xhr) {
        setProgress(100, "Selesai!");
        var redirectUrl = "/admin";
        try {
          var data = JSON.parse(xhr.responseText);
          if (data.redirect) {
            redirectUrl = data.redirect;
          }
        } catch (e) {
          /* fall back to default */
        }
        window.location.href = redirectUrl;
      })
      .catch(function (xhr) {
        hideProgress();
        if (submitBtn) submitBtn.disabled = false;
        if (xhr && xhr.status) {
          showErrors(xhr);
        } else {
          alert("Upload gagal. Periksa koneksi internet Anda dan coba lagi.");
        }
      });
  });
});
