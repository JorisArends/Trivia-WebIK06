import os
from flask import Flask, flash, jsonify, redirect, render_template, request, session
from tempfile import mkdtemp
from flask_session import Session
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
from helpers import category_name, ranking, prev_score, insert_score, update_score

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/index")
def index():
    return redirect("/")


@app.route("/game_over")
def game_over():
    return render_template("game_over.html")


@app.route("/leaderboards", methods=["GET", "POST"])
def leaderboards():
    """Show the leaderboard per category"""

    # If method is GET, show page without table
    if request.method == "GET":
        return render_template("leaderboards.html")

    # Get category and amount from form
    category = request.form["category"]
    x = int(request.form["amount"])

    # Get values from a category from the database, and sort them
    scores = ranking(category)

    # Values for the header of the table (this way, the values dont get printed if method is GET)
    tabel = ["", "Naam", "Score", "Tijd"]

    return render_template("leaderboards.html", scores = scores[:x], tabel = tabel)


@app.route("/quiz", methods=["GET", "POST"])
def quiz():
    """ Send variables (username/category) to quiz page on POST request """
    if request.method == "POST":
        return render_template("quiz.html",
                category = request.form.get("category"),
                username = request.form.get("username"),
                category_name = category_name(request.form.get("category")))
    else:
        # Make sure quiz can't be started without category or username
        return redirect("/")


@app.route("/insert_score", methods=["GET", "POST"])
def score():
    """ Insert user's score when quiz is finished """
    username = request.args.get('username')
    score = int(request.args.get('score'))
    category = request.args.get('category')
    time = request.args.get('time')

    # Make sure no unnessecary scores are inserted into the database.
    # - If users failed the first question, don't add a score of 0 to the leaderboard.
    # - If user beats his own score, the previous score of that category will be replaced/updated.
    if score > 0:
        if not prev_score(username, category):
            insert_score(username, score, time, category)

        elif score > prev_score(username, category)[0]["vragen"]:
            update_score(username, score, time, category)
    return('', 204)