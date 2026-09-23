/* ES5 syntax is intentional: navigation remains usable on older Safari versions. */
/* Set this to true when ことのは日記 is ready to open from the site navigation. */
var tsuzuruPublished = true;
var menuButton = document.querySelector(".menu-button");
var navigation = document.querySelector(".site-nav");
var menuLabel = menuButton && menuButton.querySelector(".sr-only");
var comingSoonModal = document.createElement("div");

comingSoonModal.className = "coming-soon-modal";
comingSoonModal.setAttribute("aria-hidden", "true");
comingSoonModal.innerHTML =
  '<div class="coming-soon-modal__panel" role="dialog" aria-modal="true" aria-labelledby="coming-soon-title" tabindex="-1">' +
    '<button class="coming-soon-modal__close" type="button" aria-label="閉じる">×</button>' +
    '<p id="coming-soon-title" class="coming-soon-modal__message">' +
      '<span>まもなく</span><span>新たな扉が</span><span>開きます</span>' +
    '</p>' +
  '</div>';
document.body.appendChild(comingSoonModal);

var modalCloseButton = comingSoonModal.querySelector(".coming-soon-modal__close");
var modalPanel = comingSoonModal.querySelector(".coming-soon-modal__panel");
var modalTrigger = null;

function setMenu(open) {
  if (!navigation || !menuButton) return;
  if (open) {
    navigation.classList.add("open");
    document.body.classList.add("menu-open");
  } else {
    navigation.classList.remove("open");
    document.body.classList.remove("menu-open");
  }
  menuButton.setAttribute("aria-expanded", String(open));
  menuLabel.textContent = open ? "メニューを閉じる" : "メニューを開く";
}

if (menuButton) {
  menuButton.addEventListener("click", function () {
    setMenu(menuButton.getAttribute("aria-expanded") !== "true");
  });
}

if (navigation) {
  navigation.addEventListener("click", function (event) {
    if (event.target && event.target.tagName === "A") setMenu(false);
  });
}

window.addEventListener("resize", function () {
  if (window.innerWidth > 900) setMenu(false);
});

function openComingSoonModal(trigger) {
  modalTrigger = trigger;
  comingSoonModal.setAttribute("aria-hidden", "false");
  comingSoonModal.classList.add("is-open");
  document.body.classList.add("modal-open");
  modalPanel.focus();
}

function closeComingSoonModal() {
  if (!comingSoonModal.classList.contains("is-open")) return;

  comingSoonModal.classList.remove("is-open");
  comingSoonModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (modalTrigger) modalTrigger.focus();
  modalTrigger = null;
}

modalCloseButton.addEventListener("click", closeComingSoonModal);

comingSoonModal.addEventListener("click", function (event) {
  if (event.target === comingSoonModal) closeComingSoonModal();
});

var comingSoonLinks = document.querySelectorAll("a[data-coming-soon]");
for (var i = 0; i < comingSoonLinks.length; i += 1) {
  (function (comingSoonLink) {
    comingSoonLink.addEventListener("click", function (event) {
      var href = comingSoonLink.getAttribute("href") || "";
      if (tsuzuruPublished && href.indexOf("tsuzuru.html") !== -1) return;
      event.preventDefault();
      event.stopPropagation();
      setMenu(false);
      openComingSoonModal(comingSoonLink);
    });
  }(comingSoonLinks[i]));
}

document.addEventListener("keydown", function (event) {
  if (event.key !== "Escape") return;

  setMenu(false);
  closeComingSoonModal();
});
