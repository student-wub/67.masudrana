const video = document.getElementById("video");
const cards = document.getElementById("cards");

let hls = null;

// Stream Play
function playStream(url){

    if(!url) return;

    localStorage.setItem(
        "lastStream",
        url
    );

    if(hls){
        hls.destroy();
        hls = null;
    }

    if(Hls.isSupported()){

        hls = new Hls();

        hls.loadSource(url);

        hls.attachMedia(video);

        hls.on(
            Hls.Events.MANIFEST_PARSED,
            () => {
                video.play()
                .catch(()=>{});
            }
        );

    }else{

        video.src = url;

        video.play()
        .catch(()=>{});

    }

}

// Play Button
function playInput(){

    const url =
        document
        .getElementById("url")
        .value
        .trim();

    if(!url) return;

    playStream(url);

    let streams =
        JSON.parse(
            localStorage.getItem(
                "streams"
            ) || "[]"
        );

    // Duplicate Block
    if(
        !streams.includes(url)
    ){

        streams.push(url);

        localStorage.setItem(
            "streams",
            JSON.stringify(
                streams
            )
        );

    }

    renderCards();

    document
    .getElementById("url")
    .value = "";

}

// Card Render
function renderCards(){

    cards.innerHTML = "";

    let streams =
        JSON.parse(
            localStorage.getItem(
                "streams"
            ) || "[]"
        );

    streams.forEach(
        (url,index)=>{

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "card";

        card.innerHTML = `
            <button
                class="menu-btn">
                ⋮
            </button>

            <div class="card-icon">
                📺
            </div>

            <div class="card-title">
                ${index+1}
            </div>

            <div class="dropdown">

                <button
                    onclick="
                    playFromMenu(
                    ${index},
                    event
                    )">
                    ▶ Play
                </button>

                <button
                    onclick="
                    deleteStream(
                    ${index},
                    event
                    )">
                    🗑 Delete
                </button>

            </div>
        `;

        card.onclick = ()=>{

            playStream(url);

        };

        const menu =
            card.querySelector(
                ".menu-btn"
            );

        const dropdown =
            card.querySelector(
                ".dropdown"
            );

        menu.onclick = (e)=>{

            e.stopPropagation();

            document
            .querySelectorAll(
                ".dropdown"
            )
            .forEach(d=>{

                d.style.display =
                    "none";

            });

            dropdown.style.display =

                dropdown.style.display
                === "block"

                ? "none"

                : "block";

        };

        cards.appendChild(
            card
        );

    });

}

// Play Menu
function playFromMenu(
    index,
    e
){

    e.stopPropagation();

    let streams =
        JSON.parse(
            localStorage.getItem(
                "streams"
            ) || "[]"
        );

    playStream(
        streams[index]
    );

}

// Delete Stream
function deleteStream(
    index,
    e
){

    e.stopPropagation();

    let streams =
        JSON.parse(
            localStorage.getItem(
                "streams"
            ) || "[]"
        );

    streams.splice(
        index,
        1
    );

    localStorage.setItem(
        "streams",
        JSON.stringify(
            streams
        )
    );

    if(
        streams.length === 0
    ){

        localStorage.removeItem(
            "lastStream"
        );

        if(hls){

            hls.destroy();

            hls = null;

        }

        video.pause();

        video.removeAttribute(
            "src"
        );

        video.load();

    }

    renderCards();

}

// Load Page
window.onload = ()=>{

    renderCards();

    const last =
        localStorage.getItem(
            "lastStream"
        );

    if(last){

        playStream(last);

    }

};

// Close Menu
document.addEventListener(
    "click",
    ()=>{

        document
        .querySelectorAll(
            ".dropdown"
        )
        .forEach(d=>{

            d.style.display =
                "none";

        });

    }
);

// Enter Press
document
.getElementById("url")
.addEventListener(
    "keypress",
    function(e){

        if(
            e.key ===
            "Enter"
        ){

            playInput();

        }

    }
);

// Search Button
const searchBtn =
    document.getElementById(
        "searchBtn"
    );

const urlBox =
    document.querySelector(
        ".url-box"
    );

searchBtn.onclick = ()=>{

    if(
        urlBox.style.display
        === "flex"
    ){

        urlBox.style.display =
            "none";

    }else{

        urlBox.style.display =
            "flex";

        document
        .getElementById("url")
        .focus();

    }

};

// Menu Button
const toggle =
    document.getElementById(
        "toggleMenu"
    );

const menuArea =
    document.getElementById(
        "menuArea"
    );

toggle.onclick = ()=>{

    menuArea.style.display =

        menuArea.style.display
        === "block"

        ? "none"

        : "block";

};
