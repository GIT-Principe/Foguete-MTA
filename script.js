/* ================= WARP FUNDO ================= */

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let stars = [];
let numStars = 1300;

for(let i=0;i<numStars;i++){
    stars.push({
        x: Math.random()*canvas.width - canvas.width/2,
        y: Math.random()*canvas.height - canvas.height/2,
        z: Math.random()*canvas.width
    });
}

function draw(){
    ctx.fillStyle="rgba(0,0,20,0.5)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    let shakeX = (Math.random()-0.5)*1.2;
    let shakeY = (Math.random()-0.5)*1.2;

    ctx.translate(canvas.width/2+shakeX, canvas.height/2+shakeY);

    stars.forEach(star=>{
        star.z -= 1.4;
        if(star.z <= 0) star.z = canvas.width;

        let k = 128.0/star.z;
        let px = star.x*k;
        let py = star.y*k;
        let size = (1-star.z/canvas.width)*2;

        ctx.fillStyle="#ffffff";
        ctx.fillRect(px,py,size,size);
    });

    ctx.setTransform(1,0,0,1,0,0);
    requestAnimationFrame(draw);
}
draw();

/* ================= AUDIO REATIVO ================= */
document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("music");
  const soundBtn = document.getElementById("soundBtn");
  const overlay = document.getElementById("soundOverlay");

  let audioContext;
  let analyser;
  let source;

  function initAudio() {
    if (audioContext) return;
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
  }

  // Primeiro clique no overlay: desbloqueia o áudio
  overlay.addEventListener("click", async () => {
    initAudio();
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }
    try {
      await audio.play(); // força o play no clique
    } catch (err) {
      console.error("Erro ao iniciar áudio:", err);
    }
    audio.muted = false;
    overlay.remove(); // remove o overlay depois do clique
    soundBtn.innerHTML = "🔊";
  }, { once: true });

  // Botão visível: controla pause/play
  soundBtn.addEventListener("click", async () => {
    initAudio();
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }
    if (audio.paused) {
      try {
        await audio.play();
      } catch (err) {
        console.error("Erro ao dar play:", err);
      }
      audio.muted = false;
      soundBtn.innerHTML = "🔊";
    } else {
      audio.pause();
      soundBtn.innerHTML = "🔇";
    }
  });
});

/* ================= SERVER STATUS ================= */

async function loadServer(){
    try{
        const response = await fetch("https://nonascendantly-uncertain-marcellus.ngrok-free.dev/players", {
  headers: {
    "ngrok-skip-browser-warning": "true" // opcional, evita a página de aviso
  }
});
        const data = await response.json();

        document.getElementById("serverName").innerText = data.name;
        document.getElementById("players").innerText = data.players;
        document.getElementById("maxPlayers").innerText = data.maxPlayers;

        const dot = document.getElementById("statusDot");
        const text = document.getElementById("statusText");
        const lock = document.getElementById("lockIcon");

        dot.className = "dot";

        if(data.status === "online"){
            dot.classList.add("online");
            text.innerText = "Online";
        }else if(data.status === "maintenance"){
            dot.classList.add("maintenance");
            text.innerText = "Manutenção";
        }else{
            dot.classList.add("offline");
            text.innerText = "Offline";
        }

        if(data.requirePassword === true){
            lock.innerText = "🔒";
        }else{
            lock.innerText = "🔓";
        }

    }catch(error){
        document.getElementById("statusText").innerText = "Offline";
    }
}

loadServer();
setInterval(loadServer, 10000);









