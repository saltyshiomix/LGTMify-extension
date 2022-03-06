chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  const {
    position,
    lgtmify,
    tabId,
    url,
  } = message;

  if (position) {
    await chrome.storage.sync.set({ position });
  }

  if (lgtmify) {
    const { position } = await chrome.storage.sync.get(['position']);
    const imageDataUri = await chrome.tabs.captureVisibleTab();
    chrome.tabs.sendMessage(tabId, {
      position,
      imageDataUri,
    });
  }

  if (url) {
    await chrome.tabs.create({ url });
  }
});
