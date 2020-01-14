import os
from cs50 import SQL
from flask import Flask, flash, jsonify, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
import sqlite3

from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
from werkzeug.security import check_password_hash, generate_password_hash
from helpers import question

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

        user = db.execute("INSERT INTO users (username) VALUES(:username)", username=request.form.get("username"))

        # Redirect user to login page
        session["user_id"] = user

        id = session["user_id"]

        return render_template("index.html", id=id)


@app.route("/leaderboards")
def leaderboards():
    return render_template("leaderboards.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/game_over")
def game_over():
    return render_template("game_over.html")


@app.route("/quiz")
def quiz():
    Q = question(1, 16, 'easy', '973e86c798ef24c7203bd15390e0e92af1303a3ea01daa93c0e08668a639f9a3') # Test voor API function
    return render_template("quiz.html", Q = Q)

