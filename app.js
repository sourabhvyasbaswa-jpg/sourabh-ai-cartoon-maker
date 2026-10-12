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
