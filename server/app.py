from flask import Flask, jsonify, request
from flask_cors import CORS
import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

def get_db_connection():
    return pymysql.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        db=os.getenv('DB_NAME'),
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )

@app.route('/api/message', methods=['GET', 'POST'])
def handle_message():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            if request.method == 'GET':
                cursor.execute("SELECT message FROM messages ORDER BY RAND() LIMIT 1")
                result = cursor.fetchone()
                return jsonify({"message": result['message'] if result else "No messages found"})
            elif request.method == 'POST':
                new_message = request.json.get('message')
                if new_message:
                    cursor.execute("INSERT INTO messages (message) VALUES (%s)", (new_message,))
                    conn.commit()
                    return jsonify({"status": "success", "message": "Message added successfully"}), 201
                else:
                    return jsonify({"status": "error", "message": "No message provided"}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)