document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("eventForm");
  if (!form) {
    return;
  }

  var videoInput = document.getElementById("videos");
  var imageInput = document.getElementById("images");
  var postersContainer = document.getElementById("videoPosterInputs");
  var progressWrap = document.getElementById("uploadProgress");
  var progressBar = document.getElementById("uploadProgressBar");
  var progressLabel = document.getElementById("uploadProgressLabel");
  var submitBtn = form.querySelector('button[type="submit"]');

  var VIDEO_COMPRESS_THRESHOLD = 15 * 1024 * 1024; // 15MB — smaller files skip compression
  var VIDEO_HARD_LIMIT = 180 * 1024 * 1024; // above this, browser WASM is too slow/unreliable — upload raw instead
  var COMPRESS_TIMEOUT_MS = 3 * 60 * 1000; // if compression itself hangs, bail out and upload raw
  var IMAGE_RESIZE_THRESHOLD = 2 * 1024 * 1024; // 2MB
  var IMAGE_MAX_DIMENSION = 1920;

  var ffmpegInstance = null;

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

  function loadFfmpeg() {
    if (ffmpegInstance) {
      return Promise.resolve(ffmpegInstance);
    }

    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = "https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg.js";
      script.onload = function () {
        try {
          var ffmpeg = new window.FFmpegWASM.FFmpeg();
          ffmpeg
            .load({
              coreURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js",
              wasmURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm",
            })
            .then(function () {
              ffmpegInstance = ffmpeg;
              resolve(ffmpeg);
            })
            .catch(reject);
        } catch (e) {
          reject(e);
        }
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function compressVideo(file, index, total, onProgress) {
    if (file.size <= VIDEO_COMPRESS_THRESHOLD) {
      return Promise.resolve(file);
    }

    if (file.size > VIDEO_HARD_LIMIT) {
      onProgress(0, "melewati kompresi (file sangat besar, diupload apa adanya)");
      return Promise.resolve(file);
    }

    var compressPromise = loadFfmpeg()
      .then(function (ffmpeg) {
        var inputName = "in_" + index + "_" + Date.now() + ".mp4";
        var outputName = "out_" + index + "_" + Date.now() + ".mp4";

        var handler = function (evt) {
          var pct = Math.round((evt.progress || 0) * 100);
          onProgress(pct, "Mengompres video " + (index + 1) + " dari " + total + "... " + pct + "%");
        };
        ffmpeg.on("progress", handler);

        return file
          .arrayBuffer()
          .then(function (buf) {
            return ffmpeg.writeFile(inputName, new Uint8Array(buf));
          })
          .then(function () {
            return ffmpeg.exec([
              "-i", inputName,
              "-vf", "scale='min(1280,iw)':-2",
              "-c:v", "libx264",
              "-preset", "veryfast",
              "-crf", "28",
              "-c:a", "aac",
              "-b:a", "128k",
              "-movflags", "+faststart",
              outputName,
            ]);
          })
          .then(function () {
            return ffmpeg.readFile(outputName);
          })
          .then(function (data) {
            ffmpeg.off("progress", handler);
            try {
              ffmpeg.deleteFile(inputName);
              ffmpeg.deleteFile(outputName);
            } catch (e) {
              /* noop */
            }
            var blob = new Blob([data.buffer], { type: "video/mp4" });
            var newName = file.name.replace(/\.[^.]+$/, "") + "-compressed.mp4";
            return new File([blob], newName, { type: "video/mp4" });
          });
      })
      .catch(function (err) {
        console.warn("Kompresi video gagal, upload file asli:", err);
        return file;
      });

    var timeoutPromise = new Promise(function (resolve) {
      window.setTimeout(function () {
        onProgress(0, "Kompresi terlalu lama, mengupload file asli...");
        resolve(file);
      }, COMPRESS_TIMEOUT_MS);
    });

    return Promise.race([compressPromise, timeoutPromise]);
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
    setProgress(0, "Menyiapkan file...");

    var videoFiles = videoInput ? Array.prototype.slice.call(videoInput.files) : [];
    var imageFiles = imageInput ? Array.prototype.slice.call(imageInput.files) : [];

    var posterPromise = Promise.all(videoFiles.map(capturePosterFrame));

    var compressedVideosPromise = videoFiles.reduce(function (chain, file, index) {
      return chain.then(function (results) {
        return compressVideo(file, index, videoFiles.length, function (pct, label) {
          setProgress(pct, label);
        }).then(function (compressed) {
          results.push(compressed);
          return results;
        });
      });
    }, Promise.resolve([]));

    var resizedImagesPromise = Promise.all(imageFiles.map(resizeImage));

    Promise.all([compressedVideosPromise, resizedImagesPromise, posterPromise])
      .then(function (results) {
        var compressedVideos = results[0];
        var resizedImages = results[1];
        var posters = results[2];

        setProgress(0, "Mengupload...");

        var formData = new FormData(form);
        formData.delete("videos[]");
        formData.delete("images[]");
        formData.delete("video_posters[]");

        compressedVideos.forEach(function (file) {
          formData.append("videos[]", file);
        });
        resizedImages.forEach(function (file) {
          formData.append("images[]", file);
        });
        posters.forEach(function (dataUrl) {
          formData.append("video_posters[]", dataUrl);
        });

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

  // Fallback: still populate hidden poster inputs immediately on file
  // selection so a non-JS-driven view of the form state stays sane.
  if (videoInput && postersContainer) {
    videoInput.addEventListener("change", function () {
      postersContainer.innerHTML = "";
    });
  }
});
