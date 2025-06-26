import datetime, os
from decimal import Decimal
from logic_bank.exec_row_logic.logic_row import LogicRow
from logic_bank.extensions.rule_extensions import RuleExtension
from logic_bank.logic_bank import Rule
from logic_bank.logic_bank import DeclareRule
import database.models as models
import api.system.opt_locking.opt_locking as opt_locking
from security.system.authorization import Grant, Security
from logic.load_verify_rules import load_verify_rules
import integration.kafka.kafka_producer as kafka_producer
import logging

app_logger = logging.getLogger(__name__)

declare_logic_message = "ALERT:  *** No Rules Yet ***"  # printed in api_logic_server.py

def declare_logic():
    ''' Declarative multi-table derivations and constraints, extensible with Python.
 
    Brief background: see readme_declare_logic.md
    
    Your Code Goes Here - Use code completion (Rule.) to declare rules
    '''

    if os.environ.get("WG_PROJECT"):
        # Inside WG: Load rules from docs/expprt/export.json
        load_verify_rules()
    else:
        # Outside WG: load declare_logic function
        from logic.logic_discovery.auto_discovery import discover_logic
        discover_logic()

    def handle_all(logic_row: LogicRow):  # #als: TIME / DATE STAMPING, OPTIMISTIC LOCKING
        """
        This is generic - executed for all classes.

        Invokes optimistic locking, and checks Grant permissions.

        Also provides user/date stamping.

        Args:
            logic_row (LogicRow): from LogicBank - old/new row, state
        """

        if os.getenv("APILOGICPROJECT_NO_FLASK") is not None:
            print("\ndeclare_logic.py Using TestBase\n")
            return  # enables rules to be used outside of Flask, e.g., test data loading

        if logic_row.is_updated() and logic_row.old_row is not None and logic_row.nest_level == 0:
            opt_locking.opt_lock_patch(logic_row=logic_row)

        Grant.process_updates(logic_row=logic_row)

        did_stamping = False
        if enable_stamping := False:  # #als:  DATE / USER STAMPING
            row = logic_row.row
            if logic_row.ins_upd_dlt == "ins" and hasattr(row, "CreatedOn"):
                row.CreatedOn = datetime.datetime.now()
                did_stamping = True
            if logic_row.ins_upd_dlt == "ins" and hasattr(row, "CreatedBy"):
                row.CreatedBy = Security.current_user().id
                #    if Config.SECURITY_ENABLED == True else 'public'
                did_stamping = True
            if logic_row.ins_upd_dlt == "upd" and hasattr(row, "UpdatedOn"):
                row.UpdatedOn = datetime.datetime.now()
                did_stamping = True
            if logic_row.ins_upd_dlt == "upd" and hasattr(row, "UpdatedBy"):
                row.UpdatedBy = Security.current_user().id  \
                    if Config.SECURITY_ENABLED == True else 'public'
                did_stamping = True
            if did_stamping:
                logic_row.log("early_row_event_all_classes - handle_all did stamping")     
    Rule.early_row_event_all_classes(early_row_event_all_classes=handle_all)

    Rule.constraint(validate=models.Contraindication, as_condition=lambda row: row.drug_id_1 != row.drug_id_2, error_msg="Drug_1 and Drug_2 must be different")
    #als rules report
    from api.system import api_utils
    # api_utils.rules_report()
    def insert_reading_history(row: models.Reading, old_row: models.Reading, logic_row: LogicRow):
        from api.api_discovery.insert_history import insert_reading_history
        insert_reading_history(row, old_row, logic_row)
    
    def fn_recommend_insulin(row: models.Reading, old_row: models.Reading, logic_row: LogicRow):
        from api.api_discovery.recommend_drug import recommend_insulin_drug
        recommend_insulin_drug(row, old_row, logic_row)
        
    def fn_recommend_drug(row: models.ReadingHistory, old_row: models.ReadingHistory, logic_row: LogicRow):
        from api.api_discovery.recommend_drug import recommend_drug
        if row.breakfast is not None and row.lunch is not None and row.dinner is not None and row.bedtime is not None:
            recommend_drug(row, old_row,logic_row)
        
    def calculate_age(row: models.Patient, old_row: models.Patient, logic_row: LogicRow):
        if isinstance(row.birth_date, datetime.date):
            birth_date = row.birth_date
        elif isinstance(row.birth_date, str):
            try:
                birth_date = datetime.datetime.strptime(row.birth_date, "%Y-%m-%d").date()
            except ValueError:
                birth_date = None
        else:
            return 99
        today = datetime.datetime.now()  # Get today's date
        age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
        return age
    
    Rule.formula(derive=models.Patient.age, calling=calculate_age)
    Rule.constraint(validate=models.Patient, as_condition=lambda row: float(row.age) >= 18, error_msg="Patient must be 18 or older")
    
    Rule.copy(derive=models.Dosage.drug_name, from_parent=models.Drug.drug_name)
    Rule.copy(derive=models.Dosage.drug_type, from_parent=models.Drug.drug_type)
    #Rule.commit_row_event(on_class=models.Reading, calling=insert_reading_history)
    Rule.after_flush_row_event(on_class=models.ReadingHistory, calling=fn_recommend_drug)
    Rule.commit_row_event(on_class=models.Reading, calling=fn_recommend_insulin)
    Rule.after_flush_row_event(on_class=models.Reading, calling=insert_reading_history)
    # ----- Constraints 
    Rule.constraint(validate=models.Reading, as_condition=lambda row: row.time_of_reading in ['breakfast','lunch','dinner','bedtime'], error_msg="Blood sugar time of reading must be one of breakfast, lunch, dinner, or bedtime not: {row.time_of_reading}")
    Rule.constraint(validate=models.Reading, as_condition=lambda row: int(row.reading_value) <= 600, error_msg="Blood sugar before {row.time_of_reading} must be less than 600")
    Rule.constraint(validate=models.Reading, as_condition=lambda row: int(row.reading_value) >= 20, error_msg="Blood sugar before {row.time_of_reading} must be greater than 20")
    Rule.constraint(validate=models.Patient, as_condition=lambda row: float(row.creatine_mg_dl) >= 0.2, error_msg="Creatine must be greater than 0.2")
    Rule.constraint(validate=models.Patient, as_condition=lambda row: float(row.creatine_mg_dl) <= 14, error_msg="Creatine must be less than 14")
    Rule.constraint(validate=models.Patient, as_condition=lambda row: int(row.weight) >= 20 and int(row.weight) <= 300 , error_msg="Weight must be greater than 20 and less than 300")   
    Rule.constraint(validate=models.Patient, as_condition=lambda row: int(row.height) >= 48 and int(row.height) <= 84, error_msg="Height must be greater than 48 and less than 84")
    Rule.constraint(validate=models.Patient, as_condition=lambda row: float(row.hba1c) >= 5 and float(row.hba1c) <= 20, error_msg="Hba1c must be greater than 5 and less than 20")
    Rule.constraint(validate=models.Patient, as_condition=lambda row: int(row.duration) >= 1 and int(row.duration) <= 600, error_msg="Duration must be greater than 1 and less than 600")
    
    
    Rule.constraint(validate=models.ReadingHistory, as_condition=lambda row: int(row.bedtime) <= 600, error_msg="Blood sugar bedtime {row.bedtime} must be less than 600")
    Rule.constraint(validate=models.ReadingHistory, as_condition=lambda row: float(row.bedtime) == 0 or int(row.bedtime) >= 20, error_msg="Blood sugar bedtime {row.bedtime} must be greater than 20")

    Rule.constraint(validate=models.ReadingHistory, as_condition=lambda row: int(row.lunch) <= 600, error_msg="Blood sugar lunch {row.lunch} must be less than 600")
    Rule.constraint(validate=models.ReadingHistory, as_condition=lambda row: float(row.lunch) == 0 or int(row.lunch) >= 20, error_msg="Blood sugar lunch {row.lunch} must be greater than 20")

    Rule.constraint(validate=models.ReadingHistory, as_condition=lambda row: int(row.dinner) <= 600, error_msg="Blood sugar dinner {row.dinner} must be less than 600")
    Rule.constraint(validate=models.ReadingHistory, as_condition=lambda row: float(row.dinner) == 0.0 or int(row.dinner) >= 20, error_msg="Blood sugar dinner {row.dinner} must be greater than 20")

    Rule.constraint(validate=models.ReadingHistory, as_condition=lambda row: int(row.breakfast) <= 600, error_msg="Blood sugar breakfast {row.breakfast} must be less than 600")
    Rule.constraint(validate=models.ReadingHistory, as_condition=lambda row: float(row.breakfast) == 0 or int(row.breakfast) >= 20, error_msg="Blood sugar breakfast {row.breakfast} must be greater than 20")

    app_logger.debug("..logic/declare_logic.py (logic == rules + code)")

