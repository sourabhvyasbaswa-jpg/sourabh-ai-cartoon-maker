* {
  box-sizing: border-box;
}

:root {
  --bg: #f5efff;
  --panel: #ffffff;
  --primary: #7b2cbf;
  --primary-dark: #5a1f92;
  --accent: #ffb703;
  --text: #1f1b2d;
  --muted: #6c6483;
  --card-border: #e7d9ff;
  --success: #129b59;
  --shadow: 0 10px 24px rgba(123, 44, 191, 0.15);
}

html, body {
  margin: 0;
  min-height: 100%;
  font-family: Arial, sans-serif;
  background: linear-gradient(180deg, #f4ebff 0%, #f7f3ff 100%);
  color: var(--text);
}

body {
  display: flex;
  justify-content: center;
  padding: 16px;
}

.app-shell {
  width: 100%;
  max-width: 480px;
}

.topbar {
  margin-bottom: 12px;
}

.eyebrow {
  margin: 0;
  color: var(--primary);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 12px;
}

h1 {
  margin: 8px 0 0;
  font-size: clamp(24px, 5vw, 32px);
}

h2 {
  margin: 0;
  font-size: 18px;
}

.card {
  background: var(--panel);
  border: 1px solid var(--card-border);
  border-radius: 18px;
  box-shadow: var(--shadow);
  padding: 16px;
  margin-bottom: 16px;
}

label {
  display: block;
  font-weight: 700;
  margin-bottom: 10px;
}

textarea {
  width: 100%;
  min-height: 140px;
  border: 1px solid #d9c8ff;
  border-radius: 12px;
  resize: vertical;
  padding: 12px;
  font-size: 16px;
  background: #faf7ff;
}

.quick-actions,
.preview-actions {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  flex-wrap: wrap;
}

button {
  flex: 1;
  min-width: 130px;
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

.primary {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
}

.secondary {
  background: #f0e8ff;
  color: var(--primary-dark);
}

.service-status ul {
  margin: 10px 0 0;
  padding-left: 18px;
  color: var(--muted);
  line-height: 1.6;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

#sceneCount {
  font-size: 13px;
  color: var(--muted);
}

.scene-list {
  display: grid;
  gap: 10px;
}

.scene-item {
  background: linear-gradient(135deg, #f7f1ff, #edf5ff);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 12px;
}

.scene-item h3 {
  margin: 0 0 6px;
  font-size: 16px;
}

.scene-item p {
  margin: 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.5;
}

.preview-box {
  overflow: hidden;
}

canvas {
  width: 100%;
  max-width: 100%;
  height: auto;
  border-radius: 16px;
  border: 1px solid #e4dbff;
  background: #f4f0ff;
  display: block;
  margin: 10px 0 0;
}

.status-text {
  margin: 12px 0 0;
  color: var(--success);
  font-weight: 700;
}

@media (max-width: 420px) {
  body {
    padding: 12px;
  }

  .quick-actions,
  .preview-actions {
    flex-direction: column;
  }

  button {
    width: 100%;
  }
}
