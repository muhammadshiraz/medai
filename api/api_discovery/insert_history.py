from flask import request, jsonify
import logging
import safrs
from database import models
from logic_bank.exec_row_logic.logic_row import LogicRow

db = safrs.DB 
session = db.session 

app_logger = logging.getLogger("api_logic_server_app")

def add_service(app, api, project_dir, swagger_host: str, PORT: str, method_decorators = []):
    if method_decorators is None:
        method_decorators = []

def insert_reading_history(row: models.Reading, old_row: models.Reading, logic_row: LogicRow):
    # Insert a new ReadingHistory record
    # do a get first to see if it exists (insert/update)
    import datetime
    ins_upd_dlt = 'upd'
    try:
        date = row.reading_date if row.reading_date is not None else None
        reading_history = session.query(models.ReadingHistory).filter(models.ReadingHistory.patient_id == row.patient_id , models.ReadingHistory.reading_date == date).one_or_none()
    except Exception as e:
        reading_history = None
        app_logger.error(f"Error querying reading history: {e}")

    if reading_history is None:
        reading_history = models.ReadingHistory()
        reading_history.patient_id = row.patient_id
        reading_history.reading_date = row.reading_date
        ins_upd_dlt = 'ins'
    # Only change the reading value if he current value is 0.0
    if row.time_of_reading == 'breakfast' and reading_history.breakfast is None:
        reading_history.breakfast = row.reading_value
    elif row.time_of_reading == 'lunch' and reading_history.lunch is None:
        reading_history.lunch = row.reading_value
    elif row.time_of_reading ==  'dinner' and reading_history.dinner is None:
        reading_history.dinner = row.reading_value
    elif row.time_of_reading == 'bedtime' and reading_history.bedtime is None:
        reading_history.bedtime = row.reading_value   
    else:
        app_logger.warning(f"Unknown time_of_reading: {row.time_of_reading} for patient_id: {row.patient_id}")
        return
    try:
        if ins_upd_dlt == 'ins':
            logic_row.insert(reason="insert reading history", row=reading_history)
        elif ins_upd_dlt == 'upd':
            logic_row.update(reason="update reading history", row=reading_history)
        #session.add(reading_history)
    
        #session.commit()
    except Exception as e:
        app_logger.error(f"Error committing reading history: {e}")

    app_logger.info("insert_reading_history")
    