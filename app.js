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
  return story
    .split(/[।.!?\n]+/)
    .map(s => s.trim())
    .filter(Boolean);
}

// कहानी का उदाहरण
dinosaurBtn.addEventListener("click", () => {
  storyInput.value = [
    "राहुल जंगल में रास्ता भटक गया।",
    "अचानक एक विशाल टी-रेक्स डायनासोर उसके सामने आ गया।",
    "डायनासोर ने जोर से दहाड़ लगाई और राहुल के पीछे दौड़ने लगा।",
    "राहुल ने समझदारी से डायनासोर को दलदल की तरफ आकर्षित किया।",
    "डायनासोर कीचड़ में फँस गया और राहुल सुरक्षित जगह पहुँच गया।",
    "राहुल ने सीखा कि मुश्किल समय में समझदारी बड़ी ताकत है।"
  ].join("\n");

  storyInput.focus();
});

// उपयोगकर्ता द्वारा दिए चित्र पढ़ना
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

// दृश्य तैयार करना
generateBtn.addEventListener("click", () => {
  const story = storyInput.value.trim();

  if (!story) {
    alert("पहले कहानी लिखें।");
    storyInput.focus();
    return;
  }

  currentScenes = splitStory(story);
  sceneList.replaceChildren();

  currentScenes.forEach((sentence, index) => {
    const card = document.createElement("div");
    card.className = "scene";

    const title = document.createElement("h3");
    title.textContent = "🎬 दृश्य " + (index + 1);

    const description = document.createElement("p");
    description.textContent = sentence;

    card.append(title, description);

    if (uploadedImages[index]) {
      const img = document.createElement("img");
      img.src = uploadedImages[index].url;
      img.alt = "अपलोड किया गया कार्टून चित्र";
      card.appendChild(img);
    }

    sceneList.appendChild(card);
  });

  cartoonStatus.textContent =
    currentScenes.length + " टेक्स्ट दृश्य तैयार हैं।";
});

// ब्राउज़र में कहानी सुनना
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

  const speech = new SpeechSynthesisUtterance(story);
  speech.lang = "hi-IN";
  speech.rate = 0.9;

  speechSynthesis.speak(speech);
});

// AI उत्तर का अभ्यास
checkAnswerBtn.addEventListener("click", () => {
  if (!aiAnswer.value.trim()) {
    taskMessage.textContent = "पहले AI का जवाब लिखें।";
    aiAnswer.focus();
    return;
  }

  taskMessage.textContent =
    "अभ्यास पूरा हुआ। यह केवल अभ्यास है, भुगतान वाला टास्क नहीं।";

  taskStatus.textContent = "अभ्यास पूरा — कोई भुगतान प्राप्त नहीं हुआ।";
});

// केवल उपयोगकर्ता द्वारा बताए वास्तविक भुगतान का रिकॉर्ड
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
    .reduce((sum, e) => sum + e.amount, 0);

  const cartoonTotal = entries
    .filter(e => e.type === "cartoon")
    .reduce((sum, e) => sum + e.amount, 0);

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
    earningMessage.textContent = "सही भुगतान राशि दर्ज करें।";
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
      "राशि आपके रिकॉर्ड में दर्ज हुई। यह बैंक भुगतान की पुष्टि नहीं है।";

    renderEarnings();
  } catch {
    earningMessage.textContent =
      "रिकॉर्ड सेव नहीं हुआ। ब्राउज़र की स्टोरेज सेटिंग जाँचें।";
  }
});

// वीडियो के लिए टेक्स्ट और चित्र बनाना
function drawVideoFrame(ctx, width, height, sentence, index, total, image) {
  ctx.fillStyle = "#10152f";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#ffd166";

  for (let i = 0; i < 35; i++) {
    const x = (i * 97 + index * 37) % width;
    const y = (i * 173) % height;

    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "bold 38px sans-serif";
  ctx.fillText("Sourabh AI Cartoon", width / 2, 100);

  if (image && image.complete && image.naturalWidth > 0) {
    const maxWidth = width - 100;
    const maxHeight = height * 0.42;

    const scale = Math.min(
      maxWidth / image.naturalWidth,
      maxHeight / image.naturalHeight
    );

    const w = image.naturalWidth * scale;
    const h = image.naturalHeight * scale;

    ctx.drawImage(
      image,
      (width - w) / 2,
      height * 0.19,
      w,
      h
    );
  } else {
    ctx.font = "100px sans-serif";
    ctx.fillText("🎬", width / 2, height * 0.40);
  }

  ctx.fillStyle = "#ffd166";
  ctx.font = "bold 30px sans-serif";
  ctx.fillText(
    "दृश्य " + (index + 1) + " / " + total,
    width / 2,
    height * 0.68
  );

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 34px sans-serif";

  const words = sentence.split(/\s+/);
  const lines = [];
  let line = "";

  for (const word of words) {
    const test = line ? line + " " + word : word;

    if (ctx.measureText(test).width > width - 80 && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }

  if (line) lines.push(line);

  const lineHeight = 50;
  const startY =
    height * 0.77 -
    ((lines.length - 1) * lineHeight) / 2;

  lines.forEach((text, i) => {
    ctx.fillText(text, width / 2, startY + i * lineHeight);
  });
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("चित्र लोड नहीं हुआ।"));
    img.src = url;
  });
}

