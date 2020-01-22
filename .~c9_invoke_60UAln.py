import os
from cs50 import SQL
from flask import Flask, flash, jsonify, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
#import sqlite3

from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
from werkzeug.security import check_password_hash, generate_password_hash
from helpers import get_token, category_name

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///trivia.db")

# Redirect homepage button to "/" route
@app.route("/index")
def index():
    return redirect("/")


@app.route("/")
def home():
    # Forget any user_id
    session.clear()
    return render_template("index.html")

@app.route("/leaderboards", methods=["GET", "POST"])
def leaderboards():
    if request.method == "GET":
        return render_template("leaderboards.html")
    else:
        categorie = request.form["categorie"]
        x = int(request.form["hoeveelheid"])
        scores = db.execute("SELECT * FROM scores WHERE categorie = ? ORDER BY vragen DESC, tijd ASC", (categorie,))
        i = 1
        for score in scores:
            score["positie"] = i
            i+=1
        tabel = ["#", "naam", "vragen goed", "tijd"]
        return render_template("leaderboards.html", scores = scores[:x], tabel = tabel)


@app.route("/about", methods=["GET"])
def about():
    return render_template("about.html")

@app.route("/game_over", methods=["GET", "POST"])
def game_over():
    return render_template("game_over.html")


@app.route("/quiz", methods=["GET", "POST"])
def quiz():
    if request.method == "POST":
        # Ensure username was submitted
        if not request.form.get("username"):
            return jsonify(False)

        # Get session token once name is submitted
        token = get_token()
        session["user_id"] = token
        user = db.execute("INSERT INTO users (username, token) VALUES (?, ?);", (request.form.get("username"), session["user_id"]))
        return render_template("quiz.html", category = request.form.get("category"), username = request.form.get("username"), token = token)
    else:
        return redirect("/")

@app.route("/name", methods=["GET", "POST"])
def name():
    category = request.args.get("category")
    return category_name(int(category))