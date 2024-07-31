from flask import Flask, render_template, request, jsonify
from flask_cors import CORS 

from chat import get_response,chatbot

app = Flask(__name__)
CORS(app)

@app.post("/predict/chat")
def predict():
    text = request.get_json().get("message")
    # TODO: Kiểm tra nếu text hợp lệ
    if "link" in text.lower() or "price" in text.lower() or "specs" in text.lower():
        # Gọi hàm chatbot để xử lý tin nhắn chứa từ "link"
        response = chatbot(text)
    else:
        # Gọi hàm get_response cho các trường hợp khác
        response = get_response(text)
    message = {"answer": response}
    return jsonify(message) 


if __name__=="__main__":
    app.run(debug=True, port=5001)