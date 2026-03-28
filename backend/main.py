from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os, requests, json, time
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="ContentFlow AI Backend", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RequestBody(BaseModel):
    topic: str
    content_types: list[str]

@app.get("/health")
def health():
    api_key = os.getenv("GEMINI_API_KEY")
    return {"status": "ok", "gemini_key_set": bool(api_key), "version": "2.0.0"}

def build_prompt(topic: str, content_types: list[str]) -> str:
    needs_hindi    = "Hindi"    in content_types
    needs_telugu   = "Telugu"   in content_types
    needs_linkedin = "LinkedIn" in content_types
    needs_twitter  = "Twitter"  in content_types
    needs_blog     = "Blog"     in content_types

    loc_note = f"Translate into: {', '.join([l for l in ['Hindi','Telugu'] if l in content_types])}." \
               if (needs_hindi or needs_telugu) else "Set hindi and telugu to null (not requested)."

    platforms = []
    if needs_linkedin: platforms.append("LinkedIn post (~150 words, professional tone)")
    if needs_twitter:  platforms.append("Twitter/X post (max 270 chars, punchy, include 2-3 hashtags)")
    if needs_blog:     platforms.append("Blog intro paragraph (~100 words, SEO-friendly)")
    dist_note = f"Create: {'; '.join(platforms)}." if platforms else "Set linkedin, twitter, blog to null."

    return f"""You are ContentFlow AI. Return ONLY a valid JSON object (no markdown, no fences).

TOPIC: {topic}
SELECTED: {", ".join(content_types)}

Agents:
1. content_generator: 150-200 word raw content.
2. compliance: status PASS/FAIL, issues list, approved_content.
3. localization: {loc_note}
4. distribution: {dist_note}
5. intelligence: 5-8 hashtags (no #), best_time object, 3 improvement tips.

JSON shape:
{{
  "content_generator": {{"raw_content": "..."}},
  "compliance": {{"status": "PASS", "issues": [], "approved_content": "..."}},
  "localization": {{"hindi": null, "telugu": null}},
  "distribution": {{"linkedin": null, "twitter": null, "blog": null}},
  "intelligence": {{"hashtags": [], "best_time": {{}}, "improvements": []}}
}}"""

def call_gemini(prompt: str, retries: int = 2) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not set.")

    url = "https://openrouter.ai/api/v1/chat/completions"

    payload = {
        "model": "google/gemini-2.0-flash-001",   # same model, free tier
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 2048,
        "temperature": 0.7,
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    last_error = None
    for attempt in range(retries + 1):
        try:
            r = requests.post(url, json=payload, headers=headers, timeout=30)
            if r.status_code == 200:
                return r.json()["choices"][0]["message"]["content"]
            last_error = r.text
            if attempt < retries:
                time.sleep(1.5 * (attempt + 1))
        except Exception as e:
            last_error = str(e)
            if attempt < retries:
                time.sleep(1.5)

    raise HTTPException(status_code=502, detail=f"Gemini failed: {last_error}")
def parse_json_response(text: str) -> dict:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        lines = lines[1:] if lines[0].startswith("```") else lines
        if lines and lines[-1].strip() == "```": lines = lines[:-1]
        cleaned = "\n".join(lines).strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass
    s, e = cleaned.find("{"), cleaned.rfind("}") + 1
    if s >= 0 and e > s:
        try: return json.loads(cleaned[s:e])
        except json.JSONDecodeError as ex:
            raise HTTPException(status_code=500, detail=f"JSON parse error: {ex}")
    raise HTTPException(status_code=500, detail="No JSON found in AI response.")

@app.post("/generate")
def generate_content(req: RequestBody):
    if not req.topic.strip():
        raise HTTPException(status_code=422, detail="Topic cannot be empty.")
    if not req.content_types:
        raise HTTPException(status_code=422, detail="Select at least one content type.")
    data = parse_json_response(call_gemini(build_prompt(req.topic, req.content_types)))
    return {"success": True, "data": data}
