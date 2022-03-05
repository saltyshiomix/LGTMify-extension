let changeColor: any = document.getElementById("changeColor");

chrome.storage.sync.get("color", ({ color }) => {
  changeColor!.style.backgroundColor = color;
});

changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id! },
    func: injectMoveable,
  });
});

function injectMoveable() {
  // chrome.storage.sync.get("color", ({ color }) => {
  //   document.body.style.backgroundColor = color;
  // });

  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('/moveable.js');
  document.body.appendChild(script);
}
