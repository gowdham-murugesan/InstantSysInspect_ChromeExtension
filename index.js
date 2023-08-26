// Other
document.addEventListener("systemInfo", function (event) {
    var processorName = event.detail.processorName;
    var ramSize = event.detail.ramSize;
    ramSize = Math.round(ramSize / 1024);
    var screenWidth = event.detail.screenWidth;
    var screenHeight = event.detail.screenHeight;

    // processor
    // document.getElementById("processor-value").textContent = "Processor : " + processorName;
    document.getElementById("processor-value").innerHTML += processorName;

    const filePath = 'ProcessorList.xlsx';
    fetch(filePath)
        .then((response) => response.arrayBuffer())
        .then((data) => {
            const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            const dataFromXlsx = rows.slice(1).map((row) => ({
                processor: row[0] || "null"
            }));
            // processorName = "Intel Core i5 10210U"
            const matchedData = dataFromXlsx.filter((row) => compareWords(row.processor, processorName));
            if (matchedData.length > 0) {
                document.getElementById("processor-status").classList.add("green");
            } else {
                document.getElementById("processor-status").classList.add("red");
            }
        })
        .catch((error) => console.error(error));


    // RAM status
    document.getElementById("ram-value").innerHTML += ramSize + " GB";
    if (ramSize >= 8) {
        document.getElementById("ram-status").classList.add("green");
    } else {
        document.getElementById("ram-status").classList.add("red");
    }


    // Screen Resolution
    document.getElementById("screen-value").innerHTML += screenWidth + "x" + screenHeight;
    if (screenWidth >= 1280 && screenHeight >= 720) {
        document.getElementById("screen-status").classList.add("green");
    } else {
        document.getElementById("screen-status").classList.add("red");
    }


    // Operating System
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

    let osName = 'unknown';
    let osVersion = 'unknown';

    if (macosPlatforms.indexOf(platform) !== -1) {
        osName = 'Mac OS';
        const match = userAgent.match(/Mac OS X ([0-9._]+)/);
        if (match) {
            osVersion = match[1].replace(/_/g, '.');
            if (parseInt(osVersion) >= 11) {
                document.getElementById("os-status").classList.add("green");
            } else {
                document.getElementById("os-status").classList.add("red");
            }
            document.getElementById("os-value").innerHTML += osName + " " + osVersion;
        }
    }
    else if (windowsPlatforms.indexOf(platform) !== -1) {
        osName = 'Windows';
        const match = userAgent.match(/Windows NT ([0-9._]+)/);
        navigator.userAgentData.getHighEntropyValues(["platformVersion"])
            .then(ua => {
                if (parseInt(match[1]) >= 10) {
                    document.getElementById("os-status").classList.add("green");
                }
                else {
                    document.getElementById("os-status").classList.add("red");
                }
                if (parseInt(ua.platformVersion) >= 13) {
                    osVersion = 11;
                }
                else if (match) {
                    osVersion = match[1];
                }
                document.getElementById("os-value").innerHTML += osName + " " + osVersion;
            });

    }


    // Location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }

    function showPosition(position) {
        const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`;
        const states = [
            'Arizona',
            'Florida',
            'Georgia',
            'Idaho',
            'Minnesota',
            'Missouri',
            'Montana',
            'Nevada',
            'New Mexico',
            'North Carolina',
            'Oregon',
            'South Carolina',
            'Texas',
            'Utah',
            'Virginia',
            'Wyoming'
        ];
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                document.getElementById("loc-value").innerHTML += data.address.state + ", " + data.address.country;
                if ((data.address.country == "Canada" || data.address.country == "United Kingdom" || data.address.country == "India") || (data.address.country == "United States" && states.includes(data.address.state))) {
                    document.getElementById("loc-status").classList.add("green");
                }
                else {
                    document.getElementById("loc-status").classList.add("red");
                }
            })
            .catch(error => {
                console.error(error);
            });
    }


    // ISP Name and IP Address
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById("isp-value").innerHTML += data.org;
            // document.getElementById("ip-value").innerHTML += data.ip;
        })
        .catch(error => {
            console.error(error);
        });
});

function compareWords(str1, str2) {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');

    for (let i = 0; i < words1.length; i++) {
        const subwords1 = words1[i].split('');
        let subsetFound = false;
        for (let j = 0; j < words2.length; j++) {
            const subwords2 = words2[j].split('');
            for (let k = 0; k < subwords2.length; k++) {
                const subword2 = subwords2.slice(k).join('');
                if (subword2.includes(subwords1.join(''))) {
                    subsetFound = true;
                    break;
                }
            }
            if (subsetFound) {
                break;
            }
        }
        if (!subsetFound) {
            return false;
        }
    }

    return true;
}

function speedTest() {
    const frame = document.querySelector(".frame");
    frame.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.src = "https://fast.com/";
    frame.appendChild(iframe);

    const container = document.querySelector(".container");
    const leftContainer = document.querySelector(".left-container");
    container.style.width = "80%";
    leftContainer.style.width = "50%";
    frame.style.width = "50%";
}