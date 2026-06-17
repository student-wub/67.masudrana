const video = document.getElementById("video");
const playBtn = document.getElementById("playBtn");
const streamUrl = document.getElementById("streamUrl");
const channelRow = document.getElementById("channelRow");
const playlistFile = document.getElementById("playlistFile");

let hls;

// ডিফল্ট চ্যানেল
const channels = [
    {
        name: "Demo TV",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2b/TV_icon.svg",
        url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
    }
];

// ভিডিও প্লে ফাংশন
function playStream(url){

    if(!url){
        alert("Stream URL দিন");
        return;
    }

    if(hls){
        hls.destroy();
    }

    if(Hls.isSupported()){

        hls = new Hls();

        hls.loadSource(url);

        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play();
        });

    }else if(video.canPlayType('application/vnd.apple.mpegurl')){

        video.src = url;
        video.play();

    }else{

        alert("Browser HLS support করে না");
    }
}

// Play বাটন
playBtn.addEventListener("click", () => {
    playStream(streamUrl.value.trim());
});

// চ্যানেল দেখানো
function renderChannels(){

    channelRow.innerHTML = "";

    channels.forEach(channel => {

        const card = document.createElement("div");
        card.className = "channel-card";

        card.innerHTML = `
            <img src="${channel.logo}" alt="${channel.name}">
            <span>${channel.name}</span>
        `;

        card.onclick = () => {
            playStream(channel.url);
        };

        channelRow.appendChild(card);
    });
}

renderChannels();

// M3U Playlist Upload
playlistFile.addEventListener("change", function(){

    const file = this.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(e){

        const text = e.target.result;

        parseM3U(text);
    };

    reader.readAsText(file);
});

// M3U Parser
function parseM3U(text){

    const lines = text.split("\n");

    for(let i = 0; i < lines.length; i++){

        if(lines[i].startsWith("#EXTINF")){

            let name = lines[i].split(",")[1] || "Unknown";

            let url = lines[i + 1]?.trim();

            if(url && url.startsWith("http")){

                channels.push({
                    name: name,
                    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2b/TV_icon.svg",
                    url: url
                });
            }
        }
    }

    renderChannels();

    alert("Playlist Loaded!");
}
