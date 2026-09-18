document.addEventListener("DOMContentLoaded", function () {
  var videoInput = document.getElementById("videos");
  var postersContainer = document.getElementById("videoPosterInputs");

  if (!videoInput || !postersContainer) {
    return;
  }

  function captureFrame(file) {
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
          var ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          finish(canvas.toDataURL("image/jpeg", 0.8));
        } catch (e) {
          finish("");
        }
      });

      video.addEventListener("error", function () {
        finish("");
      });

      // Safety timeout in case a file never fires the expected events
      window.setTimeout(function () {
        finish("");
      }, 8000);
    });
  }

  videoInput.addEventListener("change", function () {
    postersContainer.innerHTML = "";
    var files = Array.prototype.slice.call(videoInput.files);

    Promise.all(files.map(captureFrame)).then(function (dataUrls) {
      dataUrls.forEach(function (dataUrl) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = "video_posters[]";
        input.value = dataUrl;
        postersContainer.appendChild(input);
      });
    });
  });
});
