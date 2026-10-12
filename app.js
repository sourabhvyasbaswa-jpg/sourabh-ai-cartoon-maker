const storyInput = document.getElementById("storyInput");
const generateBtn = document.getElementById("generateBtn");
const sceneList = document.getElementById("sceneList");
const speakBtn = document.getElementById("speakBtn");

const aiAnswer = document.getElementById("aiAnswer");
const checkAnswerBtn = document.getElementById("checkAnswerBtn");

const taskMessage = document.getElementById("taskMessage");
const taskStatus = document.getElementById("taskStatus");
const cartoonStatus = document.getElementById("cartoonStatus");

// कहानी को छोटे-छोटे दृश्यों में बाँटना
function splitStory(story) {
  return story
    .split(/[।.!?\n]+/)
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 0);
}

// कार्टून कहानी के दृश्य तैयार करना
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

  cartoonStatus.textContent =
    scenes.length + " कहानी के दृश्य तैयार हुए";

  alert(
    scenes.length +
    " दृश्य तैयार हैं! यह अभी टेक्स्ट-आधारित डेमो है, वास्तविक वीडियो नहीं।"
  );
});

// ब्राउज़र की हिंदी आवाज से कहानी सुनना
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

// AI जवाब जाँचने का अभ्यास
checkAnswerBtn.addEventListener("click", function () {
  const answer = aiAnswer.value.trim();

  if (!answer) {
    taskMessage.textContent =
      "पहले AI का जवाब लिखो, फिर जाँच का अभ्यास करो।";
    aiAnswer.focus();
    return;
  }

  taskMessage.textContent =
    "अभ्यास पूरा हुआ! अब जवाब की तथ्यात्मक सटीकता, " +
    "स्पष्टता और उपयोगिता की जाँच करो। यह अपने आप सही-गलत " +
    "निर्धारित नहीं करता और इससे अभी कोई कमाई नहीं हुई है।";

  taskStatus.textContent = "अभ्यास पूरा हुआ — भुगतान वाला टास्क नहीं";
});

console.log("Sourabh AI Earn & Cartoon तैयार है!");
