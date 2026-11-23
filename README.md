<h1 align="center">💧 SilentSpend</h1>

<p align="center">
  <strong>Track the Money You Don't Notice.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloudflare_Pages-F38020?style=flat-square&logo=cloudflare&logoColor=white" />
  <img src="https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=black" />
  <img src="https://img.shields.io/badge/SerpAPI-4285F4?style=flat-square&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

---

## 📖 About

**SilentSpend** is a smart subscription management platform that helps users track recurring expenses, manage subscriptions, analyze spending, and identify potential savings.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Dashboard** | Overview of monthly spending, yearly expenses and subscriptions |
| 💳 **Subscription Management** | Add, view and delete subscriptions |
| 📈 **Analytics** | Visual representation of subscription expenses |
| 💧 **Silent Leak Detector** | Identify unused subscriptions and calculate potential yearly savings |
| 🔍 **Discover** | Search subscription services and explore websites using SerpAPI |
| 📅 **Payment Tracking** | Keep track of upcoming subscription payments |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| <img src="https://skillicons.dev/icons?i=react" width="20" /> **React.js** | Frontend |
| <img src="https://skillicons.dev/icons?i=js" width="20" /> **JavaScript** | Application logic |
| <img src="https://skillicons.dev/icons?i=css" width="20" /> **CSS3** | Styling |
| <img src="https://skillicons.dev/icons?i=python" width="20" /> **Python** | Backend |
| <img src="https://skillicons.dev/icons?i=flask" width="20" /> **Flask** | REST API |
| <img src="https://skillicons.dev/icons?i=sqlite" width="20" /> **SQLite** | Database |
| 📊 **Recharts** | Analytics charts |
| 🔍 **SerpAPI** | Google search integration |
| 🔗 **Flask-CORS** | Frontend-backend communication |
| <img src="https://skillicons.dev/icons?i=cloudflare" width="20" /> **Cloudflare Pages** | Frontend deployment |
| 🚀 **Render** | Backend deployment |

---

## 🔍 SerpAPI Integration

SerpAPI powers the **Discover** feature.

- Accepts subscription search queries
- Fetches Google organic search results
- Retrieves up to 8 results
- Displays titles, descriptions and website links

---

## 🏗️ Project Structure

```
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
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd SilentSpend
```

### 2️⃣ Install frontend dependencies

```bash
npm install
```

### 3️⃣ Install backend dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 4️⃣ Configure environment variables

Create a `.env` file inside the `backend` folder:

```env
SERPAPI_KEY=your_serpapi_api_key
```

### 5️⃣ Start the backend

```bash
python app.py
```

### 6️⃣ Start the frontend

Open another terminal in the main project folder:

```bash
npm run dev
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Backend status |
| `GET` | `/api/subscriptions` | Get subscriptions |
| `POST` | `/api/subscriptions` | Add subscription |
| `DELETE` | `/api/subscriptions/:id` | Delete subscription |
| `PATCH` | `/api/subscriptions/:id/usage` | Update usage |
| `GET` | `/api/insights` | Get financial insights |
| `GET` | `/api/discover?q=Netflix` | Search subscriptions |

---

## 🌐 Live Deployment

| Service | Link |
|---|---|
| 🖥️ Frontend | [YOUR_CLOUDFLARE_URL](YOUR_CLOUDFLARE_URL) |
| ⚙️ Backend | [silent-spent-backend.onrender.com](https://silent-spent-backend.onrender.com) |

---

## 👨‍💻 Contributors

| Contributor | Role |
|---|---|
| [@akshayjhaa7](https://github.com/akshayjha7) | Repository Creator |
| [@PrashUpdates](https://github.com/PrashUpdates) | Contributor |

---

<p align="center">
  <strong>💧 SilentSpend</strong>
  <br/>
  Track the Money You Don't Notice.
</p>