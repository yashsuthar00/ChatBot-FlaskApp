from flask import Flask, render_template, request, jsonify
import json
import re
import random_responses

app = Flask(__name__)

def load_json(file):
    with open(file) as bot_responses:
        print(f"Loaded '{file}' successfully!")
        return json.load(bot_responses)

response_data = load_json("bot.json")


def get_response(input_string):
    split_message = re.split(r'\s+|[,;?!.-]\s*', input_string.lower())
    score_list = []

    for response in response_data:
        response_score = 0
        required_score = 0
        required_words = response["required_words"]

        if required_words:
            for word in split_message:
                if word in required_words:
                    required_score += 1

        if required_score == len(required_words):

            for word in split_message:

                if word in response["user_input"]:
                    response_score += 1

        score_list.append(response_score)

    best_response = max(score_list)
    response_index = score_list.index(best_response)

    if input_string == "":
        return "Please type something so we can chat"

    if best_response != 0:
        return response_data[response_index]["bot_response"]

    return random_responses.random_string()

@app.route('/')
def chat():
    return render_template('chat.html')

@app.route('/get_response', methods=['POST'])
def get_bot_response():
    user_input = request.json['user_input']
    bot_response = get_response(user_input)
    return jsonify({'bot_response': bot_response})

if __name__ == '__main__':
    app.run(debug=True)