// कहानी को WebM वीडियो में रिकॉर्ड करना
makeVideoBtn.addEventListener("click", async () => {
  const story = storyInput.value.trim();

  if (!story) {
    videoStatus.textContent = "पहले कहानी लिखें।";
    storyInput.focus();
    return;
  }

  if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) {
    videoStatus.textContent =
      "आपका ब्राउज़र वीडियो रिकॉर्डिंग सपोर्ट नहीं करता।";
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
  speakBtn.disabled = true;

  let stream;
  let recorder;
  let audioContext;
  let voiceSource;
  let voiceDestination;

  try {
    const canvas = document.createElement("canvas");
    canvas.width = 720;
    canvas.height = 1280;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Canvas उपलब्ध नहीं है।");
    }

    const images = [];

    for (const item of uploadedImages) {
      try {
        images.push(await loadImage(item.url));
      } catch {
        images.push(null);
      }
    }

    // हिंदी आवाज़ रिकॉर्ड करने के लिए ऑडियो ट्रैक बनाने की कोशिश
    if (
      includeVoice.checked &&
      "speechSynthesis" in window &&
      window.AudioContext &&
      typeof speechSynthesis.speak === "function"
    ) {
      try {
        audioContext = new AudioContext();
        voiceDestination = audioContext.createMediaStreamDestination();
        await audioContext.resume();
      } catch (error) {
        console.warn("Audio recording unavailable", error);
      }
    }

    stream = canvas.captureStream(24);

    if (voiceDestination) {
      voiceDestination.stream.getAudioTracks().forEach(track => {
        stream.addTrack(track);
      });
    }

    recorder = new MediaRecorder(stream, { mimeType });
    const chunks = [];

    recorder.ondataavailable = event => {
      if (event.data && event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    const finished = new Promise((resolve, reject) => {
      recorder.onstop = resolve;
      recorder.onerror = () => reject(new Error("रिकॉर्डिंग में त्रुटि।"));
    });

    recorder.start(250);

    const sceneDuration = 3000;
    const totalDuration = scenes.length * sceneDuration;
    const startTime = performance.now();

    // आवाज़ और वीडियो की टाइमिंग एक जैसी रखने के लिए
    // हर दृश्य पर आवाज़ चलाने की कोशिश करें।
    let currentScene = -1;

    const render = now => {
      const elapsed = now - startTime;

      const index = Math.min(
        scenes.length - 1,
        Math.floor(elapsed / sceneDuration)
      );

      drawVideoFrame(
        ctx,
        canvas.width,
        canvas.height,
        scenes[index],
        index,
        scenes.length,
        images[index] || null
      );

      videoStatus.textContent =
        "वीडियो बन रहा है: दृश्य " +
        (index + 1) + " / " + scenes.length;

      if (
        includeVoice.checked &&
        index !== currentScene &&
        "speechSynthesis" in window
      ) {
        currentScene = index;
        speechSynthesis.cancel();

        const speech = new SpeechSynthesisUtterance(scenes[index]);
        speech.lang = "hi-IN";
        speech.rate = 0.9;

        speechSynthesis.speak(speech);
      }

      if (elapsed < totalDuration) {
        requestAnimationFrame(render);
      } else {
        speechSynthesis.cancel();
        setTimeout(() => {
          if (recorder.state !== "inactive") recorder.stop();
        }, 300);
      }
    };

    requestAnimationFrame(render);
    await finished;

    const blob = new Blob(chunks, { type: mimeType });

    if (!blob.size) {
      throw new Error("वीडियो फाइल खाली है।");
    }

    if (videoURL) URL.revokeObjectURL(videoURL);
    videoURL = URL.createObjectURL(blob);

    videoPreview.src = videoURL;
    videoPreview.style.display = "block";
    videoPreview.load();

    downloadVideo.href = videoURL;
    downloadVideo.download = "sourabh-ai-cartoon.webm";
    downloadVideo.hidden = false;

    videoStatus.textContent =
      "वीडियो तैयार है। प्ले करके देखें और डाउनलोड करें।";

    cartoonStatus.textContent =
      "WebM वीडियो तैयार — " + scenes.length + " दृश्य।";

  } catch (error) {
    console.error(error);

    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }

    videoStatus.textContent =
      "वीडियो नहीं बन पाया। पेज रीफ्रेश करके फिर कोशिश करें।";

  } finally {
    speechSynthesis.cancel();

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    if (audioContext) {
      await audioContext.close().catch(() => {});
    }

    makeVideoBtn.disabled = false;
    generateBtn.disabled = false;
    speakBtn.disabled = false;
  }
});

renderEarnings();

console.log("Sourabh AI Cartoon Maker ready.");
