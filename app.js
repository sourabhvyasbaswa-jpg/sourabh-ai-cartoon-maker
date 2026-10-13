"use strict";

const $ = id => document.getElementById(id);

const storyInput = $("storyInput");
const generateBtn = $("generateBtn");
const sceneList = $("sceneList");
const speakBtn = $("speakBtn");
const dinosaurBtn = $("dinosaurBtn");

const aiAnswer = $("aiAnswer");
const checkAnswerBtn = $("checkAnswerBtn");
const taskMessage = $("taskMessage");
const taskStatus = $("taskStatus");

const makeVideoBtn = $("makeVideoBtn");
const videoStatus = $("videoStatus");
const videoPreview = $("videoPreview");
const downloadVideo = $("downloadVideo");
const imageUpload = $("imageUpload");
const includeVoice = $("includeVoice");

const earningAmount = $("earningAmount");
const earningType = $("earningType");
const addEarningBtn = $("addEarningBtn");
const earningMessage = $("earningMessage");

const cartoonStatus = $("cartoonStatus");

let currentScenes = [];
let uploadedImages = [];
let videoURL = null;

function splitStory(story) {
  const text = story.trim();

  if (!text) return [];

  // यदि कहानी में सीन 1, सीन 2 जैसे शीर्षक हैं,
  // तो प्रत्येक सीन को अलग रखें।
  const namedScenes = text
    .split(/(?=सीन\s*\d+\s*[:：])/i)
    .map(s => s.trim())
    .filter(Boolean);

  if (namedScenes.length > 1) {
    return namedScenes;
  }

  // अन्य कहानियों को वाक्यों में बाँटें।
  const sentences = text
    .split(/(?<=[।.!?])\s+|\n+/)
    .map(s => s.trim())
    .filter(Boolean);

  if (sentences.length <= 6) {
    return sentences;
  }

  // बहुत सारे वाक्यों को अधिकतम लगभग 6 दृश्यों में बाँटें।
  const count = 6;
  const scenes = [];
  const groupSize = Math.ceil(sentences.length / count);

  for (let i = 0; i < sentences.length; i += groupSize) {
    scenes.push(
      sentences.slice(i, i + groupSize).join(" ")
    );
  }

  return scenes;
}

// उदाहरण कहानी
dinosaurBtn.addEventListener("click", () => {
  storyInput.value = [
    "सीन 1: राहुल घने जंगल में घूम रहा था।",
    "सीन 2: अचानक एक विशाल टी-रेक्स डायनासोर सामने आ गया।",
    "सीन 3: डायनासोर राहुल के पीछे दौड़ने लगा।",
    "सीन 4: राहुल ने चालाकी से डायनासोर को दलदल की ओर मोड़ दिया।",
    "सीन 5: डायनासोर कीचड़ में फँस गया और राहुल ने मदद बुलाई।",
    "सीन 6: राहुल ने सीखा कि समझदारी सबसे बड़ी ताकत है।"
  ].join("\n\n");

  storyInput.focus();
});

// चित्र अपलोड करना
imageUpload.addEventListener("change", () => {
  uploadedImages.forEach(item => URL.revokeObjectURL(item.url));
  uploadedImages = [];

  const files = Array.from(imageUpload.files || [])
    .filter(file => file.type.startsWith("image/"))
    .slice(0, 20);

  uploadedImages = files.map(file => ({
    name: file.name,
    url: URL.createObjectURL(file)
  }));

  videoStatus.textContent = uploadedImages.length
    ? uploadedImages.length + " चित्र चुने गए।"
    : "कोई चित्र नहीं चुना गया।";
});

// चित्र लोड करना
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("चित्र लोड नहीं हुआ।"));

    img.src = url;
  });
}

// दृश्य सूची दिखाना
function renderScenes() {
  sceneList.replaceChildren();

  currentScenes.forEach((sentence, index) => {
    const card = document.createElement("div");
    card.className = "scene";

    const title = document.createElement("h3");
    title.textContent = "🎬 दृश्य " + (index + 1);

    const description = document.createElement("p");
    description.textContent = sentence;

    card.append(title, description);

    const item = uploadedImages[index];

    if (item) {
      const img = document.createElement("img");

      img.src = item.url;
      img.alt = "कार्टून दृश्य " + (index + 1);
      img.style.width = "100%";
      img.style.maxWidth = "400px";
      img.style.height = "auto";
      img.style.borderRadius = "12px";

      card.appendChild(img);
    }

    sceneList.appendChild(card);
  });

  cartoonStatus.textContent =
    currentScenes.length + " दृश्य तैयार हैं।";
}

generateBtn.addEventListener("click", () => {
  const story = storyInput.value.trim();

  if (!story) {
    alert("पहले अपनी कहानी लिखें।");
    storyInput.focus();
    return;
  }

  currentScenes = splitStory(story);
  renderScenes();
});

