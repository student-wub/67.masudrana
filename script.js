const video = document.getElementById("video");
const cards = document.getElementById("cards");

let hls;

// Stream চালানোর ফাংশন
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

    // Duplicate URL না যোগ করা
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
}

// Card দেখানো
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
                Stream ${index+1}
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
                    ${index}
                    )">
                    🗑 Delete
                </button>

            </div>
        `;

        // কার্ডে ক্লিক করলে Play
        card.onclick = ()=>{

            playStream(url);

        };

        // Menu Button
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

                if(
                    d !== dropdown
                ){
                    d.style.display =
                        "none";
                }

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

// Play from Menu
function playFromMenu(index, e){

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
function deleteStream(index, e){

    e.stopPropagation();

    let streams =
        JSON.parse(
            localStorage.getItem(
                "streams"
            ) || "[]"
        );

    streams.splice(index,1);

    localStorage.setItem(
        "streams",
        JSON.stringify(
            streams
        )
    );

    renderCards();
}

// Page Load
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

// বাইরে ক্লিক করলে Menu বন্ধ
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
