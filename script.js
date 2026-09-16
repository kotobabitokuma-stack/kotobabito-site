const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".site-nav");
const menuLabel = menuButton.querySelector(".sr-only");
const comingSoonModal = document.createElement("div");

comingSoonModal.className = "coming-soon-modal";
comingSoonModal.setAttribute("aria-hidden", "true");
comingSoonModal.innerHTML = `
  <div class="coming-soon-modal__panel" role="dialog" aria-modal="true" aria-labelledby="coming-soon-title" tabindex="-1">
    <button class="coming-soon-modal__close" type="button" aria-label="閉じる">×</button>
    <p id="coming-soon-title" class="coming-soon-modal__message">
      <span>まもなく</span>
      <span>新たな扉が</span>
      <span>開きます</span>
    </p>
  </div>
`;
document.body.append(comingSoonModal);

const modalCloseButton = comingSoonModal.querySelector(".coming-soon-modal__close");
const modalPanel = comingSoonModal.querySelector(".coming-soon-modal__panel");
let modalTrigger = null;

function setMenu(open) {
  navigation.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuLabel.textContent = open ? "メニューを閉じる" : "メニューを開く";
}

menuButton.addEventListener("click", () => {
  setMenu(menuButton.getAttribute("aria-expanded") !== "true");
});

navigation.addEventListener("click", (event) => {
  if (event.target.matches("a")) setMenu(false);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) setMenu(false);
});

function openComingSoonModal(trigger) {
  modalTrigger = trigger;
  comingSoonModal.setAttribute("aria-hidden", "false");
  comingSoonModal.classList.add("is-open");
  document.body.classList.add("modal-open");
  modalPanel.focus({ preventScroll: true });
}

function closeComingSoonModal() {
  if (!comingSoonModal.classList.contains("is-open")) return;

  comingSoonModal.classList.remove("is-open");
  comingSoonModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  modalTrigger?.focus({ preventScroll: true });
  modalTrigger = null;
}

modalCloseButton.addEventListener("click", closeComingSoonModal);

comingSoonModal.addEventListener("click", (event) => {
  if (event.target === comingSoonModal) closeComingSoonModal();
});

document.querySelectorAll("a[data-coming-soon]").forEach((comingSoonLink) => {
  comingSoonLink.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setMenu(false);
    openComingSoonModal(comingSoonLink);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  setMenu(false);
  closeComingSoonModal();
});
