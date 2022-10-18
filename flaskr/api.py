import random
import string

from flask import (
    Blueprint, request, Response
)
from flask_cors import cross_origin

from flaskr.db import create_connection

bp = Blueprint('event', __name__, url_prefix='/event')

@bp.route("/create", methods=['POST'])
@cross_origin()
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
        return Response("Unauthorized", status=403)


@bp.route('', methods=['GET'])
@cross_origin()
def retrieve():

    user, db = init(request)

    if user is None:
        return Response("Invalid user", status=400)

    statuses = None
    role = user['role']
    if role == "SENIOR_CUSTOMER_SERVICE_OFFICER":
        statuses = "NEW"
    elif role == "FINANCIAL_MANAGER":
        statuses = "APPROVED_BY_SCSO"
    elif role == "ADMINISTRATION_MANAGER":
        statuses = "APPROVED_BY_FM"

    if statuses is None:
        return Response("Unauthorized", status=403)
    
    event = db.cursor().execute(
        'SELECT * FROM event WHERE status IN (?)', (statuses,),
    ).fetchall()

    for e in event:
        e['eventRequestItems'] = eval(e['eventRequestItems'])

    return event

@bp.route("/approve", methods=['PUT'])
@cross_origin()
def approve():

    user, db = init(request)

    newStatus = None
    comment = None
    approved = request.json["approved"]

    if user is None:
        return Response("Invalid user", status=400)

    id = request.json["id"]
    
    event = db.execute('SELECT * FROM event WHERE id = ?', (id,)).fetchone()

    if event is None:
        return Response("Bad request - id invalid", status=400)

    role = user['role']
    status = event['status']
    
    if role == "SENIOR_CUSTOMER_SERVICE_OFFICER":
        if (status != 'NEW'):
            return Response("Unauthorized - current event status is not 'NEW'", status=403)

        if approved == True:
            newStatus = "APPROVED_BY_SCSO"
        else:
            newStatus = "REJECTED_BY_SCSO"

    elif role == "FINANCIAL_MANAGER":
        if (status != 'APPROVED_BY_SCSO'):
            return Response("Unauthorized - current event status is not 'APPROVED_BY_SCSO'", status=403)

        if approved == True:
            newStatus = "APPROVED_BY_FM"
        else:
            newStatus = "REJECTED_BY_FM"
        comment = request.json["reviewNotes"]
    
    elif role == "ADMINISTRATION_MANAGER":
        if (status != 'APPROVED_BY_FM'):
            return Response("Unauthorized - current event status is not 'APPROVED_BY_FM'", status=403)
        
        if approved == True:
            newStatus = "APPROVED_BY_ADM"
        else:
            newStatus = "REJECTED_BY_ADM"
        comment = request.json["reviewNotes"]

    if newStatus is None:
        return Response("Unauthorized", 403)

    db.cursor().execute(
        'UPDATE event SET status = ?, reviewNotes = ? WHERE id = ?', (newStatus, comment, id,)
    )
    db.commit()
    event = db.execute('SELECT * FROM event WHERE id = ?', (id,)).fetchone()
    event['eventRequestItems'] = eval(event['eventRequestItems'])
    return event

@bp.route("/requests", methods=['GET'])
@cross_origin()
def getFinancialRequests():    
    user, db = init(request)

    if user is None:
        return Response("Invalid user", status=400)

    role = user['role']
    requests = None

    if role == "FINANCIAL_MANAGER":
        requests = db.execute('SELECT * FROM financial_request').fetchall()

    if requests is None:
        return Response("Unauthorized", 403)

    return requests

@bp.route("/request/approve", methods=['PUT'])
@cross_origin()
def approveFinancialRequest():
    
    user, db = init(request)

    if user is None:
        return Response("Invalid user", status=400)

    if user['role'] != "FINANCIAL_MANAGER":
        return Response("Unauthorized", status=403)

    id = request.json["id"]
    
    event = db.execute('SELECT * FROM financial_request WHERE id = ?', (id,)).fetchone()

    if event is None:
        return Response("Bad request - id invalid", status=400)
    

    cur = db.cursor()
    cur.execute(
        'UPDATE financial_request SET status = ? WHERE id = ?', ("APPROVED", id,)
    )
    db.commit()
    req = cur.execute('SELECT * FROM financial_request WHERE id = ?', (id,)).fetchone()
    return req

def init(req):
    token = req.headers['Authorization']

    db = create_connection()

    user = db.execute(
        'SELECT * FROM user WHERE access_token = ?', (token,)
    ).fetchone()

    return user, db