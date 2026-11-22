import sqlite3

DATABASE = "spend.db"

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS subscriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            amount REAL NOT NULL,
            billing_cycle TEXT NOT NULL,
            next_payment_date TEXT NOT NULL,
            category TEXT DEFAULT 'Other',
            is_used INTEGER DEFAULT 1
        )
    """)

    conn.commit()
    conn.close()