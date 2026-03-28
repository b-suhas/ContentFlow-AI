******ContentFlow AI — Multi-Agent Enterprise Content Generation System******

ContentFlow AI is a full-stack, multi-agent AI platform that automates enterprise content creation, compliance checking, localization, and platform-specific formatting in a single workflow.

Built with React + Vite on the frontend and FastAPI + Uvicorn on the backend, the system uses the Gemini API from Google to simulate five specialized AI agents in a single prompt.

**Problem Statement**

Enterprise marketing and communication teams face major challenges:

Creating unique content for LinkedIn, Twitter/X, and Blogs is time-consuming
Manual compliance and brand safety checks delay publishing
Separate workflows for regional language translation (Hindi, Telugu)
Difficulty deciding hashtags, posting times, and improvements
Repetitive, error-prone, multi-tool workflow

Most AI tools only generate text — they do not handle review, localization, formatting, and optimization together.

**Our Solution — ContentFlow AI**

ContentFlow AI introduces a multi-agent AI pipeline where five AI roles work together:

Content Generator — Creates raw content
Compliance Agent — Checks brand/legal safety (PASS/FAIL + fix)
Localization Agent — Translates into Hindi & Telugu
Distribution Agent — Formats for LinkedIn, Twitter, Blog
Intelligence Agent — Suggests hashtags, timing, improvements

**Architecture Diagram (Simple Flowchart)**

<img width="940" height="700" alt="image" src="https://github.com/user-attachments/assets/e6e22d7f-a9ad-4052-9c46-2dbd3a106c52" />


**Setup Steps**

1️⃣ Clone the Repository
git clone <your-repo-link>
cd contentflow-ai
2️⃣ Backend Setup (FastAPI)
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt

Create a .env file:

GEMINI_API_KEY=your_api_key_here

Run backend:

uvicorn main:app --reload

Backend runs at: http://127.0.0.1:8000

3️⃣ Frontend Setup (React + Vite)
cd frontend
npm install
npm run dev

Frontend runs at: http://localhost:5173

Vite proxy forwards /generate and /health to backend.

4️⃣ Test the App
Open browser at localhost:5173
Enter a topic
Select content types
Click Generate

**Demo Screenshots**

🔹 Main Interface
<img width="940" height="451" alt="image" src="https://github.com/user-attachments/assets/9eadc703-c9c5-4e5c-a1ea-8a751650af49" />

🔹 Generated Content Output
<img width="940" height="451" alt="image" src="https://github.com/user-attachments/assets/8026479f-2312-47f4-a734-4c7c0ec45ab7" />

🔹 Localization (Hindi / Telugu)
<img width="940" height="452" alt="image" src="https://github.com/user-attachments/assets/fbe636da-2cf2-4b55-b95c-f93452bfb782" />

🔹 Intelligence Agent Output
<img width="940" height="307" alt="image" src="https://github.com/user-attachments/assets/d208a0fd-7274-42c8-9c45-c8af84d199a7" />

**Key Features**

Multi-agent AI pipeline in a single prompt
Real-time content generation
Compliance PASS/FAIL with corrected content
Hindi & Telugu localization
Platform-specific formatting
Hashtag & timing intelligence
Retry logic + robust JSON parsing
Responsive dark UI

**Future Scope**

User authentication & content history
More Indian language support
A/B content variants
Direct social media publishing
Docker-based enterprise deployment

**Conclusion**

ContentFlow AI demonstrates how multi-agent LLM architecture can automate real-world enterprise content workflows — from idea to publish-ready content — in seconds.
