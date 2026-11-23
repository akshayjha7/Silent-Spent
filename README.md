<h1 align="center">💧 SilentSpend</h1>

<p align="center">
  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=17&pause=1500&color=2F81F7&center=true&vCenter=true&width=520&lines=Track+the+Money+You+Don%27t+Notice;Manage+Subscriptions+Smartly;Find+Silent+Leaks+%26+Save+More" alt="Typing animation" />
  </a>
</p>

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=react,vite,python,flask,sqlite,cloudflare&perline=6" />
  </a>
</p>

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=html,css,js,vscode,git,github&perline=6" />
  </a>
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