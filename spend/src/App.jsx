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
  IndianRupee,
  Ban,
  RefreshCw,
  ExternalLink
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

  const [form, setForm] = useState({
    name: "",
    amount: "",
    billing_cycle: "monthly",
    next_payment_date: "",
    category: "Entertainment"
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("pricing");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

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
      setError(
        "Backend connection failed. Make sure Flask is running."
      );
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
      sub.billing_cycle === "yearly"
        ? amount / 12
        : amount
    );
  }, 0);

  const yearly = monthly * 12;

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date + "T00:00:00").toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
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

    if (!searchQuery.trim()) {
      setSearchError("Please enter a subscription name.");
      return;
    }

    setSearchLoading(true);
    setSearchError("");
    setSearchResults([]);

    try {
      const results = await discoverSubscriptions(
        searchQuery,
        searchType
      );

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

  const serviceIcon = (name) =>
    name.charAt(0).toUpperCase();

  const upcoming = [...subscriptions]
    .sort((a, b) =>
      (a.next_payment_date || "").localeCompare(
        b.next_payment_date || ""
      )
    )
    .slice(0, 5);

  const categoryTotals = subscriptions.reduce((acc, sub) => {
    const category = sub.category || "Other";
    const amount = Number(sub.amount) || 0;

    const monthlyAmount =
      sub.billing_cycle === "yearly"
        ? amount / 12
        : amount;

    acc[category] = (acc[category] || 0) + monthlyAmount;

    return acc;
  }, {});

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
                  : active === "Analytics"
                  ? "Spending Analytics"
                  : active === "Subscriptions"
                  ? "My Subscriptions"
                  : active === "Silent Leak Detector"
                  ? "Silent Leak Detector"
                  : "Good morning!"}

                <span> 👋</span>
              </h1>

              <p className="welcome-subtitle">
                Track the money you don't notice.
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
            <div className="error-message">
              {error}
            </div>
          )}

          {active === "Discover" ? (

            <section className="panel discover-page">

              <div className="discover-heading">
                <div className="discover-icon">
                  <Sparkles size={25} />
                </div>

                <div>
                  <h2>Discover Subscriptions</h2>
                  <p>
                    Find pricing, cancellation guides and alternatives.
                  </p>
                </div>
              </div>

              <div className="discover-tabs">

                <button
                  className={`discover-tab ${
                    searchType === "pricing" ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSearchType("pricing");
                    setSearchResults([]);
                    setSearchError("");
                  }}
                >
                  <IndianRupee size={18} />
                  Pricing
                </button>

                <button
                  className={`discover-tab ${
                    searchType === "cancellation" ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSearchType("cancellation");
                    setSearchResults([]);
                    setSearchError("");
                  }}
                >
                  <Ban size={18} />
                  Cancellation
                </button>

                <button
                  className={`discover-tab ${
                    searchType === "alternatives" ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSearchType("alternatives");
                    setSearchResults([]);
                    setSearchError("");
                  }}
                >
                  <RefreshCw size={18} />
                  Alternatives
                </button>

              </div>

              <form
                className="discover-search"
                onSubmit={handleDiscover}
              >

                <input
                  type="text"
                  placeholder="Search Netflix, Spotify, Prime..."
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
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

              <p className="search-info">
                Powered by SerpAPI web search.
              </p>

              {searchError && (
                <div className="error-message">
                  {searchError}
                </div>
              )}

              {searchLoading && (
                <div className="empty-discover">
                  <Search size={30} />
                  <h3>Searching the web...</h3>
                  <p>Please wait while we find results.</p>
                </div>
              )}

              {!searchLoading && searchResults.length > 0 && (
                <div className="search-results">

                  <div className="results-heading">
                    <h3>Search Results</h3>
                    <span>{searchResults.length} results</span>
                  </div>

                  {searchResults.map((result, index) => (
                    <article
                      className="search-result-card"
                      key={result.link || index}
                    >

                      <div className="result-number">
                        {index + 1}
                      </div>

                      <div className="result-content">

                        <h3>{result.title}</h3>

                        <p>{result.snippet}</p>

                        <span className="result-source">
                          {result.source || "Web Search"}
                        </span>

                        {result.link && (
                          <a
                            href={result.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Visit Website
                            <ExternalLink size={14} />
                          </a>
                        )}

                      </div>
                    </article>
                  ))}

                </div>
              )}

              {!searchLoading &&
                !searchError &&
                searchResults.length === 0 && (
                  <div className="empty-discover">
                    <Sparkles size={35} />
                    <h3>Start Discovering</h3>
                    <p>
                      Search any subscription to explore its
                      pricing and useful information.
                    </p>
                  </div>
                )}

            </section>

          ) : active === "Analytics" ? (

            <section className="analytics-page">

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
                  <span>Active Subscriptions</span>
                  <h2>{subscriptions.length}</h2>
                </div>

              </div>

              <div className="panel analytics-panel">

                <h3>Category-wise Spending</h3>

                <p>
                  Monthly spending breakdown by category.
                </p>

                {Object.keys(categoryTotals).length === 0 ? (
                  <div className="empty-discover">
                    <ChartNoAxesCombined size={32} />
                    <p>No spending data available yet.</p>
                  </div>
                ) : (

                  Object.entries(categoryTotals).map(
                    ([category, amount]) => (

                      <div
                        className="category-row"
                        key={category}
                      >

                        <div className="category-info">
                          <strong>{category}</strong>
                          <span>{formatMoney(amount)}</span>
                        </div>

                        <div className="category-track">
                          <div
                            className="category-fill"
                            style={{
                              width: `${
                                monthly > 0
                                  ? Math.min(
                                      amount / monthly * 100,
                                      100
                                    )
                                  : 0
                              }%`
                            }}
                          />
                        </div>

                      </div>
                    )
                  )

                )}

              </div>

            </section>

          ) : active === "Silent Leak Detector" ? (

            <section className="panel leak-page">

              <div className="leak-heading">
                <div className="leak-icon">
                  <Droplets size={24} />
                </div>
                <span>SMART INSIGHT</span>
              </div>

              <h2>Find Your Silent Leaks</h2>

              <p>
                Review your subscriptions and understand how much
                you spend on recurring services.
              </p>

              <div className="leak-total">
                <span>Total yearly subscription cost</span>
                <h2>{formatMoney(yearly)}</h2>
              </div>

              <h3>Your Subscriptions</h3>

              {subscriptions.length === 0 ? (
                <p>No subscriptions to review.</p>
              ) : (

                subscriptions.map((sub) => {

                  const annualCost =
                    Number(sub.amount) *
                    (sub.billing_cycle === "yearly" ? 1 : 12);

                  return (
                    <div
                      className="subscription-item"
                      key={sub.id}
                    >

                      <div className="service-icon blue">
                        {serviceIcon(sub.name)}
                      </div>

                      <div className="service-details">
                        <h4>{sub.name}</h4>
                        <p>{sub.category}</p>
                      </div>

                      <div className="payment-details">
                        <h4>{formatMoney(annualCost)}</h4>
                        <p>Yearly cost</p>
                      </div>

                    </div>
                  );
                })

              )}

              <p className="search-info">
                Review each subscription before deciding whether
                you still need it.
              </p>

            </section>

          ) : (
            <>
              {showForm && (
                <div className="modal-overlay">
                  <form
                    className="subscription-form"
                    onSubmit={handleAdd}
                  >
                    <div className="modal-header">
                      <h2>Add Subscription</h2>

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
                      className="add-button save-button"
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
                  <h2>{subscriptions.length}</h2>
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
                  <h2>₹0</h2>
                  <p className="stat-description">
                    Review unused subscriptions
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
                      {active === "Subscriptions"
                        ? "Dashboard"
                        : "View all"}
                      <ArrowUpRight size={15} />
                    </button>
                  </div>

                  <div className="subscription-list">
                    {loading ? (
                      <p>Loading subscriptions...</p>
                    ) : (
                      (active === "Subscriptions"
                        ? subscriptions
                        : upcoming
                      ).length === 0 ? (
                        <p>No subscriptions yet.</p>
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
                              <p>
                                {formatDate(sub.next_payment_date)}
                              </p>
                            </div>

                            <button
                              className="delete-button"
                              onClick={() => handleDelete(sub.id)}
                              title="Delete subscription"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        ))
                      )
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
                    <span>Total yearly spending</span>
                    <h2>{formatMoney(yearly)}</h2>
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

              <section className="bottom-grid">

                <div className="panel discover-panel">
                  <div className="discover-icon">
                    <Sparkles size={23} />
                  </div>

                  <div>
                    <h3>Discover Subscriptions</h3>
                    <p>
                      Explore subscription pricing,
                      cancellation guides and alternatives.
                    </p>
                  </div>

                  <button
                    onClick={() => setActive("Discover")}
                  >
                    Explore Discover
                    <ArrowUpRight size={17} />
                  </button>
                </div>

                <div className="panel reminder-panel">
                  <div className="reminder-icon">
                    <CalendarDays size={21} />
                  </div>

                  <div>
                    <h3>Stay in Control</h3>
                    <p>
                      Keep track of renewal dates and
                      upcoming payments.
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

export default App;