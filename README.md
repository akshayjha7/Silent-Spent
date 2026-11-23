<h1 align="center">💧 SilentSpend</h1>

<p align="center">
  <strong>Track the Money You Don't Notice.</strong>
</p>


## 🛠️ Tech Stack

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=html,css,js,react,vite,python,flask,sqlite,cloudflare,git,github,vscode&perline=6" />
  </a>
</p>

| Technology | Purpose |
|---|---|
| <img src="https://skillicons.dev/icons?i=html" width="20" /> **HTML5** | Page structure |
| <img src="https://skillicons.dev/icons?i=css" width="20" /> **CSS3** | Styling |
| <img src="https://skillicons.dev/icons?i=js" width="20" /> **JavaScript** | Application logic |
| <img src="https://skillicons.dev/icons?i=react" width="20" /> **React.js** | Frontend |
| <img src="https://skillicons.dev/icons?i=vite" width="20" /> **Vite** | Frontend build tool |
| <img src="https://skillicons.dev/icons?i=python" width="20" /> **Python** | Backend |
| <img src="https://skillicons.dev/icons?i=flask" width="20" /> **Flask** | REST API |
| <img src="https://skillicons.dev/icons?i=sqlite" width="20" /> **SQLite** | Database |
| <img src="https://skillicons.dev/icons?i=cloudflare" width="20" /> **Cloudflare Pages** | Frontend deployment |
| <img src="https://skillicons.dev/icons?i=git" width="20" /> **Git** | Version control |
| <img src="https://skillicons.dev/icons?i=github" width="20" /> **GitHub** | Code hosting |
| <img src="https://skillicons.dev/icons?i=vscode" width="20" /> **VS Code** | Code editor |
| 📊 **Recharts** | Analytics charts |
| 🔍 **SerpAPI** | Google search integration |
| 🔗 **Flask-CORS** | Frontend-backend communication |
| 🚀 **Render** | Backend deployment |



## 📖 About

**SilentSpend** is a smart subscription management platform that helps users track recurring expenses, manage subscriptions, analyze spending, and identify potential savings.



## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Dashboard** | Overview of monthly spending, yearly expenses and subscriptions |
| 💳 **Subscription Management** | Add, view and delete subscriptions |
| 📈 **Analytics** | Visual representation of subscription expenses |
| 💧 **Silent Leak Detector** | Identify unused subscriptions and calculate potential yearly savings |
| 🔍 **Discover** | Search subscription services and explore websites using SerpAPI |
| 📅 **Payment Tracking** | Keep track of upcoming subscription payments |



## 🔍 SerpAPI Integration

SerpAPI powers the **Discover** feature.

- Accepts subscription search queries
- Fetches Google organic search results
- Retrieves up to 8 results
- Displays titles, descriptions and website links



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



## 👨‍💻 Contributors

| Contributor | Role |
|---|---|
| [@akshayjha7](https://github.com/akshayjha7) | Repository Creator |
| [@PrashUpdates](https://github.com/PrashUpdates) | Contributor |
