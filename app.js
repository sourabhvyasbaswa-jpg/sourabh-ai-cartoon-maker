  window.speechSynthesis.speak(speech);
});

// AI जवाब की जाँच का अभ्यास
checkAnswerBtn.addEventListener("click", function () {
  const answer = aiAnswer.value.trim();

  if (!answer) {
    taskMessage.textContent = "पहले AI का जवाब लिखो।";
    aiAnswer.focus();
    return;
  }

  taskMessage.textContent =
    "अभ्यास पूरा हुआ! जवाब की सटीकता, स्पष्टता और उपयोगिता जाँचो।";

  taskStatus.textContent = "अभ्यास पूरा — भुगतान वाला टास्क नहीं";
});

console.log("Sourabh AI Earn & Cartoon शुरू हो गया!");
const storyInput = document.getElementById("storyInput");
const generateBtn = document.getElementById("generateBtn");
const sceneList = document.getElementById("sceneList");
const speakBtn = document.getElementById("speakBtn");

const aiAnswer = document.getElementById("aiAnswer");
const checkAnswerBtn = document.getElementById("checkAnswerBtn");

const taskMessage = document.getElementById("taskMessage");
const taskStatus = document.getElementById("taskStatus");
const cartoonStatus = document.getElementById("cartoonStatus");

// कहानी को दृश्यों में बाँटना
function splitStory(story) {
  return story
    .split(/[।.!?\n]+/)
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 0);
}

// कहानी के टेक्स्ट दृश्य बनाना
generateBtn.addEventListener("click", function () {
  const story = storyInput.value.trim();

  if (!story) {
    alert("पहले अपनी कहानी लिखो!");
    storyInput.focus();
    return;
  }

  const scenes = splitStory(story);
  sceneList.replaceChildren();

  scenes.forEach((sentence, index) => {
    const scene = document.createElement("div");
    scene.className = "scene";

    const title = document.createElement("h3");
    title.textContent = "🎬 दृश्य " + (index + 1);

    const description = document.createElement("p");
    description.textContent = sentence;

    scene.append(title, description);
    sceneList.appendChild(scene);
  });

  cartoonStatus.textContent = scenes.length + " दृश्य तैयार";

  alert(
    "कहानी के " + scenes.length +
    " दृश्य तैयार हैं। यह अभी टेक्स्ट डेमो है, वीडियो नहीं।"
  );
});

// हिंदी में कहानी सुनना
speakBtn.addEventListener("click", function () {
  const story = storyInput.value.trim();

  if (!story) {
    alert("पहले कहानी लिखो!");
    return;
  }

  if (!("speechSynthesis" in window)) {
    alert("आपका ब्राउज़र आवाज की सुविधा सपोर्ट नहीं करता।");
    return;
  }

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(story);
  speech.lang = "hi-IN";
  speech.rate = 0.9;

  window.speechSynthesis.speak(speech);
});

// AI जवाब की जाँच का अभ्यास
checkAnswerBtn.addEventListener("click", function () {
  const answer = aiAnswer.value.trim();

  if (!answer) {
    taskMessage.textContent = "पहले AI का जवाब लिखो।";
    aiAnswer.focus();
    return;
  }

  taskMessage.textContent =
    "अभ्यास पूरा हुआ! जवाब की सटीकता, स्पष्टता और उपयोगिता जाँचो। " +
    "यह डेमो अपने आप जवाब की सत्यता नहीं जाँचता और इससे कोई भुगतान नहीं मिला।";

  taskStatus.textContent = "अभ्यास पूरा — भुगतान वाला टास्क नहीं";
});

console.log("Sourabh AI Earn & Cartoon शुरू हो गया!");
const dinosaurBtn = document.getElementById("dinosaurBtn");

