import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, Response
)
from flask_cors import cross_origin
from werkzeug.security import check_password_hash, generate_password_hash

from flaskr.db import create_connection

import sqlite3
from sqlite3 import Error

bp = Blueprint('auth', __name__, url_prefix='/auth')


@bp.route('/register', methods=('GET', 'POST'))
@cross_origin()
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        db = get_db()
        error = None

        if not username:
            error = 'Username is required.'
        elif not password:
            error = 'Password is required.'

        if error is None:
            try:
                db.execute(
                    "INSERT INTO user (username, password, role) VALUES (?, ?, ?)",
                    (username, generate_password_hash(password),),
                )
                db.commit()
            except db.IntegrityError:
                error = f"User {username} is already registered."
            else:
                return redirect(url_for("auth.login"))

        flash(error)

    return render_template('auth/register.html')


@bp.route('/login', methods=('GET', 'POST'))
@cross_origin()
def login():
    if request.method == 'POST':
        username = request.json['username']
        password = request.json['password']
        db = create_connection()
        error = None
        user = db.execute(
            'SELECT * FROM user WHERE username = ?', (username,)
        ).fetchone()

        if user is None:
            error = 'Incorrect username.'
        elif user['password'] != password:
            error = 'Incorrect password.'

        if error is None:
            return user
        return Response(error, status=400)

