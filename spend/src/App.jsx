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
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Activity,
  Target
} from "lucide-react";

import {
  getSubscriptions,
  addSubscription,
  deleteSubscription,
  discoverSubscriptions,
  getInsights,
  updateSubscriptionUsage
} from "./api";

import "./App.css";

function App() {

  const [active, setActive] = useState("Dashboard");

  const [menuOpen, setMenuOpen] = useState(false);

  const [subscriptions, setSubscriptions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [insights, setInsights] = useState(null);

  const [insightLoading, setInsightLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [searchType, setSearchType] = useState("pricing");

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

  // LOAD SUBSCRIPTIONS

  const loadSubscriptions = async () => {
    try {
      setError("");

      const data = await getSubscriptions();

      setSubscriptions(data);

    } catch (err) {
      setError("Backend connection failed. Check Flask server.");
    } finally {
      setLoading(false);
    }
  };

  // LOAD INSIGHTS

  const loadInsights = async () => {
    try {
      setInsightLoading(true);

      const data = await getInsights();

      setInsights(data);

    } catch (err) {
      setError("Could not load financial insights.");
    } finally {
      setInsightLoading(false);
    }
  };

  // INITIAL LOAD

  useEffect(() => {
    loadSubscriptions();
    loadInsights();
  }, []);

  // MONEY FORMAT

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(Number(amount) || 0);
  };

  // MONTHLY TOTAL

  const monthly = subscriptions.reduce((total, sub) => {
    const amount = Number(sub.amount) || 0;

    return total + (
      sub.billing_cycle === "yearly"
        ? amount / 12
        : amount
    );
  }, 0);

  const yearly = monthly * 12;

  // UPCOMING PAYMENTS

  const upcoming = [...subscriptions]
    .sort((a, b) =>
      a.next_payment_date.localeCompare(b.next_payment_date)
    )
    .slice(0, 5);

  // DATE FORMAT

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date + "T00:00:00")
      .toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
  };

  // SERVICE COLOR

  const serviceColor = (name) => {
    const colors = {
      Netflix: "red",
      Spotify: "green",
      "Amazon Prime": "orange",
      YouTube: "red"
    };

    return colors[name] || "blue";
  };

  // ADD SUBSCRIPTION

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
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
      await loadInsights();

    } catch (err) {
      setError("Could not add subscription.");
    } finally {
      setSaving(false);
    }
  };

  // DELETE SUBSCRIPTION

  const handleDelete = async (id) => {
    try {
      setError("");

      await deleteSubscription(id);

      await loadSubscriptions();
      await loadInsights();

    } catch (err) {
      setError("Could not delete subscription.");
    }
  };

  // UPDATE USED / UNUSED

  const handleUsageChange = async (id, is_used) => {
    try {
      setError("");

      await updateSubscriptionUsage(id, is_used);

      await loadSubscriptions();
      await loadInsights();

    } catch (err) {
      setError("Could not update subscription usage.");
    }
  };

  // DISCOVER SEARCH

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    try {
      setSearchLoading(true);
      setError("");
      setSearchResults([]);

      const results = await discoverSubscriptions(
        searchQuery,
        searchType
      );

      setSearchResults(results);

    } catch (err) {
      setError(err.message || "Search failed.");
    } finally {
      setSearchLoading(false);
    }
  };
  return (
    <div className="app-layout">

      {/* SIDEBAR */}

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
                className={`nav-item ${
                  active === item.name ? "active" : ""
                }`}
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

          <button
            className={`nav-item ${
              active === "Settings" ? "active" : ""
            }`}
            onClick={() => setActive("Settings")}
          >
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

      {/* MAIN CONTENT */}

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
            </button>

            <div className="avatar">S</div>
          </div>

        </header>

        <div className="page-content">

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* DASHBOARD */}

          {active === "Dashboard" && (
            <>

              <section className="welcome-section">
                <div>
                  <p className="date-text">
                    SUNDAY, NOVEMBER 22, 2026
                  </p>

                  <h1>
                    Good morning! 👋
                  </h1>

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

              {/* STATISTICS */}

              <section className="stats-grid">

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Monthly Spending</span>
                    <CircleDollarSign />
                  </div>

                  <h2>{formatMoney(monthly)}</h2>

                  <p className="stat-description">
                    <TrendingUp size={15} />
                    Recurring monthly cost
                  </p>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Yearly Spending</span>
                    <ChartNoAxesCombined />
                  </div>

                  <h2>{formatMoney(yearly)}</h2>

                  <p className="stat-description">
                    Estimated yearly cost
                  </p>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Active Subscriptions</span>
                    <CreditCard />
                  </div>

                  <h2>
                    {String(
                      insights?.active_subscriptions ??
                      subscriptions.length
                    ).padStart(2, "0")}
                  </h2>

                  <p className="stat-description">
                    Currently tracking
                  </p>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Potential Savings</span>
                    <Droplets />
                  </div>

                  <h2 className="saving-amount">
                    {formatMoney(
                      insights?.potential_yearly_savings || 0
                    )}
                  </h2>

                  <p className="stat-description">
                    Possible yearly savings
                  </p>
                </div>

              </section>

              {/* DASHBOARD PANELS */}

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
                            {sub.name.charAt(0).toUpperCase()}
                          </div>

                          <div className="service-details">
                            <h4>{sub.name}</h4>
                            <p>{sub.category}</p>
                          </div>

                          <div className="payment-details">
                            <h4>{formatMoney(sub.amount)}</h4>
                            <p>{formatDate(sub.next_payment_date)}</p>
                          </div>

                        </div>
                      ))

                    )}

                  </div>
                </div>

                <div className="panel leak-panel">

                  <div className="leak-heading">
                    <Droplets size={22} />
                    <span>SMART INSIGHT</span>
                  </div>

                  <h3>Silent Leak Detector</h3>

                  <p>
                    Find unused subscriptions and understand
                    where your money could be saved.
                  </p>

                  <div className="savings-box">
                    <span>Potential yearly savings</span>

                    <h2>
                      {formatMoney(
                        insights?.potential_yearly_savings || 0
                      )}
                    </h2>
                  </div>

                  <button
                    className="leak-button"
                    onClick={() =>
                      setActive("Silent Leak Detector")
                    }
                  >
                    Explore savings
                    <ArrowUpRight size={17} />
                  </button>

                </div>

              </section>

              {/* BOTTOM PANELS */}

              <section className="bottom-grid">

                <div className="panel discover-panel">
                  <Sparkles size={24} />

                  <div>
                    <h3>Discover Subscriptions</h3>

                    <p>
                      Explore pricing, cancellation guides
                      and smarter alternatives.
                    </p>
                  </div>

                  <button onClick={() => setActive("Discover")}>
                    Explore Discover
                    <ArrowUpRight size={17} />
                  </button>
                </div>

                <div className="panel reminder-panel">
                  <CalendarDays size={22} />

                  <div>
                    <h3>Stay in control</h3>

                    <p>
                      Keep track of renewal dates and
                      upcoming payments.
                    </p>
                  </div>
                </div>

              </section>

            </>
          )}

          {/* SUBSCRIPTIONS PAGE */}

          {active === "Subscriptions" && (
            <section>

              <div className="welcome-section">
                <div>
                  <p className="date-text">YOUR EXPENSES</p>
                  <h1>My Subscriptions</h1>

                  <p className="welcome-subtitle">
                    Manage all your recurring payments.
                  </p>
                </div>

                <button
                  className="add-button"
                  onClick={() => setShowForm(true)}
                >
                  <Plus size={19} />
                  Add Subscription
                </button>
              </div>

              <div className="panel subscription-panel">

                <div className="panel-heading">
                  <div>
                    <h3>All Subscriptions</h3>
                    <p>{subscriptions.length} subscriptions found</p>
                  </div>

                  <button
                    className="view-button"
                    onClick={loadSubscriptions}
                  >
                    <RefreshCw size={15} />
                    Refresh
                  </button>
                </div>

                <div className="subscription-list">

                  {loading ? (
                    <p>Loading...</p>
                  ) : subscriptions.length === 0 ? (
                    <p>No subscriptions found.</p>
                  ) : (

                    subscriptions.map((sub) => (
                      <div
                        className="subscription-item"
                        key={sub.id}
                      >

                        <div className={`service-icon ${serviceColor(sub.name)}`}>
                          {sub.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="service-details">
                          <h4>{sub.name}</h4>
                          <p>{sub.category} · {sub.billing_cycle}</p>
                        </div>

                        <div className="payment-details">
                          <h4>{formatMoney(sub.amount)}</h4>
                          <p>{formatDate(sub.next_payment_date)}</p>
                        </div>

                        <button
                          className="usage-toggle"
                          onClick={() =>
                            handleUsageChange(
                              sub.id,
                              !Boolean(sub.is_used)
                            )
                          }
                        >
                          {Boolean(sub.is_used) ? "Mark Unused" : "Mark Used"}
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => handleDelete(sub.id)}
                          title="Delete subscription"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>
                    ))

                  )}

                </div>

              </div>

            </section>
          )}

          {/* ANALYTICS PAGE */}

          {active === "Analytics" && (
            <section>

              <div className="welcome-section">
                <div>
                  <p className="date-text">FINANCIAL OVERVIEW</p>
                  <h1>Analytics</h1>

                  <p className="welcome-subtitle">
                    Understand your subscription spending.
                  </p>
                </div>

                <button
                  className="view-button"
                  onClick={() => {
                    loadSubscriptions();
                    loadInsights();
                  }}
                >
                  <RefreshCw size={15} />
                  Refresh
                </button>
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

                <div className="stat-card">
                  <span>Unused Subscriptions</span>
                  <h2>{insights?.unused_subscriptions ?? 0}</h2>
                </div>

                <div className="stat-card">
                  <span>Potential Savings</span>
                  <h2>
                    {formatMoney(
                      insights?.potential_yearly_savings || 0
                    )}
                  </h2>
                </div>

              </div>

              <div className="panel analytics-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Spending Breakdown</h3>
                    <p>Monthly equivalent by subscription</p>
                  </div>
                </div>

                {subscriptions.length === 0 ? (
                  <p>Add subscriptions to see your analytics.</p>
                ) : (

                  subscriptions.map((sub) => {
                    const monthlyAmount =
                      sub.billing_cycle === "yearly"
                        ? Number(sub.amount) / 12
                        : Number(sub.amount);

                    const percentage = monthly > 0
                      ? (monthlyAmount / monthly) * 100
                      : 0;

                    return (
                      <div className="analytics-row" key={sub.id}>

                        <div className="analytics-label">
                          <span>{sub.name}</span>
                          <strong>{formatMoney(monthlyAmount)}</strong>
                        </div>

                        <div className="progress-track">
                          <div
                            className="progress-fill"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                      </div>
                    );
                  })

                )}

              </div>

            </section>
          )}

          {/* SILENT LEAK DETECTOR */}

          {active === "Silent Leak Detector" && (
            <section>

              <div className="welcome-section">
                <div>
                  <p className="date-text">SMART MONEY ANALYSIS</p>
                  <h1>Silent Leak Detector</h1>
                  <p className="welcome-subtitle">
                    Find subscriptions that you no longer use.
                  </p>
                </div>

                <button
                  className="view-button"
                  onClick={() => {
                    loadSubscriptions();
                    loadInsights();
                  }}
                >
                  <RefreshCw size={15} /> Refresh
                </button>
              </div>

              <div className="stats-grid">

                <div className="stat-card">
                  <span>Unused Subscriptions</span>
                  <h2>{insights?.unused_subscriptions ?? 0}</h2>
                </div>

                <div className="stat-card">
                  <span>Potential Yearly Savings</span>
                  <h2 className="saving-amount">
                    {formatMoney(
                      insights?.potential_yearly_savings || 0
                    )}
                  </h2>
                </div>

              </div>

              <div className="panel subscription-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Usage Tracker</h3>
                    <p>Mark subscriptions you don't use.</p>
                  </div>
                </div>

                <div className="subscription-list">

                  {subscriptions.length === 0 ? (
                    <p>No subscriptions found.</p>
                  ) : (

                    subscriptions.map((sub) => (
                      <div
                        className="subscription-item"
                        key={sub.id}
                      >

                        <div className={`service-icon ${serviceColor(sub.name)}`}>
                          {sub.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="service-details">
                          <h4>{sub.name}</h4>
                          <p>{sub.category}</p>
                        </div>

                        <div className="payment-details">
                          <h4>{formatMoney(sub.amount)}</h4>
                          <p>{sub.billing_cycle}</p>
                        </div>

                        <span className={
                          Number(sub.is_used) === 1
                            ? "status-badge"
                            : "unused-badge"
                        }>
                          {Number(sub.is_used) === 1
                            ? "Used"
                            : "Unused"}
                        </span>

                        <button
                          className="usage-toggle"
                          onClick={() =>
                            handleUsageChange(
                              sub.id,
                              !Boolean(sub.is_used)
                            )
                          }
                        >
                          {Boolean(sub.is_used)
                            ? "Mark Unused"
                            : "Mark Used"}
                        </button>

                      </div>
                    ))

                  )}

                </div>
              </div>

              <div className="panel savings-panel">
                <Droplets size={25} />

                <div>
                  <h3>Your Potential Savings</h3>
                  <h2>
                    {formatMoney(
                      insights?.potential_yearly_savings || 0
                    )}
                  </h2>
                  <p>
                    Estimated annual cost of subscriptions
                    marked as unused.
                  </p>
                </div>
              </div>

            </section>
          )}

          {/* DISCOVER PAGE */}

          {active === "Discover" && (
            <section>

              <div className="welcome-section">
                <div>
                  <p className="date-text">EXPLORE THE WEB</p>
                  <h1>Discover Subscriptions</h1>
                  <p className="welcome-subtitle">
                    Find plans, pricing and cancellation information.
                  </p>
                </div>
              </div>

              <div className="panel discover-search-panel">

                <form onSubmit={handleSearch}>

                  <div className="search-input-wrapper">
                    <Search size={20} />

                    <input
                      type="text"
                      placeholder="Search Netflix, Spotify, Adobe..."
                      value={searchQuery}
                      onChange={(e) =>
                        setSearchQuery(e.target.value)
                      }
                    />
                  </div>

                  <select
                    value={searchType}
                    onChange={(e) =>
                      setSearchType(e.target.value)
                    }
                  >
                    <option value="pricing">Pricing & Plans</option>
                    <option value="cancellation">Cancellation Guide</option>
                    <option value="alternatives">Alternatives</option>
                  </select>

                  <button
                    type="submit"
                    className="add-button"
                    disabled={searchLoading}
                  >
                    <Search size={18} />
                    {searchLoading ? "Searching..." : "Search"}
                  </button>

                </form>

                <p className="search-note">
                  Search results are provided by Google through SerpAPI.
                  Always verify details on the official website.
                </p>

              </div>

              {searchLoading && (
                <div className="panel">
                  Searching the web...
                </div>
              )}

              {!searchLoading && searchResults.length > 0 && (
                <div className="discover-results">

                  <div className="panel-heading">
                    <div>
                      <h3>Search Results</h3>
                      <p>
                        {searchResults.length} results found
                      </p>
                    </div>
                  </div>

                  {searchResults.map((result, index) => (
                    <div
                      className="panel result-card"
                      key={result.link || index}
                    >

                      <div>
                        <h3>{result.title}</h3>

                        <p>{result.snippet}</p>

                        <a
                          href={result.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit Website
                          <ExternalLink size={15} />
                        </a>
                      </div>

                    </div>
                  ))}

                </div>
              )}

              {!searchLoading &&
                searchResults.length === 0 &&
                searchQuery.trim() === "" && (
                  <div className="panel discover-empty">
                    <Sparkles size={30} />
                    <h3>Discover Something New</h3>
                    <p>
                      Search any subscription to explore its
                      plans, pricing and alternatives.
                    </p>
                  </div>
              )}

            </section>
          )}

          {/* SETTINGS PAGE */}

          {active === "Settings" && (
            <section>

              <div className="welcome-section">
                <div>
                  <p className="date-text">PREFERENCES</p>
                  <h1>Settings</h1>
                  <p className="welcome-subtitle">
                    Manage your SilentSpend workspace.
                  </p>
                </div>
              </div>

              <div className="panel settings-panel">

                <div className="settings-item">
                  <ShieldCheck size={22} />
                  <div>
                    <h3>Data Storage</h3>
                    <p>Your subscriptions are stored in SQLite.</p>
                  </div>
                  <span className="status-badge">Connected</span>
                </div>

                <div className="settings-item">
                  <Search size={22} />
                  <div>
                    <h3>Discover Search</h3>
                    <p>Web search powered by SerpAPI.</p>
                  </div>
                  <span className="status-badge">Enabled</span>
                </div>

                <div className="settings-item">
                  <Activity size={22} />
                  <div>
                    <h3>Analytics</h3>
                    <p>Calculated from saved subscriptions.</p>
                  </div>
                  <span className="status-badge">Active</span>
                </div>

                <div className="settings-item">
                  <RefreshCw size={22} />
                  <div>
                    <h3>Refresh Data</h3>
                    <p>Reload your subscription information.</p>
                  </div>
                  <button
                    className="view-button"
                    onClick={() => {
                      loadSubscriptions();
                      loadInsights();
                    }}
                  >
                    Refresh
                  </button>
                </div>

              </div>

            </section>
          )}

          {/* ADD SUBSCRIPTION MODAL */}

          {showForm && (
            <div className="modal-overlay">

              <form
                className="modal-box"
                onSubmit={handleAdd}
              >

                <div className="modal-header">
                  <div>
                    <h2>Add Subscription</h2>
                    <p>Enter your subscription details.</p>
                  </div>

                  <button
                    type="button"
                    className="close-button"
                    onClick={() => setShowForm(false)}
                  >
                    <X />
                  </button>
                </div>

                <label>Subscription Name</label>
                <input
                  type="text"
                  placeholder="e.g. Netflix"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value
                    })
                  }
                  required
                />

                <label>Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Enter amount"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      amount: e.target.value
                    })
                  }
                  required
                />

                <label>Billing Cycle</label>
                <select
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
                />

                <label>Category</label>
                <select
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
                  className="add-button modal-submit"
                  disabled={saving}
                >
                  <Plus size={18} />
                  {saving ? "Saving..." : "Save Subscription"}
                </button>

              </form>
            </div>
          )}

          <footer className="app-footer">
            <span>© 2026 SilentSpend</span>
            <span>Track the money you don't notice.</span>
          </footer>

        </div>
      </main>
    </div>
  );
}

export default App;