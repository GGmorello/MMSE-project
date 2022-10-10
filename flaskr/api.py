import random
import string

from flask import (
    Blueprint, request, Response
)

from flaskr.db import create_connection

bp = Blueprint('event', __name__, url_prefix='/event')

@bp.route("/create", methods=['POST'])
def new_event():

    user, db = init(request)

    if user is None:
        return Response("Invalid user", status=400)

    elif user['role'] == "CUSTOMER_SERVICE":

        identifier = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(24))

        db.cursor().execute('INSERT INTO event (id, clientId, startDate, endDate, eventRequestItems) VALUES (?,?,?,?,?)',
                   (identifier, request.json['clientId'], request.json['startDate'], request.json['endDate'], repr(request.json['eventRequestItems'])))
        db.commit()
        event = db.cursor().execute('SELECT * FROM event WHERE id = ?', (identifier,)).fetchone()
        event['eventRequestItems'] = eval(event['eventRequestItems'])
        return event

    else:
        return Response("Error", status=403)


@bp.route('', methods=['GET'])
def retrieve():

    user, db = init(request)

    if user is None:
        return Response("Invalid user", status=400)

    elif user['role'] == "SENIOR_CUSTOMER_SERVICE_OFFICER":
        event = db.cursor().execute(
            'SELECT * FROM event WHERE status = ?', ("NEW",)
        ).fetchall()

        for e in event:
            e['eventRequestItems'] = eval(e['eventRequestItems'])

        return event
    else:
        return Response("Error", status=400)


@bp.route("/approve", methods=['PUT'])
def approve():

    user, db = init(request)

    if user is None:
        return Response("Invalid user", status=400)

    elif user['role'] == "SENIOR_CUSTOMER_SERVICE_OFFICER":
        db.cursor().execute(
            'UPDATE event SET status = ? WHERE id = ?', (request.json['status'], request.json['id'],)
        )
        db.commit()
        event = db.execute('SELECT * FROM event WHERE id = ?', (request.json['id'],)).fetchone()
        event['eventRequestItems'] = eval(event['eventRequestItems'])
        return event


def init(req):
    token = req.headers['Authorization']

    db = create_connection()

    user = db.execute(
        'SELECT * FROM user WHERE access_token = ?', (token,)
    ).fetchone()

    return user, db