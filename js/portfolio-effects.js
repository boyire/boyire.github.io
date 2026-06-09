(function () {
  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hero = document.querySelector(".portfolio-hero");
  var canvas = document.querySelector("[data-portfolio-canvas]");

  document.documentElement.classList.add("effects-ready");

  if (!prefersReduced && "IntersectionObserver" in window) {
    var revealItems = document.querySelectorAll(".section-band, .project-card, .note-item, .about-grid section");
    revealItems.forEach(function (item) {
      item.classList.add("reveal-item");
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  if (!prefersReduced && hero) {
    window.addEventListener("scroll", function () {
      var offset = Math.min(window.scrollY * 0.16, 90);
      hero.style.setProperty("--hero-shift", offset + "px");
    }, { passive: true });
  }

  if (!prefersReduced) {
    document.querySelectorAll(".project-card").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        var rect = card.getBoundingClientRect();
        var x = ((event.clientX - rect.left) / rect.width) * 100;
        var y = ((event.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--mx", x + "%");
        card.style.setProperty("--my", y + "%");
      });
    });
  }

  if (!prefersReduced && canvas && hero) {
    var ctx = canvas.getContext("2d");
    var points = [];
    var width = 0;
    var height = 0;
    var pointer = { x: -9999, y: -9999 };

    function resize() {
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = hero.clientWidth;
      height = hero.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      points = Array.from({ length: Math.min(72, Math.floor(width / 18)) }, function (_, index) {
        return {
          x: (index * 149) % width,
          y: (index * 83) % height,
          vx: ((index % 5) - 2) * 0.08,
          vy: (((index + 2) % 5) - 2) * 0.08
        };
      });
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;
      points.forEach(function (point, index) {
        point.x += point.vx;
        point.y += point.vy;
        if (point.x < 0 || point.x > width) point.vx *= -1;
        if (point.y < 0 || point.y > height) point.vy *= -1;

        var dx = point.x - pointer.x;
        var dy = point.y - pointer.y;
        var pointerDistance = Math.sqrt(dx * dx + dy * dy);
        if (pointerDistance < 130) {
          point.x += dx * 0.006;
          point.y += dy * 0.006;
        }

        for (var i = index + 1; i < points.length; i += 1) {
          var other = points[i];
          var distanceX = point.x - other.x;
          var distanceY = point.y - other.y;
          var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
          if (distance < 118) {
            ctx.strokeStyle = "rgba(215, 184, 75," + (0.16 - distance / 820) + ")";
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = "rgba(255,255,255,0.34)";
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1.25, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    hero.addEventListener("pointermove", function (event) {
      var rect = hero.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    });

    hero.addEventListener("pointerleave", function () {
      pointer.x = -9999;
      pointer.y = -9999;
    });

    window.addEventListener("resize", resize);
    resize();
    draw();
  }
})();
