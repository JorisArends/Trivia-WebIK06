import os
from cs50 import SQL
from flask import redirect, render_template, request, session, jsonify
import requests

db = SQL("sqlite:///trivia.db")

# Function to get the category name by category ID
def category_name(id):
    response = requests.get(f"https://opentdb.com/api_category.php").json()["trivia_categories"]

    categories = {}
    for dicts in response:
        categories[dicts['id']] = dicts['name']
    return categories[int(id)]

def ranking(category):
    #get values from a category from the database, and sort them
    scores = db.execute("SELECT * FROM scores WHERE categorie = ? ORDER BY vragen DESC, tijd ASC", (category,))

    #give all entries for leaderboard the correct ranking
    i = 1
    for score in scores:
        score["positie"] = i
        i+=1
    return scores

# DB Execute functions
def prev_score(username, category):
    # Check if user has a previous score
    return db.execute("SELECT * FROM scores WHERE naam = ? AND categorie = ?", (username, category))

def insert_score(username, score, time, category):
    # Insert new score after finishing quiz
    return db.execute("INSERT INTO scores (naam, vragen, tijd, categorie) VALUES(?, ?, ?, ?);", (username, score, time, category))

def update_score(username, score, time, category):
    # Update old score when user beats his own previous score
    db.execute("UPDATE scores SET vragen = ?, tijd = ? WHERE naam = ? AND categorie = ?", (score, time, username, category))
