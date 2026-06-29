/* Cat Puzzle Box — download handler
 * Fetches all six SVGs in parallel, zips them with JSZip, and triggers
 * a browser download. No build step; JSZip is loaded from a CDN. */

(function () {
  "use strict";

  var FILES = [
    "box-svg/top.svg",
    "box-svg/bottom.svg",
    "box-svg/sides.svg",
    "box-svg/sandpaper-top.svg",
    "box-svg/sandpaper-bottom.svg",
    "box-svg/sandpaper-sides.svg"
  ];
  var ZIP_NAME = "cat-puzzle-box-svgs.zip";
  var FOLDER_NAME = "cat-puzzle-box";
  var BASENAME_RE = /^box-svg\//;

  var btn = document.getElementById("download");
  var status = document.getElementById("download-status");
  if (!btn) return;

  var mainLabel = btn.querySelector(".download-btn__main");
  var subLabel = btn.querySelector(".download-btn__sub");
  var idleMain = mainLabel ? mainLabel.textContent : "Download";
  var idleSub = subLabel ? subLabel.textContent : "";

  function setBusy(busy) {
    btn.disabled = busy;
    if (!mainLabel) return;
    if (busy) {
      mainLabel.textContent = "Zipping\u2026";
      if (subLabel) subLabel.textContent = "fetching 6 files";
    } else {
      mainLabel.textContent = idleMain;
      if (subLabel) subLabel.textContent = idleSub;
    }
  }

  function setStatus(msg, state) {
    if (!status) return;
    status.textContent = msg || "";
    if (state) {
      status.dataset.state = state;
    } else {
      delete status.dataset.state;
    }
  }

  function reportUnavailable() {
    btn.disabled = true;
    if (mainLabel) mainLabel.textContent = "Download unavailable";
    if (subLabel) subLabel.textContent = "JSZip failed to load";
    setStatus("The zip library could not be loaded. Refresh, or check your network.", "error");
  }

  if (typeof JSZip === "undefined") {
    reportUnavailable();
    return;
  }

  btn.addEventListener("click", function () {
    setBusy(true);
    setStatus("");

    var zip = new JSZip();
    var folder = zip.folder(FOLDER_NAME);

    Promise.all(
      FILES.map(function (path) {
        return fetch(path, { credentials: "same-origin" })
          .then(function (r) {
            if (!r.ok) {
              throw new Error(path + " \u2192 HTTP " + r.status);
            }
            return r.text();
          })
          .then(function (text) {
            folder.file(path.replace(BASENAME_RE, ""), text);
          });
      })
    )
      .then(function () {
        return zip.generateAsync({
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: { level: 6 }
        });
      })
      .then(function (blob) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = ZIP_NAME;
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
        // Defer revoke so the download can start
        setTimeout(function () { URL.revokeObjectURL(url); }, 0);
        setStatus("Downloaded " + ZIP_NAME + " (" + FILES.length + " files).", "ok");
      })
      .catch(function (err) {
        var msg = (err && err.message) ? err.message : "Unknown error.";
        setStatus("Couldn't build the zip: " + msg, "error");
      })
      .then(function () {
        setBusy(false);
      });
  });
})();
