import { useEffect, useState } from "react";
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
  Sparkles,
  Trash2
} from "lucide-react";

import {
  getSubscriptions,
  addSubscription,
  deleteSubscription,
  discoverSubscriptions
} from "./api";

import "./App.css";

function App() {
  const [active, setActive] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [form, setForm] = useState({
    name: "",
    amount: "",
    billing_cycle: "monthly",
    next_payment_date: "",
    category: "Entertainment"
  });

  const navigation = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Subscriptions", icon: CreditCard },
    { name: "Analytics", icon: ChartNoAxesCombined },
    { name: "Silent Leak Detector", icon: Droplets },
    { name: "Discover", icon: Search }
  ];

  const loadSubscriptions = async () => {
    try {
      setError("");
      const data = await getSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      setError("Backend connection failed. Make sure Flask is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);

  const monthly = subscriptions.reduce((total, sub) => {
    const amount = Number(sub.amount) || 0;

    return total + (
      sub.billing_cycle === "yearly" ? amount / 12 : amount
    );
  }, 0);

  const yearly = monthly * 12;

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      setError("");

      await addSubscription({
        ...form,
        amount: Number(form.amount)
      });

      setForm({
        name: "",
        amount: "",
        billing_cycle: "monthly",
        next_payment_date: "",
        category: "Entertainment"
      });

      setShowForm(false);
      await loadSubscriptions();
    } catch (err) {
      setError("Could not add subscription. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      await deleteSubscription(id);
      await loadSubscriptions();
    } catch (err) {
      setError("Could not delete subscription.");
    }
  };

  const handleDiscover = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setSearchError("");
    setSearchResults([]);

    try {
      const results = await discoverSubscriptions(searchQuery);
      setSearchResults(results);
    } catch (err) {
      setSearchError(err.message || "Search failed. Try again.");
    } finally {
      setSearchLoading(false);
    }
  };

  const serviceColor = (name) => {
    const colors = {
      Netflix: "red",
      Spotify: "green",
      "Amazon Prime": "orange"
    };

    return colors[name] || "blue";
  };

  const serviceIcon = (name) => name.charAt(0).toUpperCase();

  const upcoming = [...subscriptions]
    .sort((a, b) =>
      a.next_payment_date.localeCompare(b.next_payment_date)
    )
    .slice(0, 5);

  return (
    <div className="app-layout">

      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <Droplets size={23} />
          </div>

          <span>
            Silent<span className="brand-highlight">Spend</span>
          </span>

          <button
            className="close-menu"
            onClick={() => setMenuOpen(false)}
          >
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
          <button
            className="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
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
              <p className="date-text">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric"
                }).toUpperCase()}
              </p>

              <h1>
                {active === "Discover"
                  ? "Discover Subscriptions"
                  : "Good morning!"}
                <span> 👋</span>
              </h1>

              <p className="welcome-subtitle">
                {active === "Discover"
                  ? "Find subscription plans, pricing and useful information."
                  : "Here's what's happening with your subscriptions."}
              </p>
            </div>

            {active !== "Discover" && (
              <button
                className="add-button"
                onClick={() => setShowForm(true)}
              >
                <Plus size={19} />
                Add Subscription
              </button>
            )}
          </section>

          {error && (
            <p style={{ color: "#ff7777", marginBottom: 16 }}>
              {error}
            </p>
          )}

          {active === "Discover" ? (

            <section
              className="panel"
              style={{ padding: 24, marginBottom: 24 }}
            >
              <div className="discover-icon">
                <Sparkles size={23} />
              </div>

              <h2>Explore Subscription Information</h2>

              <p style={{ color: "#a5a8b8", marginTop: 8 }}>
                Search subscription plans, pricing, official websites
                and cancellation information.
              </p>

              <form
                onSubmit={handleDiscover}
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 24,
                  flexWrap: "wrap"
                }}
              >
                <input
                  type="text"
                  placeholder="Search Netflix, Spotify, Amazon Prime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: 180,
                    padding: 14,
                    borderRadius: 9,
                    border: "1px solid #373b4e",
                    background: "#222535",
                    color: "white",
                    outline: "none"
                  }}
                />

                <button
                  className="add-button"
                  type="submit"
                  disabled={searchLoading}
                >
                  <Search size={18} />
                  {searchLoading ? "Searching..." : "Search"}
                </button>
              </form>

              {searchLoading && (
                <p style={{ marginTop: 24 }}>
                  Searching with SerpAPI...
                </p>
              )}

              {searchError && (
                <p style={{ color: "#ff7777", marginTop: 20 }}>
                  {searchError}
                </p>
              )}

              {searchResults.length > 0 && (
                <div style={{ marginTop: 28 }}>
                  <h3 style={{ marginBottom: 15 }}>
                    Search Results ({searchResults.length})
                  </h3>

                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      style={{
                        padding: 18,
                        marginBottom: 12,
                        background: "#202333",
                        border: "1px solid #303449",
                        borderRadius: 10
                      }}
                    >
                      <h3 style={{ color: "#ffffff" }}>
                        {result.title}
                      </h3>

                      <p
                        style={{
                          color: "#a5a8b8",
                          marginTop: 9,
                          lineHeight: 1.6
                        }}
                      >
                        {result.snippet}
                      </p>

                      <a
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-block",
                          color: "#a99aff",
                          marginTop: 12,
                          textDecoration: "none"
                        }}
                      >
                        Visit Website ↗
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {!searchLoading &&
                !searchError &&
                searchResults.length === 0 && (
                  <p style={{ color: "#9296a8", marginTop: 25 }}>
                    Search for a subscription to discover information.
                  </p>
                )}
            </section>

          ) : (

            <>

              {showForm && (
                <div style={modalOverlay}>
                  <form onSubmit={handleAdd} style={modalBox}>
                    <div style={modalHeader}>
                      <h2 style={{ margin: 0 }}>
                        Add Subscription
                      </h2>

                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        style={closeButton}
                      >
                        <X />
                      </button>
                    </div>

                    <label style={formLabel}>
                      Subscription name
                    </label>

                    <input
                      style={formInput}
                      type="text"
                      placeholder="e.g. Netflix"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required
                    />

                    <label style={formLabel}>Amount (₹)</label>

                    <input
                      style={formInput}
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="Enter amount"
                      value={form.amount}
                      onChange={(e) =>
                        setForm({ ...form, amount: e.target.value })
                      }
                      required
                    />

                    <label style={formLabel}>Billing cycle</label>

                    <select
                      style={formInput}
                      value={form.billing_cycle}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          billing_cycle: e.target.value
                        })
                      }
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>

                    <label style={formLabel}>
                      Next payment date
                    </label>

                    <input
                      style={formInput}
                      type="date"
                      value={form.next_payment_date}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          next_payment_date: e.target.value
                        })
                      }
                      required
                    />

                    <label style={formLabel}>Category</label>

                    <select
                      style={formInput}
                      value={form.category}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          category: e.target.value
                        })
                      }
                    >
                      <option>Entertainment</option>
                      <option>Music</option>
                      <option>Shopping</option>
                      <option>Education</option>
                      <option>Software</option>
                      <option>Other</option>
                    </select>

                    <button
                      type="submit"
                      className="add-button"
                      style={{
                        width: "100%",
                        justifyContent: "center",
                        marginTop: 20
                      }}
                    >
                      <Plus size={18} />
                      Save Subscription
                    </button>
                  </form>
                </div>
              )}

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
                  <h2>
                    {String(subscriptions.length).padStart(2, "0")}
                  </h2>
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
                  <h2 className="saving-amount">₹0</h2>
                  <p className="stat-description">
                    Mark unused subscriptions to track savings
                  </p>
                </div>

              </section>

              <section className="dashboard-grid">

                <div className="panel subscription-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>
                        {active === "Subscriptions"
                          ? "All Subscriptions"
                          : "Upcoming Payments"}
                      </h3>
                      <p>Your recurring expenses</p>
                    </div>

                    <button
                      className="view-button"
                      onClick={() =>
                        setActive(
                          active === "Subscriptions"
                            ? "Dashboard"
                            : "Subscriptions"
                        )
                      }
                    >
                      {active === "Subscriptions" ? "Dashboard" : "View all"}
                      <ArrowUpRight size={15} />
                    </button>
                  </div>

                  <div className="subscription-list">
                    {loading ? (
                      <p>Loading subscriptions...</p>
                    ) : (active === "Subscriptions"
                        ? subscriptions
                        : upcoming).length === 0 ? (
                      <p>
                        No subscriptions yet. Add your first subscription.
                      </p>
                    ) : (
                      (active === "Subscriptions"
                        ? subscriptions
                        : upcoming
                      ).map((sub) => (
                        <div
                          className="subscription-item"
                          key={sub.id}
                        >
                          <div
                            className={`service-icon ${serviceColor(sub.name)}`}
                          >
                            {serviceIcon(sub.name)}
                          </div>

                          <div className="service-details">
                            <h4>{sub.name}</h4>
                            <p>
                              {sub.category} · {sub.billing_cycle}
                            </p>
                          </div>

                          <div className="payment-details">
                            <h4>{formatMoney(sub.amount)}</h4>
                            <p>{formatDate(sub.next_payment_date)}</p>
                          </div>

                          <button
                            onClick={() => handleDelete(sub.id)}
                            title="Delete subscription"
                            style={deleteButton}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      ))
                    )}
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
                    <h2>₹0</h2>
                  </div>

                  <button
                    className="leak-button"
                    onClick={() => setActive("Silent Leak Detector")}
                  >
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

            </>

          )}

          <footer>
            <span>© 2026 SilentSpend</span>
            <span>Track the money you don't notice.</span>
          </footer>

        </div>
      </main>
    </div>
  );
}

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.75)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: 16
};

const modalBox = {
  background: "#171923",
  border: "1px solid #303344",
  borderRadius: 16,
  padding: 24,
  width: "100%",
  maxWidth: 430,
  maxHeight: "90vh",
  overflowY: "auto",
  color: "#fff"
};

const modalHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 22
};

const closeButton = {
  background: "transparent",
  border: 0,
  color: "#fff",
  cursor: "pointer"
};

const formLabel = {
  display: "block",
  fontSize: 13,
  marginBottom: 7,
  marginTop: 14,
  color: "#c5c7d3"
};

const formInput = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  borderRadius: 8,
  border: "1px solid #373b4e",
  background: "#222535",
  color: "#fff",
  outline: "none"
};

const deleteButton = {
  background: "transparent",
  border: "none",
  color: "#ff7777",
  cursor: "pointer",
  padding: 8
};

export default App;