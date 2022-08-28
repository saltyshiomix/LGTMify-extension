import Moveable from 'moveable';

const _target = document.getElementById('lgtmify');
if (_target) {
  _target.remove();
  const controles = document.querySelectorAll('.moveable-control-box');
  for (const control of controles) {
    control.parentNode?.removeChild(control);
  }
}

const target = document.createElement('div');
target.id = 'lgtmify';
target.innerHTML = 'LGTM';
target.style.cursor = 'grab';
target.style.width = '480px';
target.style.height = '360px';
target.style.position = 'absolute';
target.style.top = 'calc(50vh - 180px)';
target.style.left = 'calc(50vw - 240px)';
target.style.zIndex = '999999';
target.style.background = 'transparent';
target.style.display = 'flex';
target.style.alignItems = 'center';
target.style.justifyContent = 'center';
target.style.color = 'white';
target.style.fontSize = '88px';
target.style.fontWeight = 'bold';
target.style.letterSpacing = '12px';

document.body.appendChild(target);

const moveable = new Moveable(document.body, {
  target,
  draggable: true,
  resizable: true,
  padding: {
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
  },
});

const origin = document.querySelector('.moveable-control.moveable-origin') as HTMLElement;
origin.style.visibility = 'hidden';

moveable.on('drag', ({ target, top, left }) => {
  target.style.top = `${top}px`;
  target.style.left = `${left}px`;
});

moveable.on('dragEnd', ({ target }) => {
  const {
    top,
    left,
    width,
    height,
  } = target.getBoundingClientRect();

  window.postMessage({
    top,
    left,
    width,
    height,
  }, '*');
});

moveable.on('resize', ({ target, delta, width, height }) => {
  delta[0] && (target.style.width = `${width}px`);
  delta[1] && (target.style.height = `${height}px`);
});

moveable.on('resizeEnd', ({ target }) => {
  const {
    top,
    left,
    width,
    height,
  } = target.getBoundingClientRect();

  window.postMessage({
    top,
    left,
    width,
    height,
  }, '*');
});
