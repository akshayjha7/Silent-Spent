from flask import Flask, request, jsonify
from flask_cors import CORS
from database import get_db, init_db

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

    required = ["name", "amount", "billing_cycle", "next_payment_date"]

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

    return jsonify({"message": "Subscription added", "id": new_id}), 201

@app.route("/api/subscriptions/<int:subscription_id>", methods=["DELETE"])
def delete_subscription(subscription_id):
    conn = get_db()

    cursor = conn.execute(
        "DELETE FROM subscriptions WHERE id = ?",
        (subscription_id,)
    )

    conn.commit()
    conn.close()

    if cursor.rowcount == 0:
        return jsonify({"error": "Subscription not found"}), 404

    return jsonify({"message": "Subscription deleted"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)