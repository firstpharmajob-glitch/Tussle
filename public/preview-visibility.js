(() => {
  let visible = true;
  let animation = null;
  let framePending = false;

  function schedule() {
    if (!animation || !visible || document.hidden || framePending) return;

    framePending = true;
    requestAnimationFrame((time) => {
      framePending = false;
      if (!visible || document.hidden) return;
      animation(time);
      schedule();
    });
  }

  window.tussleStartPreview = (callback) => {
    animation = callback;
    schedule();
  };

  window.addEventListener("message", (event) => {
    if (event.origin !== location.origin || event.data?.type !== "tussle:visibility") return;
    visible = Boolean(event.data.visible);
    schedule();
  });

  document.addEventListener("visibilitychange", schedule);
})();
