chrome.runtime.onMessage.addListener(async (message) => {
  const {
    position,
    lgtmify,
  } = message;

  if (position) {
    await chrome.storage.sync.set({
      position,
    });
  }

  if (lgtmify) {
    await chrome.tabs.create({
      url: lgtmify,
    });
  }
});
