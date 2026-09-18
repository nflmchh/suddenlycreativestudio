document.addEventListener("DOMContentLoaded", function () {
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
