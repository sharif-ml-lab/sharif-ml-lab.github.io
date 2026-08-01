(function () {
  "use strict";

  var nav = document.querySelector(".site-nav");
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector(".nav-menu");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("open", open);
    document.body.classList.toggle("nav-open", open);
    toggle.querySelector(".sr-only").textContent = open ? "Close navigation" : "Open navigation";
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
    });
    document.addEventListener("click", function (event) {
      if (menu.classList.contains("open") && !nav.contains(event.target)) setMenu(false);
    });
  }

  function updateNavSurface() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 24);
  }
  updateNavSurface();
  window.addEventListener("scroll", updateNavSurface, { passive: true });

  document.querySelectorAll("a[href^='http']").forEach(function (link) {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener");
  });

  var observedSections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  if ("IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-30% 0px -62% 0px", threshold: 0 });
    observedSections.forEach(function (section) { sectionObserver.observe(section); });
  }

  var peopleToggles = Array.prototype.slice.call(document.querySelectorAll("#people [data-toggle='collapse']"));
  peopleToggles.forEach(function (heading) {
    var target = document.querySelector(heading.getAttribute("data-target"));
    if (!target) return;
    var isCurrentGroup = target.id === "phd-students" || target.id === "msc-students";
    heading.setAttribute("aria-expanded", String(isCurrentGroup));
    target.classList.toggle("show", isCurrentGroup);

    function togglePeopleGroup() {
      var open = heading.getAttribute("aria-expanded") !== "true";
      heading.setAttribute("aria-expanded", String(open));
      target.classList.toggle("show", open);
    }
    heading.addEventListener("click", togglePeopleGroup);
  });

  document.querySelectorAll("#people .card").forEach(function (card) {
    var header = card.querySelector(".card-header");
    var name = card.querySelector("h4");
    if (!header || !name) return;
    var words = name.textContent.trim().replace(/^Dr\.\s+/, "").split(/\s+/);
    var initials = words.length > 1 ? words[0][0] + words[words.length - 1][0] : words[0].slice(0, 2);
    var avatar = document.createElement("span");
    avatar.className = "member-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = initials.toUpperCase();
    header.insertBefore(avatar, header.firstChild);
  });
}());
