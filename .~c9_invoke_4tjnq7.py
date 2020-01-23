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
    #if method is get, show page without table
    if request.method == "GET":
        return render_template("leaderboards.html")
    else:
        #get category from form
        categorie = request.form["categorie"]
        #get size of table from form
        x = int(request.form["hoeveelheid"])
        #get values from a category from the database, and sort them
        scores = db.execute("SELECT * FROM scores WHERE categorie = ? ORDER BY vragen DESC, tijd ASC", (categorie,))

        #give all entries for leaderboard the correct ranking
        i = 1
        for score in scores:
            score["positie"] = i
            i+=1

        #values for the header of the table(this way, the values dont get printed if method is GET)
        tabel = ["#", "naam", "vragen goed", "tijd"]

        return render_template("leaderboards.html", scores = scores[:x], tabel = tabel)


@app.route("/about", methods=["GET"])
def about():
    return render_template("about.html")

@app.route("/game_over", methods=["GET", "POST"])
def game_over():
    print("test")
    #categorie = request.form["categorie"]
    #scores = db.execute("SELECT * FROM scores WHERE categorie = ? ORDER BY vragen DESC, tijd ASC", (categorie,))
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


@app.route("/insert_score", methods=["GET", "POST"])
def insert_score():
    username = request.args.get('username')
    score = int(request.args.get('score'))
    category = request.args.get('category')
    
    prev_score = db.execute("SELECT * FROM scores WHERE naam = ? AND categorie = ?", (username, category))
    if score > 0:
        if not prev_score:
            db.execute("INSERT INTO scores (naam, vragen, tijd, categorie) VALUES(?, ?, ?, ?);", (username, score, "00:00", category))
        else:
            if score > prev_score[0]["vragen"]:
                db.execute("UPDATE scores SET vragen = ?, tijd = ? WHERE naam = ? AND categorie = ?", (score, "00:00", username, category))
    return('', 204)
