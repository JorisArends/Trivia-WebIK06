import os
import sys
from cs50 import SQL
from flask import redirect, render_template, request, session, jsonify
import requests
import urllib.parse
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