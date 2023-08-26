chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getSystemInfo") {
    chrome.system.cpu.getInfo(function (cpuInfo) {
      var processorName = cpuInfo.modelName;
      chrome.system.memory.getInfo(function (memoryInfo) {
        var ramSize = memoryInfo.capacity;
        ramSize = ramSize / (1024 * 1024);
        chrome.system.display.getInfo(function (displayInfo) {
          var screenWidth = displayInfo[0].bounds.width;
          var screenHeight = displayInfo[0].bounds.height;
          var systemInfo = {
            processorName: processorName,
            ramSize: ramSize,
            screenWidth: screenWidth,
            screenHeight: screenHeight,
          };
          sendResponse(systemInfo);
        });
      });
    });
    return true;
  }
});