// कहानी सुनना
speakBtn.addEventListener("click", () => {
  const story = storyInput.value.trim();

  if (!story) {
    alert("पहले कहानी लिखें।");
    return;
  }

  if (!("speechSynthesis" in window)) {
    alert("आपका ब्राउज़र आवाज़ सपोर्ट नहीं करता।");
    return;
  }

  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(story);

  utterance.lang = "hi-IN";
  utterance.rate = 0.9;

  speechSynthesis.speak(utterance);
});

// AI उत्तर का अभ्यास
checkAnswerBtn.addEventListener("click", () => {
  if (!aiAnswer.value.trim()) {
    taskMessage.textContent = "पहले AI का जवाब लिखें।";
    aiAnswer.focus();
    return;
  }

  taskMessage.textContent =
    "अभ्यास पूरा हुआ। यह भुगतान वाला टास्क नहीं है।";

  taskStatus.textContent =
    "अभ्यास पूरा — कोई भुगतान प्राप्त नहीं हुआ।";
});

// कमाई का रिकॉर्ड
function readEarnings() {
  try {
    const data = JSON.parse(
      localStorage.getItem("sourabhVerifiedEarnings") || "[]"
    );

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function renderEarnings() {
  const entries = readEarnings();

  const taskTotal = entries
    .filter(e => e.type === "task")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const cartoonTotal = entries
    .filter(e => e.type === "cartoon")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  $("taskEarnings").textContent =
    "₹" + taskTotal.toFixed(2);

  $("cartoonEarnings").textContent =
    "₹" + cartoonTotal.toFixed(2);

  $("totalEarnings").textContent =
    "₹" + (taskTotal + cartoonTotal).toFixed(2);
}

addEarningBtn.addEventListener("click", () => {
  const amount = Number(earningAmount.value);

  if (!Number.isFinite(amount) || amount <= 0) {
    earningMessage.textContent =
      "कृपया सही भुगतान राशि दर्ज करें।";
    return;
  }

  const entries = readEarnings();

  entries.push({
    amount: Math.round(amount * 100) / 100,
    type: earningType.value === "task" ? "task" : "cartoon",
    date: new Date().toISOString()
  });

  try {
    localStorage.setItem(
      "sourabhVerifiedEarnings",
      JSON.stringify(entries)
    );

    earningAmount.value = "";

    earningMessage.textContent =
      "राशि रिकॉर्ड में दर्ज हुई। बैंक भुगतान की पुष्टि नहीं हुई है।";

    renderEarnings();
  } catch {
    earningMessage.textContent =
      "रिकॉर्ड सेव नहीं हुआ। ब्राउज़र स्टोरेज जाँचें।";
  }
});

// कैनवास पर हिंदी टेक्स्ट को कई लाइनों में लिखना
function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";

  for (const word of words) {
    const test = line ? line + " " + word : word;

    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }

  if (line) lines.push(line);

  lines.slice(0, 7).forEach((item, index) => {
    ctx.fillText(item, x, y + index * lineHeight);
  });
}

// एक वीडियो दृश्य बनाना
function drawVideoFrame(ctx, width, height, sentence, index, total, image) {
  ctx.clearRect(0, 0, width, height);

  const background = ctx.createLinearGradient(0, 0, width, height);

  background.addColorStop(0, "#10152f");
  background.addColorStop(1, "#244b67");

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  // सजावटी तारे
  ctx.fillStyle = "#ffd166";

  for (let i = 0; i < 35; i++) {
    const x = (i * 97 + index * 37) % width;
    const y = (i * 173 + 40) % height;

    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 34px sans-serif";

  ctx.fillText("Sourabh AI Cartoon", width / 2, 75);

  if (image && image.complete && image.naturalWidth > 0) {
    const maxWidth = width - 70;
    const maxHeight = height * 0.43;

    const scale = Math.min(
      maxWidth / image.naturalWidth,
      maxHeight / image.naturalHeight
    );

    const w = image.naturalWidth * scale;
    const h = image.naturalHeight * scale;

    ctx.drawImage(
      image,
      (width - w) / 2,
      height * 0.13,
      w,
      h
    );
  } else {
    // चित्र न होने पर एक सरल दृश्य संकेत
    ctx.font = "90px sans-serif";
    ctx.fillStyle = "#ffd166";
    ctx.fillText("🎬", width / 2, height * 0.40);
  }

  ctx.fillStyle = "#ffd166";
  ctx.font = "bold 28px sans-serif";

  ctx.fillText(
    "दृश्य " + (index + 1) + " / " + total,
    width / 2,
    height * 0.64
  );

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 30px sans-serif";

  drawWrappedText(
    ctx,
    sentence,
    width / 2,
    height * 0.71,
    width - 70,
    43
  );

  ctx.fillStyle = "#b8d8ff";
  ctx.font = "20px sans-serif";

  ctx.fillText(
    "Sourabh AI",
    width / 2,
    height - 45
  );
}

// वीडियो बनाएँ
makeVideoBtn.addEventListener("click", async () => {
  const story = storyInput.value.trim();

  if (!story) {
    videoStatus.textContent = "पहले कहानी लिखें।";
    storyInput.focus();
    return;
  }

  if (
    !window.MediaRecorder ||
    !HTMLCanvasElement.prototype.captureStream
  ) {
    videoStatus.textContent =
      "आपका ब्राउज़र वीडियो रिकॉर्डिंग सपोर्ट नहीं करता। Chrome में कोशिश करें।";
    return;
  }

  const mimeType = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm"
  ].find(type => MediaRecorder.isTypeSupported(type));

  if (!mimeType) {
    videoStatus.textContent =
      "इस ब्राउज़र में WebM रिकॉर्डिंग उपलब्ध नहीं है।";
    return;
  }

  const scenes = splitStory(story);

  if (!scenes.length) {
    videoStatus.textContent = "कहानी के दृश्य नहीं मिले।";
    return;
  }

  makeVideoBtn.disabled = true;
  generateBtn.disabled = true;

  let stream;
  let recorder;
  let stopTimer;
  let animationId;

  try {
    const canvas = document.createElement("canvas");

    canvas.width = 720;
    canvas.height = 1280;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Canvas उपलब्ध नहीं है।");
    }

    videoStatus.textContent = "चित्र लोड हो रहे हैं...";

    const images = await Promise.all(
      scenes.map(async (_, index) => {
        const item = uploadedImages[index];

        if (!item) return null;

        try {
          return await loadImage(item.url);
        } catch {
          return null;
        }
      })
    );

    stream = canvas.captureStream(24);

    recorder = new MediaRecorder(stream, { mimeType });

    const chunks = [];

    recorder.ondataavailable = event => {
      if (event.data && event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    const finished = new Promise((resolve, reject) => {
      recorder.onstop = resolve;

      recorder.onerror = () => {
        reject(new Error("वीडियो रिकॉर्डिंग में त्रुटि हुई।"));
      };
    });

    const sceneDuration = 4000;
    const totalDuration = scenes.length * sceneDuration;
    const startTime = performance.now();

    let currentScene = -1;

    function render(now) {
      const elapsed = now - startTime;

      const index = Math.min(
        scenes.length - 1,
        Math.floor(elapsed / sceneDuration)
      );

      if (index !== currentScene) {
        currentScene = index;

        drawVideoFrame(
          ctx,
          canvas.width,
          canvas.height,
          scenes[index],
          index,
          scenes.length,
          images[index]
        );

        videoStatus.textContent =
          "वीडियो बन रहा है: दृश्य " +
          (index + 1) + " / " + scenes.length;
      }

      if (elapsed < totalDuration) {
        animationId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationId);

        stopTimer = setTimeout(() => {
          if (recorder.state !== "inactive") {
            recorder.stop();
          }
        }, 500);
      }
    }

    // रिकॉर्डिंग शुरू करने से पहले पहला दृश्य दिखाएँ।
    drawVideoFrame(
      ctx,
      canvas.width,
      canvas.height,
      scenes[0],
      0,
      scenes.length,
      images[0]
    );

    recorder.start(250);

    animationId = requestAnimationFrame(render);

    await finished;

    const blob = new Blob(chunks, { type: mimeType });

    if (!blob.size) {
      throw new Error("वीडियो फाइल खाली है।");
    }

    if (videoURL) {
      URL.revokeObjectURL(videoURL);
    }

    videoURL = URL.createObjectURL(blob);

    videoPreview.src = videoURL;
    videoPreview.controls = true;
    videoPreview.style.display = "block";
    videoPreview.load();

    downloadVideo.href = videoURL;
    downloadVideo.download = "sourabh-ai-cartoon.webm";
    downloadVideo.hidden = false;
    downloadVideo.textContent = "📥 वीडियो डाउनलोड करें";

    videoStatus.textContent =
      "वीडियो तैयार है! पहले चलाकर देखें, फिर डाउनलोड करें।";

    cartoonStatus.textContent =
      "WebM वीडियो तैयार — " + scenes.length + " दृश्य।";

  } catch (error) {
    console.error(error);

    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }

    videoStatus.textContent =
      "वीडियो नहीं बन पाया। Chrome में पेज दोबारा खोलकर कोशिश करें।";

  } finally {
    if (stopTimer) {
      clearTimeout(stopTimer);
    }

    if (animationId) {
      cancelAnimationFrame(animationId);
    }

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    makeVideoBtn.disabled = false;
    generateBtn.disabled = false;
  }
});

// पेज खुलने पर पुरानी रिकॉर्ड की गई राशि दिखाएँ
renderEarnings();

console.log("Sourabh AI Cartoon Maker ready.");
