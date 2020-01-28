import os
from cs50 import SQL
from flask import Flask, flash, jsonify, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
#import sqlite3

from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
from werkzeug.security import check_password_hash, generate_password_hash
from helpers import category_name, ranking

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


"""Redirect /index visitors to "/" route"""
@app.route("/index")
def index():
    return redirect("/")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/leaderboards", methods=["GET", "POST"])
def leaderboards():
    #if method is get, show page without table
    if request.method == "GET":
        return render_template("leaderboards.html")

    # get category from form
    category = request.form["category"]
    #get size of table from form
    x = int(request.form["amount"])
    #get values from a category from the database, and sort them
    scores = ranking(category)

    #values for the header of the table(this way, the values dont get printed if method is GET)
    tabel = ["", "Naam", "Score", "Tijd"]

    return render_template("leaderboards.html", scores = scores[:x], tabel = tabel)


@app.route("/game_over", methods=["GET", "POST"])
def game_over():
    return render_template("game_over.html")


@app.route("/quiz", methods=["GET", "POST"])
def quiz():
    if request.method == "POST":
        return render_template("quiz.html",
        category = request.form.get("category"),
        username = request.form.get("username"),
        category_name = category_name(request.form.get("category")))
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
    time = request.args.get('time')
    prev_score = db.execute("SELECT * FROM scores WHERE naam = ? AND categorie = ?", (username, category))
    if score > 0:
        if not prev_score:
            db.execute("INSERT INTO scores (naam, vragen, tijd, categorie) VALUES(?, ?, ?, ?);", (username, score, time, category))
        else:
            if score > prev_score[0]["vragen"]:
                db.execute("UPDATE scores SET vragen = ?, tijd = ? WHERE naam = ? AND categorie = ?", (score, time, username, category))
    return('', 204)