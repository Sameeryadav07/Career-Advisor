from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from model import CareerModel
from utils import skill_gap

app = Flask(__name__)
CORS(app)

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
data_path = os.path.join(BASE_DIR, "data", "careers.csv")

data = pd.read_csv(data_path)
model = CareerModel(data)

@app.route("/recommend", methods=["POST"])
def recommend():
    user_skills = request.json.get("skills", "")
    branch = request.json.get("branch", "All")

    recommendations = model.recommend(user_skills, branch=branch)

    for rec in recommendations:
        rec["skill_gap"] = skill_gap(user_skills, rec["skills_required"])

    return jsonify(recommendations)

@app.route("/")
def home():
    return "🚀 CareerAgent API is running!"

if __name__ == "__main__":
    app.run(debug=True)