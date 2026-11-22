const API_URL = "http://127.0.0.1:5000";

export async function getSubscriptions() {
  const response = await fetch(`${API_URL}/api/subscriptions`);

  if (!response.ok) {
    throw new Error("Failed to fetch subscriptions");
  }

  return response.json();
}

export async function addSubscription(data) {
  const response = await fetch(`${API_URL}/api/subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to add subscription");
  }

  return response.json();
}

export async function deleteSubscription(id) {
  const response = await fetch(`${API_URL}/api/subscriptions/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete subscription");
  }

  return response.json();
}