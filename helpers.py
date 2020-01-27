import os
import sys
from flask import redirect, render_template, request, session, jsonify
import requests
import urllib.parse

# Function to get a new token for the user
def get_token():
    response = requests.get("https://opentdb.com/api_token.php?command=request").json()
    return response["token"]

# Function to get the category name by category ID
def category_name(id):
    response = requests.get(f"https://opentdb.com/api_category.php").json()
    categories = response["trivia_categories"]

    result = {}
    for x in categories:
        if x["id"] == int(id):
            return x["name"]
    return None

