const selectButton = document.getElementById('select');
const lgtmifyButton = document.getElementById('lgtmify');

selectButton?.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  const tabId = tab.id as number;

  await chrome.scripting.executeScript({
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

    chrome.runtime.sendMessage({ position });
  });

  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('/moveable.js');
  document.body.appendChild(script);
}

lgtmifyButton?.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  const tabId = tab.id as number;

  await chrome.scripting.executeScript({
    target: { tabId },
    func: lgtmify,
  });
});

function lgtmify() {
  chrome.runtime.sendMessage({ lgtmify: true });
}
