/* Keep the orbit separate from the player; create no YouTube request until selection. */
(function () {
  var links = document.querySelectorAll('[data-playlist]');
  var viewer = document.getElementById('youtube-viewer');
  var player = document.getElementById('youtube-player');
  var title = document.getElementById('playlist-title');
  var external = document.getElementById('youtube-external');
  var close = document.getElementById('youtube-close');
  var selected = null;
  if (!viewer || !player || !title || !external || !close) return;

  function resetSelection() {
    for (var j = 0; j < links.length; j += 1) {
      links[j].removeAttribute('aria-current');
      links[j].setAttribute('aria-expanded', 'false');
    }
  }

  // This category opens YouTube directly; remove any active embed before leaving.
  var liveLink = document.querySelector('.playlist--1');
  function stopForExternalLink(event) {
    if (event.type === 'auxclick' && event.button !== 1) return;
    viewer.hidden = true;
    player.removeAttribute('src');
    player.title = 'YouTube再生リスト';
    title.textContent = '';
    selected = null;
    resetSelection();
  }
  if (liveLink) {
    liveLink.addEventListener('click', stopForExternalLink);
    liveLink.addEventListener('auxclick', stopForExternalLink);
  }

  resetSelection();
  for (var i = 0; i < links.length; i += 1) {
    links[i].addEventListener('click', function (event) {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button > 0) return;
      event.preventDefault();
      var name = this.textContent;
      if (selected !== this) {
        resetSelection();
        selected = this;
        this.setAttribute('aria-current', 'true');
        this.setAttribute('aria-expanded', 'true');
        title.textContent = name;
        player.title = name + ' — YouTube再生リスト';
        player.src = 'https://www.youtube.com/embed/videoseries?list=' + encodeURIComponent(this.getAttribute('data-playlist')) + '&autoplay=0&playsinline=1&rel=0';
        external.href = this.href;
        external.innerHTML = name + 'をYouTubeで見る <span aria-hidden="true">↗</span><span class="sr-only">（新しいタブで開く）</span>';
      }
      viewer.hidden = false;
      title.focus({ preventScroll: true });
      viewer.scrollIntoView({ block: 'start' });
    });
  }

  close.addEventListener('click', function () {
    var previous = selected;
    viewer.hidden = true;
    player.removeAttribute('src');
    player.title = 'YouTube再生リスト';
    title.textContent = '';
    selected = null;
    resetSelection();
    if (previous) {
      previous.focus({ preventScroll: true });
      previous.scrollIntoView({ block: 'center' });
    }
  });
}());
