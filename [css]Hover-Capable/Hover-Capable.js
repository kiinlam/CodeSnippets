// matchMedia
const list = document.querySelector('[data-list]')
const isHoverableDevice = window.matchMedia(
  '(hover: hover) and (pointer: fine)'
)

/* Hide the block link initially */
blockLink.hidden = true

list.addEventListener('click', (e) => {
  /* Do nothing if target is not a link, or device is hover-capable */
  if (!e.target.dataset.link || isHoverableDevice.matches) return

  /* If touch device, show the block link */
  e.preventDefault()
  blockLink.hidden = false
  blockLink.innerText = `Visit ${e.target.dataset.link}’s page`
  blockLink.setAttribute('href', e.target.href)
})