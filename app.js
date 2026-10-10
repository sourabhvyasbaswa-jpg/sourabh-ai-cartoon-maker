const storyInput = document.getElementById('storyInput');
const sampleBtn = document.getElementById('sampleBtn');
const generateBtn = document.getElementById('generateBtn');
const previewBtn = document.getElementById('previewBtn');
const downloadBtn = document.getElementById('downloadBtn');
const sceneList = document.getElementById('sceneList');
const sceneCount = document.getElementById('sceneCount');
const statusText = document.getElementById('statusText');
const canvas = document.getElementById('previewCanvas');
const ctx = canvas.getContext('2d');

let previewFrameId = null;

const sampleStory = `एक छोटा हाथी जंगल के बीच में खेल रहा था। अचानक उसे एक जलती हुई आग की लपट दिखाई दी। हाथी ने धैर्य से काम लिया और अपने दोस्तों की मदद से पानी लाकर आग बुझाई। सभी ने मिलकर एक खुशहाल जंगल बनाया।`;

sampleBtn.addEventListener('click', () => {
  storyInput.value = sampleStory;
  statusText.textContent = 'नमूना कहानी तैयार है।';
  statusText.style.color = '#1c9c62';
});

generateBtn.addEventListener('click', () => {
  const story = storyInput.value.trim();

  if (!story) {
    statusText.textContent = 'कृपया कहानी लिखें।';
    statusText.style.color = '#b42318';
    return;
  }

  const scenes = buildScenesFromStory(story);
  renderScenes(scenes);
  statusText.textContent = `${scenes.length} दृश्य तैयार हैं।`;
  statusText.style.color = '#1c9c62';
});

previewBtn.addEventListener('click', () => {
  const story = storyInput.value.trim();

  if (!story) {
    statusText.textContent = 'प्रीव्यू शुरू करने से पहले कहानी लिखें।';
    statusText.style.color = '#b42318';
    return;
  }

  playNarration(story);
  renderPreviewAnimation(story);
  statusText.textContent = 'वीडियो प्रीव्यू चल रहा है...';
  statusText.style.color = '#1c9c62';
});

downloadBtn.addEventListener('click', async () => {
  const story = storyInput.value.trim();

  if (!story) {
    statusText.textContent = 'डाउनलोड करने से पहले कहानी लिखें।';
    statusText.style.color = '#b42318';
    return;
  }

  if (!window.MediaRecorder) {
    statusText.textContent = 'इस ब्राउज़र में WebM डाउनलोड समर्थित नहीं है।';
    statusText.style.color = '#b42318';
    return;
  }

  try {
    statusText.textContent = 'वीडियो बनाया जा रहा है...';
    statusText.style.color = '#1c9c62';

    const blob = await exportCanvasVideo(story);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sourabh-ai-cartoon-demo.webm';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    statusText.textContent = 'वीडियो डाउनलोड शुरू हुआ।';
    statusText.style.color = '#1c9c62';
  } catch (error) {
    console.error(error);
    statusText.textContent = 'वीडियो डाउनलोड विफल हुआ। ब्राउज़र MediaRecorder की आवश्यकता है।';
    statusText.style.color = '#b42318';
  }
});

function buildScenesFromStory(story) {
  const blocks = story
    .split(/[।!?]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (!blocks.length) {
    return [{ id: 1, title: 'दृश्य 1', text: 'कहानी शुरू हुई।', color: '#7b2cbf' }];
  }

  const palette = ['#7b2cbf', '#ff7b00', '#10b981', '#06b6d4', '#f43f5e', '#f59e0b'];

  return blocks.map((text, index) => ({
    id: index + 1,
    title: `दृश्य ${index + 1}`,
    text: text.length > 110 ? `${text.slice(0, 110)}...` : text,
    color: palette[index % palette.length],
  }));
}

function renderScenes(scenes) {
  sceneList.innerHTML = '';

  scenes.forEach((scene) => {
    const item = document.createElement('div');
    item.className = 'scene-item';
    item.innerHTML = `
      <h3>${scene.title}</h3>
      <p>${scene.text}</p>
    `;
    sceneList.appendChild(item);
  });

  sceneCount.textContent = `${scenes.length} दृश्य`;
}

function playNarration(story) {
  if (!('speechSynthesis' in window)) {
    statusText.textContent = 'इस ब्राउज़र में हिंदी वॉयस उपलब्ध नहीं है।';
    statusText.style.color = '#b42318';
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(story);
  utterance.lang = 'hi-IN';
  utterance.rate = 0.9;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

function renderPreviewAnimation(story) {
  const scenes = buildScenesFromStory(story);
  if (previewFrameId) {
    cancelAnimationFrame(previewFrameId);
  }

  let frame = 0;
  const totalFrames = scenes.length * 55;

  function animationLoop() {
    const sceneIndex = Math.min(Math.floor(frame / 55), scenes.length - 1);
    const scene = scenes[sceneIndex];
    const progress = (frame % 55) / 55;

    drawScene(scene, progress, sceneIndex, scenes.length);
    frame += 1;

    if (frame <= totalFrames) {
      previewFrameId = requestAnimationFrame(animationLoop);
    } else {
      statusText.textContent = 'प्रीव्यू समाप्त।';
      statusText.style.color = '#1c9c62';
    }
  }

  animationLoop();
}

function drawScene(scene, progress, index, totalScenes) {
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  const sky = scene.color;
  ctx.fillStyle = '#f7eeff';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height * 0.72);

  ctx.fillStyle = '#f7d76b';
  ctx.beginPath();
  ctx.arc(width - 120, 130, 60, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#73c272';
  ctx.fillRect(0, height * 0.72, width, height * 0.28);

  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.9;
  ctx.fillRect(40, 90, width - 80, 180);
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#2c2247';
  ctx.font = '700 36px Arial';
  ctx.fillText(scene.title, 70, 160);

  ctx.font = '600 30px Arial';
  wrapText(ctx, scene.text, 70, 220, width - 140, 34);

  const x = 90 + Math.sin((progress + index) * 2.8) * 26;
  const y = height * 0.82 - 30;
  drawCharacter(x, y, scene.color);
}

function drawCharacter(x, y, color) {
  ctx.fillStyle = '#f3c89a';
  ctx.beginPath();
  ctx.arc(x, y - 120, 42, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = color;
  ctx.fillRect(x - 48, y - 70, 96, 110);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x - 25, y - 92, 16, 14);
  ctx.fillRect(x + 9, y - 92, 16, 14);

  ctx.fillStyle = '#1d1b2c';
  ctx.fillRect(x - 52, y + 42, 24, 58);
  ctx.fillRect(x + 28, y + 42, 24, 58);

  ctx.fillStyle = '#6b3ea6';
  ctx.fillRect(x - 18, y + 22, 18, 18);
  ctx.fillRect(x + 2, y + 22, 18, 18);
}

function wrapText(context, text, x, y, width, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let i = 0; i < words.length; i += 1) {
    const testLine = line + words[i] + ' ';
    const metrics = context.measureText(testLine);

    if (metrics.width > width && i > 0) {
      context.fillText(line.trim(), x, currentY);
      line = words[i] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }

  context.fillText(line.trim(), x, currentY);
}

async function exportCanvasVideo(story) {
  const scenes = buildScenesFromStory(story);
  const stream = canvas.captureStream(30);
  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
    ? 'video/webm;codecs=vp9'
      
