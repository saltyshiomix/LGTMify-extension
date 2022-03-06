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

  chrome.runtime.sendMessage({ position });

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
    args: [tabId]
  });
});

function lgtmify(tabId: number) {
  chrome.runtime.onMessage.addListener(async (message) => {
    const {
      position: {
        top,
        left,
        width,
        height,
      },
      imageDataUri,
    } = message;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;

    canvas.width = width;
    canvas.height = height;

    const devicePixelRatio = window.devicePixelRatio || 1;
    context.scale(1 / devicePixelRatio, 1 / devicePixelRatio);

    const image = document.createElement('img');
    image.src = imageDataUri;
    image.onload = () => {
      context.drawImage(
        image,
        left * devicePixelRatio,
        top * devicePixelRatio,
        width * devicePixelRatio,
        height * devicePixelRatio,
        0,
        0,
        width * devicePixelRatio,
        height * devicePixelRatio,
      );

      chrome.runtime.sendMessage({
        url: canvas.toDataURL('image/png'),
      });
    };
  });

  chrome.runtime.sendMessage({
    tabId,
    lgtmify: true,
  });
}
