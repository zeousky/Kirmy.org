/* Fullscreen video playback.
 *
 * The markup asks for autoplay without `muted`, so browsers that allow it
 * start the video with sound. Every other browser blocks that until the
 * visitor interacts, which would leave a frozen first frame, so we catch the
 * rejection and restart the video muted. Muted autoplay is always allowed.
 *
 * Once the visitor does interact we try to bring the sound back, silently.
 * There is no visible control anywhere on the page. */

(function () {
  "use strict";

  var video = document.querySelector(".site-video");
  if (!video) return;

  function play() {
    var attempt = video.play();
    if (attempt && typeof attempt.catch === "function") {
      return attempt;
    }
    return null;
  }

  /* Play with sound, falling back to muted playback if the browser refuses. */
  function playWithSound() {
    var attempt = play();
    if (!attempt) return;

    attempt.catch(function () {
      video.muted = true;
      var retry = play();
      if (retry) retry.catch(function () {});
    });
  }

  /* Start as soon as there is something to show; if metadata is already
     buffered (fast cache hit) just go. */
  if (video.readyState >= 2) {
    playWithSound();
  } else {
    video.addEventListener("loadeddata", playWithSound, { once: true });
    video.addEventListener("canplay", playWithSound, { once: true });
  }

  /* Mobile browsers pause backgrounded video and do not always resume it. */
  document.addEventListener("visibilitychange", function () {
    if (document.hidden || !video.paused) return;

    var attempt = play();
    if (attempt) {
      attempt.catch(function () {
        video.muted = true;
        var retry = play();
        if (retry) retry.catch(function () {});
      });
    }
  });

  /* Recover the sound on the first interaction, then stop listening.
     If unmuting is refused again, settle for muted. */
  var restored = false;

  function restoreSound() {
    if (restored || !video.muted) return;
    restored = true;

    video.muted = false;
    var attempt = play();
    if (!attempt) return;

    attempt.catch(function () {
      video.muted = true;
      var retry = play();
      if (retry) retry.catch(function () {});
    });
  }

  ["pointerdown", "keydown", "touchstart"].forEach(function (type) {
    document.addEventListener(type, restoreSound, { once: true, passive: true });
  });
})();
