import os
import requests
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from database import get_db, init_db

load_dotenv()

app = Flask(__name__)
CORS(app)

init_db()


def ensure_usage_column():
    conn = get_db()

    columns = conn.execute(
        "PRAGMA table_info(subscriptions)"
    ).fetchall()

    column_names = [column["name"] for column in columns]

    if "is_used" not in column_names:
        conn.execute("""
            ALTER TABLE subscriptions
            ADD COLUMN is_used INTEGER NOT NULL DEFAULT 1
        """)

    conn.commit()
    conn.close()


ensure_usage_column()


@app.route("/")
def home():
    return jsonify({
        "message": "SilentSpend API is running"
    })


# GET ALL SUBSCRIPTIONS

@app.route("/api/subscriptions", methods=["GET"])
def get_subscriptions():
    conn = get_db()

    subscriptions = conn.execute(
        "SELECT * FROM subscriptions ORDER BY id DESC"
    ).fetchall()

    conn.close()

    return jsonify([
        dict(item) for item in subscriptions
    ])


# ADD SUBSCRIPTION

@app.route("/api/subscriptions", methods=["POST"])
def add_subscription():
    data = request.get_json(silent=True)

    required = [
        "name",
        "amount",
        "billing_cycle",
        "next_payment_date"
    ]

    if not data or any(
        not data.get(field) for field in required
    ):
        return jsonify({
            "error": "All required fields are needed"
        }), 400

    try:
        amount = float(data["amount"])

        if amount <= 0:
            return jsonify({
                "error": "Amount must be greater than zero"
            }), 400

    except (ValueError, TypeError):
        return jsonify({
            "error": "Invalid amount"
        }), 400

    if data["billing_cycle"] not in ["monthly", "yearly"]:
        return jsonify({
            "error": "Invalid billing cycle"
        }), 400

    conn = get_db()

    cursor = conn.execute("""
        INSERT INTO subscriptions
        (name, amount, billing_cycle, next_payment_date, category)
        VALUES (?, ?, ?, ?, ?)
    """, (
        data["name"].strip(),
        amount,
        data["billing_cycle"],
        data["next_payment_date"],
        data.get("category", "Other")
    ))

    conn.commit()
    new_id = cursor.lastrowid
    conn.close()

    return jsonify({
        "message": "Subscription added",
        "id": new_id
    }), 201


# DELETE SUBSCRIPTION

@app.route(
    "/api/subscriptions/<int:subscription_id>",
    methods=["DELETE"]
)
def delete_subscription(subscription_id):
    conn = get_db()

    cursor = conn.execute(
        "DELETE FROM subscriptions WHERE id = ?",
        (subscription_id,)
    )

    conn.commit()
    deleted = cursor.rowcount
    conn.close()

    if deleted == 0:
        return jsonify({
            "error": "Subscription not found"
        }), 404

    return jsonify({
        "message": "Subscription deleted"
    })


# UPDATE SUBSCRIPTION USAGE

@app.route(
    "/api/subscriptions/<int:subscription_id>/usage",
    methods=["PATCH"]
)
def update_subscription_usage(subscription_id):
    data = request.get_json(silent=True)

    if not data or "is_used" not in data:
        return jsonify({
            "error": "is_used field is required"
        }), 400

    is_used = data["is_used"]

    if not isinstance(is_used, bool):
        return jsonify({
            "error": "is_used must be true or false"
        }), 400

    conn = get_db()

    cursor = conn.execute(
        """
        UPDATE subscriptions
        SET is_used = ?
        WHERE id = ?
        """,
        (1 if is_used else 0, subscription_id)
    )

    conn.commit()
    updated = cursor.rowcount
    conn.close()

    if updated == 0:
        return jsonify({
            "error": "Subscription not found"
        }), 404

    return jsonify({
        "message": "Subscription usage updated",
        "is_used": is_used
    })


# SILENT LEAK DETECTOR INSIGHTS

@app.route("/api/insights", methods=["GET"])
def get_insights():
    conn = get_db()

    subscriptions = conn.execute(
        "SELECT * FROM subscriptions"
    ).fetchall()

    conn.close()

    total_yearly = 0
    potential_savings = 0
    unused_count = 0

    for sub in subscriptions:
        amount = float(sub["amount"])

        if sub["billing_cycle"] == "yearly":
            yearly_cost = amount
        else:
            yearly_cost = amount * 12

        total_yearly += yearly_cost

        if not sub["is_used"]:
            potential_savings += yearly_cost
            unused_count += 1

    return jsonify({
        "total_yearly_spending": round(total_yearly, 2),
        "potential_yearly_savings": round(
            potential_savings, 2
        ),
        "unused_subscriptions": unused_count,
        "active_subscriptions": (
            len(subscriptions) - unused_count
        )
    })


# SERPAPI DISCOVER

@app.route("/api/discover", methods=["GET"])
def discover():
    query = request.args.get("q", "").strip()

    if not query:
        return jsonify({
            "error": "Search query is required"
        }), 400

    api_key = os.getenv("SERPAPI_KEY")

    if not api_key:
        return jsonify({
            "error": "SerpAPI key is missing"
        }), 500

    try:
        response = requests.get(
            "https://serpapi.com/search.json",
            params={
                "engine": "google",
                "q": f"{query} subscription plans pricing official website",
                "api_key": api_key
            },
            timeout=20
        )

        response.raise_for_status()
        data = response.json()

        results = []

        for item in data.get("organic_results", [])[:8]:
            results.append({
                "title": item.get("title", ""),
                "link": item.get("link", ""),
                "snippet": item.get("snippet", "")
            })

        return jsonify({
            "results": results
        })

    except requests.RequestException:
        return jsonify({
            "error": "Search service unavailable"
        }), 502


if __name__ == "__main__":
    app.run(
        debug=True,
        port=5000
    )