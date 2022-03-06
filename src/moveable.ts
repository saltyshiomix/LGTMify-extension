import Moveable from 'moveable';

const target = document.createElement('div');
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
});

moveable.on('drag', ({ target, left, top }) => {
  target.style.left = `${left}px`;
  target.style.top = `${top}px`;

  window.postMessage({
    type: 'onDrag',
    top,
    left,
    width: target.clientWidth,
    height: target.clientHeight,
  }, '*');
});

moveable.on('resize', ({ target, width, height, dist, delta, clientX, clientY }) => {
  delta[0] && (target.style.width = `${width}px`);
  delta[1] && (target.style.height = `${height}px`);

  window.postMessage({
    type: 'onResize',
    width,
    height,
  }, '*');
});
