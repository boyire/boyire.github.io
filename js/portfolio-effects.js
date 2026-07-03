(function () {
  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isCoarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  var hero = document.querySelector(".portfolio-hero");
  var canvas = document.querySelector("[data-portfolio-canvas]");
  var ticking = false;

  document.documentElement.classList.add("effects-ready");

  if (!prefersReduced && "IntersectionObserver" in window) {
    var revealItems = document.querySelectorAll(".section-band, .project-card, .skill-card, .timeline-item, .writing-category, .note-item, .about-grid section");
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
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var offset = Math.min(window.scrollY * 0.16, 90);
        var scan = Math.min(window.scrollY * 0.08 - 45, 115);
        hero.style.setProperty("--hero-shift", offset + "px");
        hero.style.setProperty("--scan-x", scan + "%");
        ticking = false;
      });
    }, { passive: true });

    hero.addEventListener("pointermove", function (event) {
      var rect = hero.getBoundingClientRect();
      hero.style.setProperty("--hero-x", ((event.clientX - rect.left) / rect.width) * 100 + "%");
      hero.style.setProperty("--hero-y", ((event.clientY - rect.top) / rect.height) * 100 + "%");
    });
  }

  if (!prefersReduced && !isCoarsePointer) {
    document.querySelectorAll(".project-card").forEach(function (card) {
      var cardTicking = false;

      card.addEventListener("pointermove", function (event) {
        if (cardTicking) return;
        cardTicking = true;
        requestAnimationFrame(function () {
          var rect = card.getBoundingClientRect();
          var x = ((event.clientX - rect.left) / rect.width) * 100;
          var y = ((event.clientY - rect.top) / rect.height) * 100;
          card.style.setProperty("--mx", x + "%");
          card.style.setProperty("--my", y + "%");
          var rotateX = (50 - y) * 0.035;
          var rotateY = (x - 50) * 0.035;
          card.style.transform = "translateY(" + (card.matches(":nth-child(2)") ? "12px" : "-4px") + ") rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)";
          cardTicking = false;
        });
      });

      card.addEventListener("pointerleave", function () {
        card.style.transform = "";
      });
    });
  }

  if (!prefersReduced && canvas && hero) {
    var ctx = canvas.getContext("2d");
    var points = [];
    var meteors = [];
    var width = 0;
    var height = 0;
    var pointer = { x: -9999, y: -9999 };
    var frame = 0;
    var rafId = 0;
    var hidden = false;

    function resize() {
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = hero.clientWidth;
      height = hero.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      var pointCount = isCoarsePointer ? Math.min(54, Math.floor(width / 18)) : Math.min(118, Math.floor(width / 12));
      points = Array.from({ length: pointCount }, function (_, index) {
        return {
          x: (index * 149) % width,
          y: (index * 83) % height,
          vx: ((index % 7) - 3) * (isCoarsePointer ? 0.06 : 0.1),
          vy: (((index + 2) % 7) - 3) * (isCoarsePointer ? 0.06 : 0.1),
          r: 0.8 + (index % 4) * 0.32,
          hue: index % 3
        };
      });
      meteors = Array.from({ length: isCoarsePointer ? 2 : 5 }, function (_, index) {
        return {
          x: (index * 313) % width,
          y: -80 - index * 110,
          vx: 2.2 + index * 0.22,
          vy: 1.4 + index * 0.18,
          len: 90 + index * 18
        };
      });
    }

    function draw() {
      if (hidden) return;
      frame += 1;
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;

      var pulse = (Math.sin(frame * 0.028) + 1) / 2;

      var pointerGradient = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 170);
      pointerGradient.addColorStop(0, "rgba(215,184,75,0.22)");
      pointerGradient.addColorStop(0.48, "rgba(124,92,255,0.12)");
      pointerGradient.addColorStop(1, "rgba(124,92,255,0)");
      ctx.fillStyle = pointerGradient;
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 170, 0, Math.PI * 2);
      ctx.fill();

      meteors.forEach(function (meteor) {
        meteor.x += meteor.vx;
        meteor.y += meteor.vy;
        if (meteor.x > width + meteor.len || meteor.y > height + meteor.len) {
          meteor.x = -meteor.len - Math.random() * width * 0.35;
          meteor.y = -60 - Math.random() * height * 0.45;
        }
        var gradient = ctx.createLinearGradient(meteor.x, meteor.y, meteor.x - meteor.len, meteor.y - meteor.len * 0.45);
        gradient.addColorStop(0, "rgba(255,255,255,0.7)");
        gradient.addColorStop(0.35, "rgba(215,184,75,0.24)");
        gradient.addColorStop(1, "rgba(17,138,178,0)");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(meteor.x - meteor.len, meteor.y - meteor.len * 0.45);
        ctx.stroke();
      });

      ctx.lineWidth = 1;
      points.forEach(function (point, index) {
        point.x += point.vx;
        point.y += point.vy;
        if (point.x < 0 || point.x > width) point.vx *= -1;
        if (point.y < 0 || point.y > height) point.vy *= -1;

        var dx = point.x - pointer.x;
        var dy = point.y - pointer.y;
        var pointerDistance = Math.sqrt(dx * dx + dy * dy);
        if (pointerDistance < 165) {
          var force = (165 - pointerDistance) / 165;
          point.x += dx * 0.008 * force;
          point.y += dy * 0.008 * force;
        }

        for (var i = index + 1; i < points.length; i += 1) {
          var other = points[i];
          var distanceX = point.x - other.x;
          var distanceY = point.y - other.y;
          var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
          if (distance < 126) {
            ctx.strokeStyle = "rgba(215, 184, 75," + (0.2 - distance / 760 + pulse * 0.025) + ")";
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = point.hue === 0 ? "rgba(255,255,255,0.46)" : point.hue === 1 ? "rgba(215,184,75,0.42)" : "rgba(124,92,255,0.36)";
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.r + pulse * 0.28, 0, Math.PI * 2);
        ctx.fill();
      });
      rafId = requestAnimationFrame(draw);
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

    var resizeTimer = 0;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 120);
    });

    document.addEventListener("visibilitychange", function () {
      hidden = document.hidden;
      if (hidden && rafId) {
        cancelAnimationFrame(rafId);
      } else {
        draw();
      }
    });

    resize();
    draw();
  }
})();
