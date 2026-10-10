# Sourabh AI Cartoon

A simple mobile-friendly prototype for a Hindi cartoon story-to-video app. This project runs directly in the browser and is suitable for Android-friendly mobile screens.

## Features included

- Hindi story input box
- Auto-generated cartoon scene list from the story
- Hindi narration using the browser's Text-to-Speech engine
- Video preview on a local canvas animation
- Download finished video as a `.webm` file
- Mobile-first design for Android-style usage

## Important: real AI video generation requires API or paid services

This prototype does not call any paid AI video service or require an API key to work in demo mode.

However, for a real production version, these features would require external services:

1. AI video scene generation
   - Examples: Runway, Pika, Kling, Replicate, OpenAI video tools, or custom model endpoints
   - Usually requires an API key and pay-per-generation usage

2. Hindi voice narration
   - Examples: Google Cloud Text-to-Speech, Azure Speech, ElevenLabs
   - Usually requires an API key and sometimes a paid plan

3. Cloud storage or hosting
   - Needed if you want to upload and share generated videos online
   - Often includes hosting costs

## This prototype uses no paid services

- Browser SpeechSynthesis for Hindi narration
- Browser canvas animation and MediaRecorder for preview/download
- No external API calls are made

## How to run

Because this is a static app, you can simply open `index.html` in a browser.

For a cleaner local preview, you can also run a simple local server:

```bash
cd sourabh-ai-cartoon-maker
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Notes

- Some browsers may restrict speech or media recording behavior if opened from a file path instead of a local server.
- For best results, use a modern Chrome/Edge browser.
- The download output is in `.webm` format, which is a browser-supported video format for the prototype.

## Suggested next upgrades

- Connect to a real AI video API with user-provided keys
- Add a backend to store videos and user projects
- Add Hindi text cleanup and scene summarization
- Add character and background style selection
- Add login and project history for users

## License

This project is for prototype/demo use.

