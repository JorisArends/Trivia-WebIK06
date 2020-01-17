import os
from cs50 import SQL
from flask import Flask, flash, jsonify, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
import sqlite3

from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
from werkzeug.security import check_password_hash, generate_password_hash
from helpers import question, get_token

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Database connection
conn = sqlite3.connect('trivia.db', check_same_thread=False)
db = conn.cursor()

# Redirect homepage button to "/" route
@app.route("/index")
def index():
    return redirect("/")


@app.route("/", methods=["GET", "POST"])
def home():

    # Forget any user_id
    session.clear()

    if request.method == "GET":
        return render_template("index.html")
    else:

        # Ensure username was submitted
        if not request.form.get("username"):
            return jsonify(False)

        # Get session token once name is submitted
        session["user_id"] = get_token()
        user = db.execute("INSERT INTO users (username, token) VALUES (?, ?);", (request.form.get("username"), session["user_id"]))
        conn.commit()
        return render_template("index.html")


@app.route("/leaderboards", methods=["GET", "POST"])
def leaderboards():
    if request.method == "GET":
        return render_template("leaderboards.html")
    else:
        return render_template("leaderboards.html")


@app.route("/about", methods=["GET"])
def about():
    return render_template("about.html")


@app.route("/game_over", methods=["GET", "POST"])
def game_over():
    return render_template("game_over.html")


@app.route("/quiz", methods=["GET", "POST"])
def quiz():
    Q = question(1, 18, 'easy', get_token()) # Test voor API function
    return render_template("quiz.html", Q = Q)