if (dinosaurBtn) {
  dinosaurBtn.addEventListener("click", function () {
    storyInput.value = `राहुल जंगल में रास्ता भटक गया।
अचानक एक विशाल टी-रेक्स डायनासोर उसके सामने आ गया।
डायनासोर ने जोर से दहाड़ लगाई और राहुल के पीछे दौड़ने लगा।
राहुल ने अपनी समझदारी से डायनासोर को दलदल की तरफ आकर्षित किया।
डायनासोर कीचड़ में फँस गया और राहुल सुरक्षित जगह पहुँच गया।
राहुल ने सीखा कि मुश्किल समय में समझदारी सबसे बड़ी ताकत है।`;

    storyInput.focus();
  });
}
// Sourabh AI - Cartoon Video Maker
(function () {
  const makeVideoButton = document.getElementById("makeVideoBtn");
  const storyBox = document.getElementById("storyInput");
  const videoStatusBox = document.getElementById("videoStatus");
  const videoCanvas = document.getElementById("videoCanvas");
  const videoPlayer = document.getElementById("videoPreview");

  if (
    !makeVideoButton ||
    !storyBox ||
    !videoStatusBox ||
    !videoCanvas ||
    !videoPlayer
  ) {
    console.error("Video Maker ke HTML elements nahi mile.");
    return;
  }

  makeVideoButton.addEventListener("click", async function () {
    const story = storyBox.value.trim();

    if (!story) {
      videoStatusBox.textContent = "पहले अपनी कहानी लिखो!";
      storyBox.focus();
      return;
    }

    if (
      !window.MediaRecorder ||
      !videoCanvas.captureStream
    ) {
      videoStatusBox.textContent =
        "आपका ब्राउज़र वीडियो रिकॉर्डिंग सपोर्ट नहीं करता।";
      return;
    }

    const mimeTypes = [
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm"
    ];

    const mimeType = mimeTypes.find(type =>
      MediaRecorder.isTypeSupported(type)
    );

    if (!mimeType) {
      videoStatusBox.textContent =
        "इस ब्राउज़र में समर्थित वीडियो फॉर्मेट नहीं मिला।";
      return;
    }

    const ctx = videoCanvas.getContext("2d");

    const scenes = story
      .split(/[।.!?\n]+/)
      .map(line => line.trim())
      .filter(Boolean);

    if (!scenes.length) {
      videoStatusBox.textContent = "कहानी के दृश्य नहीं मिले।";
      return;
    }

    makeVideoButton.disabled = true;
    videoStatusBox.textContent = "आपका वीडियो बन रहा है...";

    let stream;
    let recorder;

    try {
      const width = videoCanvas.width;
      const height = videoCanvas.height;

      // मोबाइल के लिए पोर्ट्रेट वीडियो
      function drawScene(text, index, progress) {
        ctx.fillStyle = "#10152f";
        ctx.fillRect(0, 0, width, height);

        // सजावटी सितारे
        ctx.fillStyle = "#ffd166";

        for (let i = 0; i < 30; i++) {
          const x = (i * 97 + index * 23) % width;
          const y = (i * 173) % height;
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // दृश्य का शीर्षक
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.font = "bold 42px sans-serif";
        ctx.fillText(
          "Sourabh AI Cartoon",
          width / 2,
          150
        );

        ctx.fillStyle = "#ffd166";
        ctx.font = "bold 34px sans-serif";
        ctx.fillText(
          "दृश्य " + (index + 1),
          width / 2,
          250
        );

        // कहानी का टेक्स्ट
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 38px sans-serif";

        const words = text.split(/\s+/);
        const lines = [];
        let currentLine = "";

        for (const word of words) {
          const testLine = currentLine
            ? currentLine + " " + word
            : word;

          if (
            ctx.measureText(testLine).width > width - 100 &&
            currentLine
          ) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }

        if (currentLine) lines.push(currentLine);

        const lineHeight = 60;
        const startY =
          height / 2 -
          ((lines.length - 1) * lineHeight) / 2;

        lines.forEach((line, i) => {
          ctx.fillText(
            line,
            width / 2,
            startY + i * lineHeight
          );
        });

        // प्रगति पट्टी
        ctx.fillStyle = "#555b7a";
        ctx.fillRect(60, height - 100, width - 120, 12);

        ctx.fillStyle = "#06d6a0";
        ctx.fillRect(
          60,
          height - 100,
          (width - 120) * progress,
          12
        );
      }

      stream = videoCanvas.captureStream(24);

      recorder = new MediaRecorder(stream, {
        mimeType: mimeType
      });

      const chunks = [];

      recorder.ondataavailable = event => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      const recordingFinished = new Promise((resolve, reject) => {
        recorder.onstop = resolve;
        recorder.onerror = () => {
          reject(new Error("वीडियो रिकॉर्ड नहीं हो पाया।"));
        };
      });

      recorder.start();

      const sceneDuration = 2500;
      const frameInterval = 1000 / 24;
      const totalDuration = scenes.length * sceneDuration;
      const startTime = performance.now();

      await new Promise(resolve => {
        function renderFrame(now) {
          const elapsed = now - startTime;

          const sceneIndex = Math.min(
            scenes.length - 1,
            Math.floor(elapsed / sceneDuration)
          );

          const sceneProgress =
            (elapsed % sceneDuration) / sceneDuration;

          drawScene(
            scenes[sceneIndex],
            sceneIndex,
            sceneProgress
          );

          videoStatusBox.textContent =
            "वीडियो बन रहा है: दृश्य " +
            (sceneIndex + 1) +
            " / " +
            scenes.length;

          if (elapsed < totalDuration) {
            setTimeout(
              () => requestAnimationFrame(renderFrame),
              Math.max(0, frameInterval - 5)
            );
          } else {
            drawScene(
              scenes[scenes.length - 1],
              scenes.length - 1,
              1
            );

            setTimeout(resolve, 300);
          }
        }

        requestAnimationFrame(renderFrame);
      });

      recorder.stop();
      await recordingFinished;

      const videoBlob = new Blob(chunks, {
        type: mimeType
      });

      if (!videoBlob.size) {
        throw new Error("वीडियो फाइल खाली है।");
      }

      const videoURL = URL.createObjectURL(videoBlob);

      videoPlayer.src = videoURL;
      videoPlayer.style.display = "block";
      videoPlayer.load();

      const downloadLink = document.createElement("a");
      downloadLink.href = videoURL;
      downloadLink.download = "sourabh-ai-cartoon.webm";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      videoStatusBox.textContent =
        "वीडियो तैयार है! नीचे प्ले करके देखो।";

    } catch (error) {
      console.error(error);

      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }

      videoStatusBox.textContent =
        "वीडियो नहीं बन पाया। पेज को दोबारा खोलकर कोशिश करो।";

    } finally {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      makeVideoButton.disabled = false;
    }
  });
})();
