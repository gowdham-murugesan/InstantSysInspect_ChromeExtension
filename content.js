chrome.runtime.sendMessage({ action: "getSystemInfo" }, function (response) {
  var systemInfoEvent = new CustomEvent("systemInfo", {
    detail: response,
  });
  document.dispatchEvent(systemInfoEvent);
});