const video = document.getElementById("video");
const channelsDiv = document.getElementById("channels");

let hls;

// Stream চালানো
function playStream(url){

    if(!url) return;

    localStorage.setItem(
        "lastStream",
        url
    );

    if(hls){
        hls.destroy();
    }

    if(Hls.isSupported()){

        hls = new Hls();

        hls.loadSource(url);

        hls.attachMedia(video);

        hls.on(
            Hls.Events.MANIFEST_PARSED,
            function(){
                video.play();
            }
        );

    }else{

        video.src = url;
        video.play();

    }
}

// URL ইনপুট থেকে Play
function playInput(){

    const url =
        document.getElementById("url")
        .value.trim();

    if(!url) return;

    playStream(url);

    let saved =
        JSON.parse(
            localStorage.getItem(
                "savedLinks"
            ) || "[]"
        );

    if(!saved.includes(url)){

        saved.push(url);

        localStorage.setItem(
            "savedLinks",
            JSON.stringify(saved)
        );
    }

    renderSaved();

}

// Saved Card দেখানো
function renderSaved(){

    const saved =
        JSON.parse(
            localStorage.getItem(
                "savedLinks"
            ) || "[]"
        );

    channelsDiv.innerHTML = "";

    saved.forEach(
        (url,index)=>{

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "channel";

        card.innerHTML = `
            <img src="https://cdn-icons-png.flaticon.com/512/1179/1179069.png">

            <p>Stream ${index+1}</p>

            <button
            onclick="
            event.stopPropagation();
            deleteLink(${index})
            ">
            ❌
            </button>
        `;

        card.onclick = ()=>{

            playStream(url);

        };

        channelsDiv
            .appendChild(card);

    });

}

// Delete Card
function deleteLink(index){

    let saved =
        JSON.parse(
            localStorage.getItem(
                "savedLinks"
            ) || "[]"
        );

    saved.splice(index,1);

    localStorage.setItem(
        "savedLinks",
        JSON.stringify(saved)
    );

    renderSaved();

}

// Picture in Picture
async function togglePip(){

    if(
        document
        .pictureInPictureElement
    ){

        await document
        .exitPictureInPicture();

    }else{

        await video
        .requestPictureInPicture();

    }

}

// Fullscreen
function fullscreen(){

    if(
        video.requestFullscreen
    ){

        video.requestFullscreen();

    }

}

// Search
document
.getElementById("search")
.addEventListener(
    "input",
    function(){

        const q =
            this.value
            .toLowerCase();

        document
        .querySelectorAll(
            ".channel"
        )
        .forEach(card=>{

            card.style.display =

            card.innerText
            .toLowerCase()
            .includes(q)

            ? "block"

            : "none";

        });

    }
);

// পেজ লোড
window.onload = ()=>{

    renderSaved();

    const last =
        localStorage.getItem(
            "lastStream"
        );

    if(last){

        playStream(last);

    }

};
