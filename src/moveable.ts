import Moveable from "moveable";

const target = document.createElement('div');
target.id = 'target';
target.className = 'target';
target.style.position = 'absolute';
target.style.top = '100px';
target.style.left = '100px';
target.style.background = 'red';
target.style.width = '100px';
target.style.height = '100px';
target.style.cursor = 'pointer';

document.body.appendChild(target);

const moveable = new Moveable(document.body, {
  target: document.getElementById('target'),
  container: document.body,
  draggable: true,
  resizable: true,
});

/* draggable */
moveable.on("dragStart", ({ target, clientX, clientY }) => {
  console.log("onDragStart", target);
}).on("drag", ({
  target, transform,
  left, top, right, bottom,
  beforeDelta, beforeDist, delta, dist,
  clientX, clientY,
}) => {
  console.log("onDrag left, top", left, top);
  target!.style.left = `${left}px`;
  target!.style.top = `${top}px`;
  // console.log("onDrag translate", dist);
  // target!.style.transform = transform;
}).on("dragEnd", ({ target, isDrag, clientX, clientY }) => {
  console.log("onDragEnd", target, isDrag);
});

/* resizable */
moveable.on("resizeStart", ({ target, clientX, clientY }) => {
  console.log("onResizeStart", target);
}).on("resize", ({ target, width, height, dist, delta, clientX, clientY }) => {
  console.log("onResize", target);
  delta[0] && (target!.style.width = `${width}px`);
  delta[1] && (target!.style.height = `${height}px`);
}).on("resizeEnd", ({ target, isDrag, clientX, clientY }) => {
  console.log("onResizeEnd", target, isDrag);
});
