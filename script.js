(function () {
  "use strict";

  /* ===== CANVAS — scroll-synced frame animation ===== */
  var canvas = document.getElementById("bgCanvas");
  var ctx = canvas.getContext("2d");
  var TOTAL = 136;
  var frames = [];
  var loaded = 0;
  var cur = -1;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (cur >= 0) draw(cur);
  }
  window.addEventListener("resize", resize);
  resize();

  for (var i = 1; i <= TOTAL; i++) {
    var img = new Image();
    img.src = "resource/ezgif-frame-" + String(i).padStart(3, "0") + ".jpg";
    img.onload = function () {
      loaded++;
      if (loaded === TOTAL) { draw(0); onScroll(); }
    };
    frames.push(img);
  }

  function draw(idx) {
    if (!frames[idx] || !frames[idx].complete) return;
    cur = idx;
    var im = frames[idx];
    var cw = canvas.width, ch = canvas.height;
    var sc = Math.max(cw / im.naturalWidth, ch / im.naturalHeight);
    var dw = im.naturalWidth * sc, dh = im.naturalHeight * sc;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(im, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }

  /* ===== SCROLL HANDLER — pearl-synced ===== */
  /*
    The pearl travels from ~8% to ~92% of viewport height
    across the 136 frames. Content items reveal when
    they scroll up to meet the pearl's current Y position.
  */
  var lastScrollTop = 0;
  function onScroll() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docH > 0 ? Math.min(scrollY / docH, 1) : 0;

    /* Sync frame to scroll */
    var frameIdx = Math.min(Math.floor(progress * TOTAL), TOTAL - 1);
    if (frameIdx !== cur) draw(frameIdx);

    /* Pearl Y position on viewport (top=8%, bottom=92%) */
    var vh = window.innerHeight;
    var pearlY = (0.08 + progress * 0.84) * vh;

    /* Reveal items when their top reaches the pearl's Y level */
    var items = document.querySelectorAll(".item");
    for (var j = 0; j < items.length; j++) {
      var item = items[j];
      if (item.classList.contains('no-sync')) {
        item.classList.add("visible");
      } else {
        var rect = item.getBoundingClientRect();
        var itemCenter = rect.top + rect.height * 0.3;
        if (pearlY >= itemCenter - vh * 0.1) {
          item.classList.add("visible");
        }
      }
    }

    /* Hide/show navbar on scroll */
    var navbar = document.querySelector('.navbar');
    if (scrollY > lastScrollTop && scrollY > 100) {
      navbar.classList.add('hidden');
    } else {
      navbar.classList.remove('hidden');
    }
    lastScrollTop = scrollY;
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  /* ===== MOBILE MENU ===== */
  var mobBtn = document.getElementById("mobBtn");
  var mobMenu = document.getElementById("mobMenu");
  if (mobBtn && mobMenu) {
    mobBtn.addEventListener("click", function () {
      mobMenu.classList.toggle("open");
    });
    mobMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { mobMenu.classList.remove("open"); });
    });
  }
})();
