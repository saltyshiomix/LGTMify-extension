const selectButton = document.getElementById('select-area');
const lgtmifyButton = document.getElementById('lgtmify');

selectButton?.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  await chrome.scripting.executeScript({
    target: {
      tabId: tab.id as number,
    },
    func: injectMoveable,
  });
});

function injectMoveable() {
  const lastScript = document.querySelector('#moveable-script');
  if (lastScript) {
    lastScript.parentNode?.removeChild(lastScript);
  }

  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

  chrome.runtime.sendMessage({
    position: {
      top: (vh / 2) - 180,
      left: (vw / 2) - 240,
      width: 480,
      height: 360,
    },
  });

  window.addEventListener('message', async (message) => {
    const {
      top,
      left,
      width,
      height,
    } = message.data;

    await chrome.runtime.sendMessage({
      position: {
        top,
        left,
        width,
        height,
      },
    });
  });

  const script = document.createElement('script');
  script.id = 'moveable-script';
  script.src = chrome.runtime.getURL('/moveable.js');
  document.body.appendChild(script);
}

lgtmifyButton?.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  const capturedImageUrl = await chrome.tabs.captureVisibleTab();

  await chrome.scripting.executeScript({
    target: {
      tabId: tab.id as number,
    },
    func: lgtmify,
    args: [capturedImageUrl],
  });
});

async function lgtmify(capturedImageUrl: string) {
  const { position } = await chrome.storage.sync.get(['position']);
  const {
    top,
    left,
    width,
    height,
  } = position;

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;

  canvas.width = width;
  canvas.height = height;

  const devicePixelRatio = window.devicePixelRatio || 1;
  context.scale(1 / devicePixelRatio, 1 / devicePixelRatio);

  const image = document.createElement('img');
  image.src = capturedImageUrl;
  image.onload = async () => {
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

    await chrome.runtime.sendMessage({
      lgtmify: canvas.toDataURL('image/png'),
    });
  };
}
