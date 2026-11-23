💧 SilentSpend

Track the Money You Don't Notice.

SilentSpend is a smart subscription management platform that helps users track recurring expenses, manage subscriptions, analyze spending, and identify potential savings.

✨ Features

- 📊 Dashboard: Overview of monthly spending, yearly expenses and subscriptions.
- 💳 Subscription Management: Add, view and delete subscriptions.
- 📈 Analytics: Visual representation of subscription expenses.
- 💧 Silent Leak Detector: Identify unused subscriptions and calculate potential yearly savings.
- 🔍 Discover: Search subscription services and explore relevant websites using SerpAPI.
- 📅 Payment Tracking: Keep track of upcoming subscription payments.

🛠️ Tech Stack

Technology| Purpose
React.js| Frontend
JavaScript| Application logic
CSS3| Styling
Python| Backend
Flask| REST API
SQLite| Database
Recharts| Analytics charts
SerpAPI| Google search integration
Flask-CORS| Frontend-backend communication
Cloudflare Pages| Frontend deployment
Render| Backend deployment

🔍 SerpAPI Integration

SerpAPI powers the Discover feature.

- Accepts subscription search queries.
- Fetches Google organic search results.
- Retrieves up to 8 results.
- Displays titles, descriptions and website links.

🏗️ Project Structure

SilentSpend/
│
├── backend/
│   ├── app.py
│   ├── database.py
│   ├── requirements.txt
│   └── .env
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── api.js
│   └── main.jsx
│
├── public/
├── package.json
├── index.html
└── README.md

⚙️ Installation & Setup

1. Clone the repository

git clone YOUR_REPOSITORY_URL
cd SilentSpend

2. Install frontend dependencies

npm install

3. Install backend dependencies

cd backend
pip install -r requirements.txt

4. Configure environment variables

Create a ".env" file inside the backend folder:

SERPAPI_KEY=your_serpapi_api_key

5. Start the backend

python app.py

6. Start the frontend

Open another terminal in the main project folder:

npm run dev

🔌 API Endpoints

Method| Endpoint| Description
GET| "/"| Backend status
GET| "/api/subscriptions"| Get subscriptions
POST| "/api/subscriptions"| Add subscription
DELETE| "/api/subscriptions/:id"| Delete subscription
PATCH| "/api/subscriptions/:id/usage"| Update usage
GET| "/api/insights"| Get financial insights
GET| "/api/discover?q=Netflix"| Search subscriptions

🌐 Live Deployment

- Frontend: YOUR_CLOUDFLARE_URL
- Backend: https://silent-spent-backend.onrender.com

👨‍💻 Contributors

Contributor| Role
@akshayjhaa7 | Repository Creator
@PrashUpdates | Contributor

---

<p align="center">
  <strong>💧 SilentSpend</strong>
  <br/>
  Track the Money You Don't Notice.
</p>