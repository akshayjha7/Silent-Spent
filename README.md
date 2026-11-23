<h1 align="center">💧 SilentSpend</h1>

<p align="center">
  <strong>Track the Money You Don't Notice.</strong>
</p>


## 🛠️ Tech Stack

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=html,css,js,react,vite,python,flask,sqlite,cloudflare,vscode,git,github&perline=6" />
  </a>
</p>

| Technology | Purpose |
|---|---|
| **React.js** | Frontend |
| **JavaScript** | Application logic |
| **CSS3** | Styling |
| **Python** | Backend |
| **Flask** | REST API |
| **SQLite** | Database |
| **Recharts** | Analytics charts |
| **SerpAPI** | Google search integration |
| **Flask-CORS** | Frontend-backend communication |
| **Cloudflare Pages** | Frontend deployment |
| **Render** | Backend deployment |



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
| [@akshayjhaa7](https://github.com/akshayjha7) | Repository Creator |
| [@PrashUpdates](https://github.com/PrashUpdates) | Contributor |



<p align="center">
  <strong>💧 SilentSpend</strong>
  <br/>
  Track the Money You Don't Notice.
</p>