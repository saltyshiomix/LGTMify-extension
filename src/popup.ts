let changeColor: any = document.getElementById('changeColor');

changeColor.addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  const tabId = tab.id as number;

  chrome.scripting.executeScript({
    target: { tabId },
    func: injectMoveable,
  });
});

function injectMoveable() {
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

  let position = {
    top: (vh / 2) - 180,
    left: (vw / 2) - 240,
    width: 480,
    height: 360,
  };

  window.addEventListener('message', (message) => {
    const {
      type,
      top,
      left,
      width,
      height,
    } = message.data;

    if (type === 'onDrag') {
      position = {
        top,
        left,
        width,
        height,
      };
    }

    if (type === 'onResize') {
      position.width = width;
      position.height = height;
    }
  });

  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('/moveable.js');
  document.body.appendChild(script);
}
