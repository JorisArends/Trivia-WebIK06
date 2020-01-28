import os
import sys
from flask import redirect, render_template, request, session, jsonify
import requests
import urllib.parse

# Function to get the category name by category ID
def category_name(id):
    response = requests.get(f"https://opentdb.com/api_category.php").json()["trivia_categories"]

    categories = {}
    for dicts in response:
        categories[dicts['id']] = dicts['name']
    return categories[int(id)]

