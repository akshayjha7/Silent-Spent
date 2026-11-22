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
  Trash2,
  CheckCircle,
  RotateCcw,
  ExternalLink
} from "lucide-react";

import {
  getSubscriptions,
  addSubscription,
  deleteSubscription,
  updateSubscriptionUsage,
  getInsights,
  discoverSubscriptions
} from "./api";

import "./App.css";

function App() {
  const [active, setActive] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const [subscriptions, setSubscriptions] = useState([]);
  const [insights, setInsights] = useState({
    total_yearly_spending: 0,
    potential_yearly_savings: 0,
    unused_subscriptions: 0,
    active_subscriptions: 0
  });

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

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

  // Load subscriptions and insights

  const loadData = async () => {
    try {
      setError("");

      const [subscriptionData, insightData] =
        await Promise.all([
          getSubscriptions(),
          getInsights()
        ]);

      setSubscriptions(subscriptionData);
      setInsights(insightData);

    } catch (err) {
      setError(
        "Backend connection failed. Make sure Flask is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Currency formatting

  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(Number(amount) || 0);

  // Monthly spending

  const monthly = subscriptions.reduce((total, sub) => {
    const amount = Number(sub.amount) || 0;

    return total + (
      sub.billing_cycle === "yearly"
        ? amount / 12
        : amount
    );
  }, 0);

  const yearly = monthly * 12;

  // Date formatting

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date + "T00:00:00");

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  // Add subscription

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

      await loadData();

    } catch (err) {
      setError("Could not add subscription.");
    }
  };

  // Delete subscription

  const handleDelete = async (id) => {
    try {
      setError("");

      await deleteSubscription(id);

      await loadData();

    } catch (err) {
      setError("Could not delete subscription.");
    }
  };

  // Mark unused or restore subscription

  const handleUsage = async (id, isUsed) => {
    try {
      setError("");

      await updateSubscriptionUsage(id, isUsed);

      await loadData();

    } catch (err) {
      setError("Could not update subscription status.");
    }
  };

  // Discover search

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    try {
      setSearchLoading(true);
      setError("");

      const results = await discoverSubscriptions(
        searchQuery.trim()
      );

      setSearchResults(results);

    } catch (err) {
      setError(err.message || "Search failed.");
      setSearchResults([]);

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

  const serviceIcon = (name) =>
    name?.charAt(0).toUpperCase() || "?";

  const upcoming = [...subscriptions]
    .sort((a, b) =>
      (a.next_payment_date || "").localeCompare(
        b.next_payment_date || ""
      )
    )
    .slice(0, 5);

  const unusedSubscriptions = subscriptions.filter(
    (sub) => !sub.is_used
  );

  const usedSubscriptions = subscriptions.filter(
    (sub) => Boolean(sub.is_used)
  );
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

          {error && (
            <p style={{ color: "#ff7777", marginBottom: 16 }}>
              {error}
            </p>
          )}

          {active === "Dashboard" && (
            <>
              <section className="welcome-section">
                <div>
                  <p className="date-text">
                    YOUR FINANCIAL OVERVIEW
                  </p>
                  <h1>Good morning! 👋</h1>
                  <p className="welcome-subtitle">
                    Here's what's happening with your subscriptions.
                  </p>
                </div>

                <button
                  className="add-button"
                  onClick={() => setShowForm(true)}
                >
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
                    Monthly recurring cost
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
                    Estimated annual spending
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
                    Total tracked subscriptions
                  </p>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Potential Savings</span>
                    <div className="stat-icon orange">
                      <Droplets />
                    </div>
                  </div>
                  <h2 className="saving-amount">
                    {formatMoney(insights.potential_yearly_savings)}
                  </h2>
                  <p className="stat-description">
                    Yearly unused subscription cost
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

                    <button
                      className="view-button"
                      onClick={() => setActive("Subscriptions")}
                    >
                      View all <ArrowUpRight size={15} />
                    </button>
                  </div>

                  <div className="subscription-list">
                    {loading ? (
                      <p>Loading subscriptions...</p>
                    ) : upcoming.length === 0 ? (
                      <p>No subscriptions yet. Add your first one.</p>
                    ) : (
                      upcoming.map((sub) => (
                        <div
                          className="subscription-item"
                          key={sub.id}
                        >
                          <div className={`service-icon ${serviceColor(sub.name)}`}>
                            {serviceIcon(sub.name)}
                          </div>

                          <div className="service-details">
                            <h4>{sub.name}</h4>
                            <p>{sub.category}</p>
                          </div>

                          <div className="payment-details">
                            <h4>{formatMoney(sub.amount)}</h4>
                            <p>{formatDate(sub.next_payment_date)}</p>
                          </div>

                          <button
                            onClick={() => handleDelete(sub.id)}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#ff7777",
                              cursor: "pointer"
                            }}
                            title="Delete"
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
                    Find unused subscriptions and discover
                    how much money you could save.
                  </p>

                  <div className="savings-box">
                    <span>Potential yearly savings</span>
                    <h2>
                      {formatMoney(insights.potential_yearly_savings)}
                    </h2>
                  </div>

                  <button
                    className="leak-button"
                    onClick={() => setActive("Silent Leak Detector")}
                  >
                    Explore savings <ArrowUpRight size={17} />
                  </button>
                </div>

              </section>
            </>
          )}

          {active === "Subscriptions" && (
            <section>
              <div className="welcome-section">
                <div>
                  <h1>My Subscriptions</h1>
                  <p className="welcome-subtitle">
                    Manage all your recurring payments.
                  </p>
                </div>

                <button
                  className="add-button"
                  onClick={() => setShowForm(true)}
                >
                  <Plus size={18} /> Add Subscription
                </button>
              </div>

              <div className="panel subscription-panel">
                <div className="subscription-list">
                  {subscriptions.map((sub) => (
                    <div
                      className="subscription-item"
                      key={sub.id}
                    >
                      <div className={`service-icon ${serviceColor(sub.name)}`}>
                        {serviceIcon(sub.name)}
                      </div>

                      <div className="service-details">
                        <h4>{sub.name}</h4>
                        <p>{sub.category}</p>
                      </div>

                      <div className="payment-details">
                        <h4>{formatMoney(sub.amount)}</h4>
                        <p>{sub.billing_cycle}</p>
                      </div>

                      <button
                        onClick={() => handleDelete(sub.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#ff7777",
                          cursor: "pointer"
                        }}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {active === "Silent Leak Detector" && (
            <section>
              <div className="welcome-section">
                <div>
                  <h1>Silent Leak Detector</h1>
                  <p className="welcome-subtitle">
                    Identify unused subscriptions and potential savings.
                  </p>
                </div>
              </div>

              <section className="stats-grid">
                <div className="stat-card">
                  <span>Total Yearly Spending</span>
                  <h2>{formatMoney(insights.total_yearly_spending)}</h2>
                </div>

                <div className="stat-card">
                  <span>Potential Yearly Savings</span>
                  <h2 className="saving-amount">
                    {formatMoney(insights.potential_yearly_savings)}
                  </h2>
                </div>

                <div className="stat-card">
                  <span>Unused Subscriptions</span>
                  <h2>{insights.unused_subscriptions}</h2>
                </div>

                <div className="stat-card">
                  <span>Used Subscriptions</span>
                  <h2>{insights.active_subscriptions}</h2>
                </div>
              </section>

              <div className="panel subscription-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Track Subscription Usage</h3>
                    <p>Mark subscriptions you no longer use.</p>
                  </div>
                </div>

                <div className="subscription-list">
                  {subscriptions.length === 0 ? (
                    <p>No subscriptions available.</p>
                  ) : (
                    subscriptions.map((sub) => (
                      <div
                        className="subscription-item"
                        key={sub.id}
                      >
                        <div className={`service-icon ${serviceColor(sub.name)}`}>
                          {serviceIcon(sub.name)}
                        </div>

                        <div className="service-details">
                          <h4>{sub.name}</h4>
                          <p>{sub.is_used ? "Currently used" : "Marked unused"}</p>
                        </div>

                        <div className="payment-details">
                          <h4>
                            {formatMoney(
                              sub.billing_cycle === "yearly"
                                ? sub.amount
                                : sub.amount * 12
                            )}
                          </h4>
                          <p>Per year</p>
                        </div>

                        <button
                          className="view-button"
                          onClick={() =>
                            handleUsage(sub.id, !Boolean(sub.is_used))
                          }
                        >
                          {sub.is_used ? (
                            <>Mark Unused <Droplets size={15} /></>
                          ) : (
                            <>Restore <RotateCcw size={15} /></>
                          )}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          )}

          {active === "Analytics" && (
            <section>
              <div className="welcome-section">
                <div>
                  <h1>Spending Analytics</h1>
                  <p className="welcome-subtitle">
                    Understand where your subscription money goes.
                  </p>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <span>Monthly Spending</span>
                  <h2>{formatMoney(monthly)}</h2>
                </div>

                <div className="stat-card">
                  <span>Yearly Spending</span>
                  <h2>{formatMoney(yearly)}</h2>
                </div>
              </div>

              <div className="panel">
                <h3>Category-wise Spending</h3>

                {Object.entries(
                  subscriptions.reduce((acc, sub) => {
                    const category = sub.category || "Other";
                    const amount =
                      sub.billing_cycle === "yearly"
                        ? Number(sub.amount) / 12
                        : Number(sub.amount);

                    acc[category] = (acc[category] || 0) + amount;
                    return acc;
                  }, {})
                ).map(([category, amount]) => (
                  <div key={category} style={{ margin: "20px 0" }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8
                    }}>
                      <strong>{category}</strong>
                      <span>{formatMoney(amount)}</span>
                    </div>

                    <div style={{
                      height: 9,
                      background: "#292d40",
                      borderRadius: 20,
                      overflow: "hidden"
                    }}>
                      <div style={{
                        height: "100%",
                        width: `${monthly ? (amount / monthly) * 100 : 0}%`,
                        background: "#8b70ff",
                        borderRadius: 20
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {active === "Discover" && (
            <section>
              <div className="welcome-section">
                <div>
                  <h1>Discover Subscriptions</h1>
                  <p className="welcome-subtitle">
                    Search subscription plans, pricing and official websites.
                  </p>
                </div>
              </div>

              <div className="panel">
                <form
                  onSubmit={handleSearch}
                  style={{
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap"
                  }}
                >
                  <input
                    type="text"
                    placeholder="Search Netflix, Spotify, YouTube..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      flex: 1,
                      minWidth: 180,
                      padding: 14,
                      borderRadius: 9,
                      background: "#222535",
                      color: "white",
                      border: "1px solid #373b4e"
                    }}
                  />

                  <button
                    type="submit"
                    className="add-button"
                    disabled={searchLoading}
                  >
                    <Search size={18} />
                    {searchLoading ? "Searching..." : "Search"}
                  </button>
                </form>

                <div style={{ marginTop: 25 }}>
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="subscription-item"
                      style={{
                        padding: "18px 0",
                        borderBottom: "1px solid #303344"
                      }}
                    >
                      <div className="service-icon blue">
                        {index + 1}
                      </div>

                      <div className="service-details">
                        <h4>{result.title}</h4>
                        <p>{result.snippet}</p>
                      </div>

                      <a
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#a18aff",
                          textDecoration: "none"
                        }}
                      >
                        Open <ExternalLink size={15} />
                      </a>
                    </div>
                  ))}

                  {!searchLoading &&
                    searchQuery &&
                    searchResults.length === 0 && (
                      <p>No results found. Try another search.</p>
                    )}
                </div>
              </div>
            </section>
          )}

          {showForm && (
            <div style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.78)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: 16
            }}>
              <form
                onSubmit={handleAdd}
                style={{
                  background: "#171923",
                  border: "1px solid #303344",
                  borderRadius: 16,
                  padding: 24,
                  width: "100%",
                  maxWidth: 430,
                  maxHeight: "90vh",
                  overflowY: "auto",
                  color: "white"
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20
                }}>
                  <h2>Add Subscription</h2>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    style={{
                      background: "transparent",
                      border: 0,
                      color: "white"
                    }}
                  >
                    <X />
                  </button>
                </div>

                <label>Subscription Name</label>
                <input
                  type="text"
                  placeholder="Netflix"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                  style={formInputStyle}
                />

                <label>Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="649"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({ ...form, amount: e.target.value })
                  }
                  required
                  style={formInputStyle}
                />

                <label>Billing Cycle</label>
                <select
                  value={form.billing_cycle}
                  onChange={(e) =>
                    setForm({ ...form, billing_cycle: e.target.value })
                  }
                  style={formInputStyle}
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>

                <label>Next Payment Date</label>
                <input
                  type="date"
                  value={form.next_payment_date}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      next_payment_date: e.target.value
                    })
                  }
                  required
                  style={formInputStyle}
                />

                <label>Category</label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  style={formInputStyle}
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

          <footer>
            <span>© 2026 SilentSpend</span>
            <span>Track the money you don't notice.</span>
          </footer>

        </div>
      </main>
    </div>
  );
}

const formInputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  padding: 12,
  marginTop: 8,
  marginBottom: 16,
  borderRadius: 8,
  border: "1px solid #373b4e",
  background: "#222535",
  color: "white",
  outline: "none"
};

export default App;