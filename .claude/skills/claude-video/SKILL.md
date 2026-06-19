---
name: claude-video
description: Analyze any video by downloading it, extracting frames and subtitles, and performing deep multimodal analysis. Use this skill whenever the user provides a YouTube URL or video link and wants to understand, summarize, or ask questions about video content.
---

# Claude Video — Watch Any Video

This skill enables deep video analysis by downloading videos, extracting frames at appropriate density, transcribing audio, and performing thorough visual + textual analysis.

## Trigger

Use this skill when the user provides:
- A YouTube URL or any video URL (Vimeo, X/Twitter, TikTok, Twitch clip, etc.)
- A local video file path
- A request to "watch", "analyze", "summarize", or "understand" a video

## Workflow

### Step 1: Preflight Check
Before processing, verify these dependencies are available:
- `ffmpeg` and `ffprobe` — for frame extraction
- `yt-dlp` — for video download
- Whisper API key (Groq preferred, OpenAI fallback) — for transcription when no native captions

If missing, provide installation instructions:
- macOS: `brew install ffmpeg yt-dlp`
- Linux: `sudo apt install ffmpeg && pip install yt-dlp`
- API key: store in `~/.config/watch/.env` as `GROQ_API_KEY` or `OPENAI_API_KEY`

### Step 2: Download Video
```bash
yt-dlp -o /tmp/video.%(ext)s "<URL>"
```

### Step 3: Get Video Duration and Extract Frames

Scale frame extraction based on video length:
| Duration | Frame Rate |
|----------|-----------|
| < 2 min  | ~2 fps    |
| 2–10 min | ~1 fps    |
| 10–30 min| 1 frame/30s |
| > 30 min | 100 frames total (sparse) |

Max resolution: 512px wide to balance quality and token cost.

```bash
ffmpeg -i /tmp/video.mp4 -vf "fps=1,scale=512:-1" /tmp/frames/frame_%04d.jpg
```

For focused analysis, support `--start HH:MM:SS --end HH:MM:SS` flags for higher-density extraction on a specific segment.

### Step 4: Extract Transcript
1. Try native captions first: `yt-dlp --write-auto-sub --skip-download "<URL>"`
2. If unavailable, use Whisper API for audio transcription
3. Parse VTT/SRT into clean timestamped text

### Step 5: Analyze

With frames and transcript in hand:
- Describe what is visually happening in the video
- Summarize the content, arguments, or story
- Note key moments with timestamps
- Answer any specific questions the user asked about the video

## Notes

- Best results for videos under 10 minutes
- Always cite timestamps when referencing specific moments
- If the video is private or region-locked, inform the user

Source: https://github.com/bradautomates/claude-video
