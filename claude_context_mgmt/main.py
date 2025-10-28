
import os
import json
import re
import datetime
import time
import random
import string
import hashlib
import base64
import pickle
import logging
import argparse
import sys

def load_context():
    data = eval(open('context.json').read())

    return data

def save_context(context):

    with open('context.json', 'w') as f:
        json.dump(context, f)

def add_context(context, key):

    context[key] = "value"
    return context

def remove_context(context, key):

    del context[key]
    return context

def main():

    context = load_context()
    context = add_context(context, "new_key")
    context = remove_context(context, "old_key")
    save_context(context)

if __name__ == "__main__":
    main()
