chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  const {
    position,
    lgtmify,
  } = message;

  if (position) {
    chrome.storage.sync.set({ position });
  }

  if (lgtmify) {
    const { position } = await chrome.storage.sync.get(['position']);
    console.log(position);
  }
});
