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


@app.route("/")
def home():
    return jsonify({"message": "SilentSpend API is running"})


@app.route("/api/subscriptions", methods=["GET"])
def get_subscriptions():
    conn = get_db()

    subscriptions = conn.execute(
        "SELECT * FROM subscriptions"
    ).fetchall()

    conn.close()

    return jsonify([dict(item) for item in subscriptions])


@app.route("/api/subscriptions", methods=["POST"])
def add_subscription():
    data = request.get_json()

    required = [
        "name",
        "amount",
        "billing_cycle",
        "next_payment_date"
    ]

    if not data or any(not data.get(field) for field in required):
        return jsonify({"error": "All required fields are needed"}), 400

    conn = get_db()

    cursor = conn.execute("""
        INSERT INTO subscriptions
        (name, amount, billing_cycle, next_payment_date, category)
        VALUES (?, ?, ?, ?, ?)
    """, (
        data["name"],
        data["amount"],
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


@app.route("/api/subscriptions/<int:subscription_id>", methods=["DELETE"])
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
        return jsonify({"error": "Subscription not found"}), 404

    return jsonify({"message": "Subscription deleted"})


@app.route("/api/discover", methods=["GET"])
def discover():

    query = request.args.get("q", "").strip()
    category = request.args.get("type", "pricing").lower()

    if not query:
        return jsonify({"error": "Search query is required"}), 400

    if len(query) > 100:
        return jsonify({"error": "Search query is too long"}), 400

    search_types = {
        "pricing": (
            "subscription plans pricing India INR official website"
        ),
        "cancellation": (
            "how to cancel subscription official cancellation guide India"
        ),
        "alternatives": (
            "best alternatives similar services India subscription"
        )
    }

    if category not in search_types:
        return jsonify({"error": "Invalid search category"}), 400

    api_key = os.getenv("SERPAPI_KEY")

    if not api_key:
        return jsonify({"error": "SerpAPI key is missing"}), 500

    search_query = f"{query} {search_types[category]}"

    try:
        response = requests.get(
            "https://serpapi.com/search.json",
            params={
                "engine": "google",
                "q": search_query,
                "google_domain": "google.co.in",
                "gl": "in",
                "hl": "en",
                "num": 8,
                "api_key": api_key
            },
            timeout=20
        )

        response.raise_for_status()
        data = response.json()

        if data.get("error"):
            return jsonify({
                "error": data["error"]
            }), 502

        results = []

        for item in data.get("organic_results", [])[:8]:
            results.append({
                "title": item.get("title", ""),
                "link": item.get("link", ""),
                "snippet": item.get("snippet", ""),
                "source": item.get("source", ""),
                "position": item.get("position")
            })

        return jsonify({
            "query": query,
            "category": category,
            "country": "India",
            "results": results
        })

    except requests.RequestException:
        return jsonify({
            "error": "Search service unavailable"
        }), 502


if __name__ == "__main__":
    app.run(debug=True, port=5000)