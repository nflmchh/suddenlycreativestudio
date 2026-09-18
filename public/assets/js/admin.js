document.addEventListener("DOMContentLoaded", function () {
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

  function capturePosterFrame(file) {
    return new Promise(function (resolve) {
      var video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.src = URL.createObjectURL(file);

      var settled = false;
      var finish = function (dataUrl) {
        if (settled) return;
        settled = true;
        URL.revokeObjectURL(video.src);
        resolve(dataUrl || "");
      };

      video.addEventListener("loadeddata", function () {
        try {
          video.currentTime = Math.min(1, (video.duration || 2) / 2);
        } catch (e) {
          finish("");
        }
      });

      video.addEventListener("seeked", function () {
        try {
          var maxWidth = 480;
          var scale = Math.min(1, maxWidth / video.videoWidth);
          var canvas = document.createElement("canvas");
          canvas.width = video.videoWidth * scale;
          canvas.height = video.videoHeight * scale;
          canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
          finish(canvas.toDataURL("image/jpeg", 0.8));
        } catch (e) {
          finish("");
        }
      });

      video.addEventListener("error", function () {
        finish("");
      });

      window.setTimeout(function () {
        finish("");
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
