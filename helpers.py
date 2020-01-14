import os
import sys
from flask import redirect, render_template, request, session, jsonify
import requests
import urllib.parse

def question(amount, category, difficulty, token):
    question_dict = dict()
    # Contact OpenTrivaDB API
    response = requests.get(f"https://opentdb.com/api.php?amount={amount}&category={category}&difficulty={difficulty}&token={token}").json()
    print(f'{response}', file=sys.stderr)

    # ERROR: No Results Could not return results. The API doesn't have enough questions for your query.
    if response["response_code"] == 1:
        jsonify(False)

    # ERROR: Invalid Parameter Contains an invalid parameter.
    elif response["response_code"] == 2:
        jsonify(False)

    # ERROR: Token Not Found, Session Token does not exist or all avaiable questions have been asked.
    elif response["response_code"] == 3 or response["response_code"] == 4:
        jsonify(False)

    else:
        question_dict["question"] = response["results"][0]["question"]
        question_dict["correct_answer"] = [response["results"][0]["correct_answer"]]
        question_dict["possible_answers"] = response["results"][0]["incorrect_answers"]+question_dict["correct_answer"]
        print(f'{question_dict}', file=sys.stderr)

        return question_dict
