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
    list = response["trivia_categories"]

    categories = {}

    for dict in list:
        categories[dict['id']] = dict['name']
    return categories

