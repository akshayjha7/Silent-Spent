import { useState } from "react";
import {
  LayoutDashboard,
  CreditCard,
  ChartNoAxesCombined,
  Search,
  Droplets,
  Settings,
  Bell,
  Plus,
  ArrowUpRight,
  CalendarDays,
  CircleDollarSign,
  TrendingUp,
  Menu,
  X,
  AlertCircle,
  Sparkles
} from "lucide-react";

import "./App.css";

const subscriptions = [
  {
    name: "Netflix",
    category: "Entertainment",
    amount: 649,
    date: "25 Nov 2026",
    icon: "N",
    color: "red"
  },
  {
    name: "Spotify",
    category: "Music",
    amount: 119,
    date: "28 Nov 2026",
    icon: "S",
    color: "green"
  },
  {
    name: "Amazon Prime",
    category: "Shopping",
    amount: 1499,
    date: "02 Dec 2026",
    icon: "A",
    color: "orange"
  }
];

function App() {
  const [active, setActive] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Subscriptions", icon: CreditCard },
    { name: "Analytics", icon: ChartNoAxesCombined },
    { name: "Silent Leak Detector", icon: Droplets },
    { name: "Discover", icon: Search }
  ];

  const monthly = 2499;
  const yearly = monthly * 12;

  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);

  return (
    <div className="app-layout">

      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <Droplets size={23} />
          </div>
          <span>Silent<span className="brand-highlight">Spend</span></span>
          <button className="close-menu" onClick={() => setMenuOpen(false)}>
            <X />
          </button>
        </div>

        <p className="nav-label">MENU</p>

        <nav>
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${active === item.name ? "active" : ""}`}
                onClick={() => {
                  setActive(item.name);
                  setMenuOpen(false);
                }}
              >
                <Icon size={19} />
                <span>{item.name}</span>
                {item.name === "Silent Leak Detector" && (
                  <span className="nav-dot" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item">
            <Settings size={19} />
            Settings
          </button>
          <div className="profile">
            <div className="avatar">S</div>
            <div>
              <h4>My Account</h4>
              <p>Personal workspace</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">

        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMenuOpen(true)}>
            <Menu />
          </button>

          <div className="breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>{active}</strong>
          </div>

          <div className="top-actions">
            <button className="notification">
              <Bell size={19} />
              <span />
            </button>
            <div className="avatar">S</div>
          </div>
        </header>

        <div className="page-content">

          <section className="welcome-section">
            <div>
              <p className="date-text">SUNDAY, NOVEMBER 22, 2026</p>
              <h1>Good morning! <span>👋</span></h1>
              <p className="welcome-subtitle">
                Here's what's happening with your subscriptions.
              </p>
            </div>

            <button className="add-button">
              <Plus size={19} />
              Add Subscription
            </button>
          </section>

          <section className="stats-grid">

            <div className="stat-card">
              <div className="stat-top">
                <span>Monthly Spending</span>
                <div className="stat-icon purple">
                  <CircleDollarSign />
                </div>
              </div>
              <h2>{formatMoney(monthly)}</h2>
              <p className="stat-description">
                <TrendingUp size={15} />
                Your recurring monthly cost
              </p>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Estimated Yearly Cost</span>
                <div className="stat-icon blue">
                  <ChartNoAxesCombined />
                </div>
              </div>
              <h2>{formatMoney(yearly)}</h2>
              <p className="stat-description">
                Based on monthly spending
              </p>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Active Subscriptions</span>
                <div className="stat-icon green">
                  <CreditCard />
                </div>
              </div>
              <h2>06</h2>
              <p className="stat-description">
                Currently tracking subscriptions
              </p>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Potential Savings</span>
                <div className="stat-icon orange">
                  <Droplets />
                </div>
              </div>
              <h2 className="saving-amount">₹999</h2>
              <p className="stat-description">
                Possible yearly savings
              </p>
            </div>

          </section>

          <section className="dashboard-grid">

            <div className="panel subscription-panel">
              <div className="panel-heading">
                <div>
                  <h3>Upcoming Payments</h3>
                  <p>Your next recurring expenses</p>
                </div>
                <button className="view-button"
                  onClick={() => setActive("Subscriptions")}>
                  View all <ArrowUpRight size={15} />
                </button>
              </div>

              <div className="subscription-list">
                {subscriptions.map((sub) => (
                  <div className="subscription-item" key={sub.name}>
                    <div className={`service-icon ${sub.color}`}>
                      {sub.icon}
                    </div>

                    <div className="service-details">
                      <h4>{sub.name}</h4>
                      <p>{sub.category}</p>
                    </div>

                    <div className="payment-details">
                      <h4>{formatMoney(sub.amount)}</h4>
                      <p>{sub.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel leak-panel">
              <div className="leak-heading">
                <div className="leak-icon">
                  <Droplets size={22} />
                </div>
                <span>SMART INSIGHT</span>
              </div>

              <h3>Silent Leak Detector</h3>
              <p>
                Small subscriptions can quietly drain your wallet.
                Find out where you could save.
              </p>

              <div className="savings-box">
                <span>Potential yearly savings</span>
                <h2>₹999</h2>
              </div>

              <button className="leak-button"
                onClick={() => setActive("Silent Leak Detector")}>
                Explore savings <ArrowUpRight size={17} />
              </button>
            </div>

          </section>

          <section className="bottom-grid">

            <div className="panel discover-panel">
              <div className="discover-icon">
                <Sparkles size={23} />
              </div>
              <div>
                <h3>Discover Subscriptions</h3>
                <p>
                  Explore subscription details, cancellation guides
                  and smarter alternatives.
                </p>
              </div>
              <button onClick={() => setActive("Discover")}>
                Explore Discover <ArrowUpRight size={17} />
              </button>
            </div>

            <div className="panel reminder-panel">
              <div className="reminder-icon">
                <CalendarDays size={21} />
              </div>
              <div>
                <h3>Stay in control</h3>
                <p>
                  Keep track of your renewal dates and never miss
                  an upcoming payment.
                </p>
              </div>
            </div>

          </section>

          <footer>
            <span>© 2026 SilentSpend</span>
            <span>Track the money you don't notice.</span>
          </footer>

        </div>
      </main>
    </div>
  );
}

export default App;