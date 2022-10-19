import random
import string

from flask import (
    Blueprint, request, Response
)
from flask_cors import cross_origin

from flaskr.db import create_connection

bp = Blueprint('user', __name__, url_prefix='/user')

@bp.route("/hire", methods=['POST'])
@cross_origin()
def createHiringRequest():
    user, db = init(request)

    if user is None:
        return Response("Invalid user", status=400)

    role = user['role']

    if role != "SERVICE_MANAGER" and role != "PRODUCTION_MANAGER":
        return Response("Unauthorized", status=403)
    
    
    cur = db.cursor()
    cur.execute('INSERT INTO hiring_request (requestor, requestedRole, comment) VALUES (?,?,?)',
                (request.json['requestor'], request.json['requestedRole'], request.json['comment']))
    db.commit()
    req = cur.execute('SELECT * FROM hiring_request WHERE id = ?', (cur.lastrowid,)).fetchone()
    return req


def init(req):
    token = req.headers['Authorization']

    db = create_connection()

    user = db.execute(
        'SELECT * FROM user WHERE access_token = ?', (token,)
    ).fetchone()

    return user, db