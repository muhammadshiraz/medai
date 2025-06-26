from flask import request, jsonify
import logging
import safrs
import datetime
from database import models
import pandas as pd
import os

db = safrs.DB
session = db.session

app_logger = logging.getLogger("api_logic_server_app")


def add_service(app, api, project_dir, swagger_host: str, PORT: str, method_decorators):
    pass

    def create_reading(patient_id, key, value):
        reading = models.Reading()
        reading.patient_id = patient_id
        reading.reading_date = datetime.datetime.now()
        reading.time_of_reading = key
        setattr(reading, "reading_value", value)
        session.add(reading)
        try:
            session.commit()
        except Exception as e:
            print(f"Error creating reading: {e}")

    @app.route("/load_ten_csv", methods=["GET"])
    def load_ten_csv():
        """
        Load a CSV file into the database
        curl 'http://localhost:5656/load_ten_csv?csv_file=ten_patients.csv'
        """
        import datetime

        # Load the CSV file
        csv_file = request.args.get("csv_file")
        if not csv_file:
            return jsonify({"error": "No CSV file specified"}), 400
        if not os.path.exists(csv_file):
            return jsonify({"error": "CSV file not found"}), 404
        
        df = pd.read_csv(csv_file)

        # Iterate over each row in the dataframe
        for index, row in df.iterrows():
            if not row["Patient Id"]:
                continue
            # Assuming your model is called 'YourModel' and has fields 'field1', 'field2', etc.
            patient = models.Patient()
            age = int(row["Age"]) if not pd.isna(row["Age"]) else None
            if age is not None:
                patient.birth_date = datetime.datetime.now() - pd.DateOffset(
                    years=int(age)
                )
            else:
                continue
            patient.patient_sex = "M" if row["Gender"] == 1 else "F"
            patient.weight = int(row["Weight"])
            patient.height = int(row["Height"])
            patient_id = int(row["Patient Id"])
            # patient.id = row['ID']
            patient.name = f"Patient-{patient_id}"
            patient.medical_record_number = f"MRN{patient_id}"
            patient.hba1c = float(row["A1c"])
            #patient.ckd = int(row["CKD"])
            patient.cad = int(row["CAD"])
            patient.hld = int(row["HLD"])
            patient.duration = int(row["Duration"])
            patient.creatine_mg_dl = float(row["Creatinine"])
            session.add(patient)
            try:
                # Commit the session to save the records in the database
                session.commit()
                #Metformin,Glimepiride,Tradjenta,Glargine,Lispro,Farxiga,Ozempic
                insert_medication(patient.id, row,  "Metformin" , 1)
                insert_medication(patient.id, row,  "Glimepiride" , 2)
                insert_medication(patient.id, row,  "Tradjenta" , 3)
                insert_medication(patient.id, row,  "Glargine" , 4)
                insert_medication(patient.id, row,  "Lispro" , 5)
                insert_medication(patient.id, row,  "Farxiga" , 6)
                insert_medication(patient.id, row,  "Ozempic" , 7)
                
                #create_reading(patient.id, "breakfast", int(row["FBS bb"]))
                #create_reading(patient.id, "lunch", int(row["FBS bl"]))
                #create_reading(patient.id, "dinner", int(row["FBS bd"]))
                #create_reading(patient.id, "bedtime", int(row["FBS bbd"]))

                reading_history = models.ReadingHistory()
                reading_history.patient_id = patient.id
                reading_history.reading_date = datetime.datetime.now()
                reading_history.breakfast = int(row["FBS bb"])
                reading_history.lunch = int(row["FBS bl"])
                reading_history.dinner = int(row["FBS bd"])
                reading_history.bedtime = int(row["FBS bbd"])
                session.add(reading_history)
                session.commit()
            except Exception as e:
                # session.rollback()
                app_logger.error(f"Error loading CSV file: {e}")
                #return jsonify({"error": "Error loading CSV file"}), 500
        session.close()
        return jsonify({"success": "CSV file loaded"}), 200

    
    @app.route("/load_csv", methods=["GET"])
    def load_csv():
        """
        Load a CSV file into the database
        curl 'http://localhost:5656/load_csv?csv_file=patient.csv'
        """
        import datetime

        # Load the CSV file
        csv_file = request.args.get("csv_file")
        if not csv_file:
            return jsonify({"error": "No CSV file specified"}), 400
        if not os.path.exists(csv_file):
            return jsonify({"error": "CSV file not found"}), 404
        
        df = pd.read_csv(csv_file)

        # Iterate over each row in the dataframe
        for index, row in df.iterrows():
            if not row["Patient Id"]:
                continue
            # Assuming your model is called 'YourModel' and has fields 'field1', 'field2', etc.
            patient = models.Patient()
            age = int(row["Age"]) if not pd.isna(row["Age"]) else None
            if age is not None:
                patient.birth_date = datetime.datetime.now() - pd.DateOffset(
                    years=int(age)
                )
            else:
                continue
            patient.patient_sex = "M" if row["Gender"] == 1 else "F"
            patient.weight = int(row["Weight (lbs)"])
            patient.height = int(row["Height (inches)"])
            patient_id = int(row["Patient Id"])
            # patient.id = row['ID']
            patient.name = f"Patient-{patient_id}"
            patient.medical_record_number = f"MRN{patient_id}"
            patient.hba1c = float(row["HbA1c %"])
            patient.ckd = int(row["CKD"])
            patient.cad = int(row["CAD"])
            patient.hld = int(row["HLD"])
            patient.duration = int(row["Duration"])
            patient.creatine_mg_dl = float(row["Creatinine"])
            session.add(patient)
            try:
                # Commit the session to save the records in the database
                session.commit()
                #Metformin,Glimepiride,Tradjenta,Glargine,Lispro,Farxiga,Ozempic
                insert_medication(patient.id, row,  "Metformin" , 1)
                insert_medication(patient.id, row,  "Glimepiride" , 2)
                insert_medication(patient.id, row,  "Tradjenta" , 3)
                insert_medication(patient.id, row,  "Glargine" , 4)
                insert_medication(patient.id, row,  "Lispro" , 5)
                insert_medication(patient.id, row,  "Farxiga" , 6)
                insert_medication(patient.id, row,  "Ozempic" , 7)
                
                create_reading(patient.id, "breakfast", int(row["Blood sugar before breakfast"]))
                create_reading(patient.id, "lunch", int(row["Blood sugar before lunch"]))
                create_reading(patient.id, "dinner", int(row["Blood sugar before dinner"]))
                create_reading(patient.id, "bedtime", int(row["Blood sugar before bed time"]))

                reading_history = models.ReadingHistory()
                reading_history.patient_id = patient.id
                reading_history.reading_date = datetime.datetime.now()
                reading_history.breakfast = int(row["Blood sugar before breakfast"])
                reading_history.lunch = int(row["Blood sugar before lunch"])
                reading_history.dinner = int(row["Blood sugar before dinner"])
                reading_history.bedtime = int(row["Blood sugar before bed time"])
                session.add(reading_history)
                session.commit()
            except Exception as e:
                # session.rollback()
                app_logger.error(f"Error loading CSV file: {e}")
                #return jsonify({"error": "Error loading CSV file"}), 500
        session.close()
        return jsonify({"success": "CSV file loaded"}), 200


    def insert_medication(patient_id: int, row: dict,  key:str , drug_id:int):
        if int(row[key]) == 0:
            return
        medication = models.PatientMedication()
        medication.patient_id = patient_id
        medication.drug_id = drug_id
        medication.dosage = int(row[key])
        medication.dosage_unit = 'mg'
        session.add(medication)
        session.commit()
        
    @app.route("/load_insulin", methods=["GET"])
    def load_insulin():
        """
        Load a CSV file into the database
        """
        import datetime

        # Load the CSV file
        csv_file = request.args.get("csv_file") or 'insulin_new_rules.csv'
        if not csv_file:
            return jsonify({"error": "No CSV file specified"}), 400
        if not os.path.exists(csv_file):
            return jsonify({"error": "CSV file not found"}), 404
        df = pd.read_csv(csv_file)

        # Iterate over each row in the dataframe
        for index, row in df.iterrows():
            '''
                blood_sugar_reading = Column(String(20), nullable=False)
                blood_sugar_level = Column(Integer, nullable=False)
                glargine_before_dinner = Column(Integer)
                lispro_before_breakfast = Column(Integer)
                lispro_before_lunch = Column(Integer)
                lispro_before_dinner = Column(Integer)
            '''
            if pd.isna(row["Blood_Sugar_Level"]):
                continue
            insulin = models.InsulinRule()
            insulin.blood_sugar_level = int(row["Blood_Sugar_Level"])
            insulin.blood_sugar_reading = row["Blood Sugar Reading time"]
            insulin.glargine_before_dinner = (
                row["Glargine_Before_Bedtime (mg)"] if not pd.isna(row["Glargine_Before_Bedtime (mg)"]) else None
            )
            insulin.lispro_before_breakfast = (
                row["Lispro_Before_Breakfast (mg)"] if not pd.isna(row["Lispro_Before_Breakfast (mg)"]) else None
            )
            insulin.lispro_before_lunch = (
                row["Lispro_Before_Lunch (mg)"] if not pd.isna(row["Lispro_Before_Lunch (mg)"]) else None
            )
            insulin.lispro_before_dinner = (
                row["Lispro_Before_Dinner (mg)"] if not pd.isna(row["Lispro_Before_Dinner (mg)"]) else None
            )
            
            session.add(insulin)
            try:
                # Commit the session to save the records in the database
                session.commit()
            except Exception as e:
                # session.rollback()
                app_logger.error(f"Error loading CSV file: {e}")
                return jsonify({"error": "Error loading CSV file"}), 500
        session.close()
        return jsonify({"success": "Insulin Rule CSV file loaded"}), 200
