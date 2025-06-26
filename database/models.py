# coding: utf-8
from sqlalchemy import BigInteger, Column, Date, DateTime, ForeignKey, Integer, JSON, Numeric, String, Text, text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.schema import Sequence
########################################################################################################################
# Classes describing database for SqlAlchemy ORM, initially created by schema introspection.
#
# Alter this file per your database maintenance policy
#    See https://apilogicserver.github.io/Docs/Project-Rebuild/#rebuilding
#
# Created:  March 16, 2025 09:22:01
# Database: postgresql://postgres:postgres@127.0.0.1:5432/medai
# Dialect:  postgresql
#
# mypy: ignore-errors
########################################################################################################################
 
from database.system.SAFRSBaseX import SAFRSBaseX, TestBase
import safrs, flask_sqlalchemy, os
from safrs import jsonapi_attr
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from sqlalchemy.orm import Mapped
from sqlalchemy.sql.sqltypes import NullType
from typing import List

db = SQLAlchemy() 
Base = declarative_base()  # type: flask_sqlalchemy.model.DefaultMeta
metadata = Base.metadata

#NullType = db.String  # datatype fixup
#TIMESTAMP= db.TIMESTAMP

from sqlalchemy.dialects.postgresql import *

if os.getenv('APILOGICPROJECT_NO_FLASK') is None or os.getenv('APILOGICPROJECT_NO_FLASK') == 'None':
    Base = SAFRSBaseX   # enables rules to be used outside of Flask, e.g., test data loading
else:
    Base = TestBase     # ensure proper types, so rules work for data loading
    print('*** Models.py Using TestBase ***')



class DrugUnit(Base):  # type: ignore
    __tablename__ = 'drug_unit'
    _s_collection_name = 'DrugUnit'  # type: ignore

    unit_name = Column(String(10), primary_key=True)
    allow_client_generated_ids = True

    # parent relationships (access parent)

    # child relationships (access children)
    DrugList : Mapped[List["Drug"]] = relationship(back_populates="drug_unit")
    DosageList : Mapped[List["Dosage"]] = relationship(back_populates="drug_unit")
    PatientMedicationList : Mapped[List["PatientMedication"]] = relationship(back_populates="drug_unit")
    RecommendationList : Mapped[List["Recommendation"]] = relationship(back_populates="drug_unit")



class InsulinRule(Base):  # type: ignore
    __tablename__ = 'insulin_rules'
    _s_collection_name = 'InsulinRule'  # type: ignore

    id = Column(BigInteger, Sequence('insulin_rules_id_seq'), primary_key=True)
    blood_sugar_reading = Column(String(20), nullable=False)
    blood_sugar_level = Column(Integer, nullable=False)
    glargine_before_dinner = Column(Integer)
    lispro_before_breakfast = Column(Integer)
    lispro_before_lunch = Column(Integer)
    lispro_before_dinner = Column(Integer)

    # parent relationships (access parent)

    # child relationships (access children)



class Patient(Base):  # type: ignore
    __tablename__ = 'patient'
    _s_collection_name = 'Patient'  # type: ignore

    id = Column(BigInteger, Sequence('patient_id_seq'), primary_key=True)
    name = Column(String(256), nullable=False)
    birth_date = Column(Date)
    age = Column(Numeric(10, 1))
    weight = Column(BigInteger)
    height = Column(BigInteger)
    hba1c = Column(NUMERIC(10,2))
    duration = Column(BigInteger)
    ckd = Column(Integer)
    cad = Column(Integer)
    hld = Column(Integer)
    patient_sex = Column(String(1), server_default=text('M'))
    creatine_mg_dl = Column(Numeric(10, 4))
    medical_record_number = Column(String(256))
    created_date = Column(DateTime, server_default=text("now()"))

    # parent relationships (access parent)

    # child relationships (access children)
    PatientLabList : Mapped[List["PatientLab"]] = relationship(back_populates="patient")
    ReadingList : Mapped[List["Reading"]] = relationship(back_populates="patient")
    ReadingHistoryList : Mapped[List["ReadingHistory"]] = relationship(back_populates="patient")
    InsulinList : Mapped[List["Insulin"]] = relationship(back_populates="patient")
    PatientMedicationList : Mapped[List["PatientMedication"]] = relationship(back_populates="patient")
    RecommendationList : Mapped[List["Recommendation"]] = relationship(back_populates="patient")



class Drug(Base):  # type: ignore
    __tablename__ = 'drug'
    _s_collection_name = 'Drug'  # type: ignore

    id = Column(BigInteger, Sequence('drug_id_seq'), primary_key=True)
    drug_name = Column(String(256), nullable=False)
    dosage = Column(Numeric(10, 4))
    dosage_unit = Column(ForeignKey('drug_unit.unit_name'))
    drug_type = Column(String(256))
    manufacturer = Column(String(256))
    side_effects = Column(Text)

    # parent relationships (access parent)
    drug_unit : Mapped["DrugUnit"] = relationship(back_populates=("DrugList"))

    # child relationships (access children)
    ContraindicationList : Mapped[List["Contraindication"]] = relationship(foreign_keys='[Contraindication.drug_id_1]', back_populates="drug")
    ContraindicationList1 : Mapped[List["Contraindication"]] = relationship(foreign_keys='[Contraindication.drug_id_2]', back_populates="drug1")
    DosageList : Mapped[List["Dosage"]] = relationship(back_populates="drug")
    InsulinList : Mapped[List["Insulin"]] = relationship(back_populates="drug")
    PatientMedicationList : Mapped[List["PatientMedication"]] = relationship(back_populates="drug")
    RecommendationList : Mapped[List["Recommendation"]] = relationship(back_populates="drug")



class PatientLab(Base):  # type: ignore
    __tablename__ = 'patient_lab'
    _s_collection_name = 'PatientLab'  # type: ignore

    id = Column(BigInteger, Sequence('patient_lab_id_seq'), primary_key=True)
    patient_id = Column(ForeignKey('patient.id', ondelete='CASCADE'), nullable=False)
    lab_name = Column(String(256), nullable=False)
    lab_test_name = Column(String(256), nullable=False)
    lab_test_code = Column(String(256))
    lab_test_description = Column(Text)
    lab_date = Column(Date, server_default=text("now()"))
    lab_result = Column(JSON)

    # parent relationships (access parent)
    patient : Mapped["Patient"] = relationship(back_populates=("PatientLabList"))

    # child relationships (access children)



class Reading(Base):  # type: ignore
    __tablename__ = 'reading'
    _s_collection_name = 'Reading'  # type: ignore

    id = Column(BigInteger, Sequence('reading_id_seq'), primary_key=True)
    patient_id = Column(ForeignKey('patient.id', ondelete='CASCADE'), nullable=False)
    time_of_reading = Column(String(10), nullable=False)
    reading_value = Column(Numeric(10, 4))
    reading_date = Column(Date, server_default=text("now()"))
    notes = Column(Text)

    # parent relationships (access parent)
    patient : Mapped["Patient"] = relationship(back_populates=("ReadingList"))

    # child relationships (access children)



class ReadingHistory(Base):  # type: ignore
    __tablename__ = 'reading_history'
    _s_collection_name = 'ReadingHistory'  # type: ignore

    id = Column(BigInteger, Sequence('reading_history_id_seq'), primary_key=True)
    patient_id = Column(ForeignKey('patient.id', ondelete='CASCADE'), nullable=False)
    reading_date = Column(Date, nullable=False)
    breakfast = Column(Numeric(10, 4), server_default=text("0.0"))
    lunch = Column(Numeric(10, 4), server_default=text("0.0"))
    dinner = Column(Numeric(10, 4), server_default=text("0.0"))
    bedtime = Column(Numeric(10, 4), server_default=text("0.0"))
    notes_for_day = Column(Text)

    # parent relationships (access parent)
    patient : Mapped["Patient"] = relationship(back_populates=("ReadingHistoryList"))

    # child relationships (access children)



class Contraindication(Base):  # type: ignore
    __tablename__ = 'contraindication'
    _s_collection_name = 'Contraindication'  # type: ignore

    id = Column(BigInteger, Sequence('contraindication_id_seq'), primary_key=True)
    drug_id_1 = Column(ForeignKey('drug.id'), nullable=False)
    drug_id_2 = Column(ForeignKey('drug.id'), nullable=False)
    description = Column(Text)

    # parent relationships (access parent)
    drug : Mapped["Drug"] = relationship(foreign_keys='[Contraindication.drug_id_1]', back_populates=("ContraindicationList"))
    drug1 : Mapped["Drug"] = relationship(foreign_keys='[Contraindication.drug_id_2]', back_populates=("ContraindicationList1"))

    # child relationships (access children)



class Dosage(Base):  # type: ignore
    __tablename__ = 'dosage'
    _s_collection_name = 'Dosage'  # type: ignore

    id = Column(BigInteger, Sequence('dosage_id_seq'), primary_key=True)
    drug_id = Column(ForeignKey('drug.id', ondelete='CASCADE'), nullable=False)
    drug_name = Column(String(256))
    drug_type = Column(String(256))
    min_dose = Column(Numeric(10, 4))
    max_dose = Column(Numeric(10, 4))
    dosage_unit = Column(ForeignKey('drug_unit.unit_name'))
    min_age = Column(Numeric(10, 4), server_default=text("18"))
    max_age = Column(Numeric(10, 4), server_default=text("105"))
    min_weight = Column(Numeric(10, 4))
    max_weight = Column(Numeric(10, 4))
    min_creatine = Column(Numeric(10, 4))
    max_creatine = Column(Numeric(10, 4))

    # parent relationships (access parent)
    drug_unit : Mapped["DrugUnit"] = relationship(back_populates=("DosageList"))
    drug : Mapped["Drug"] = relationship(back_populates=("DosageList"))

    # child relationships (access children)



class Insulin(Base):  # type: ignore
    __tablename__ = 'insulin'
    _s_collection_name = 'Insulin'  # type: ignore

    id = Column(BigInteger, Sequence('insulin_id_seq'), primary_key=True)
    patient_id = Column(ForeignKey('patient.id', ondelete='CASCADE'), nullable=False)
    drug_type = Column(ForeignKey('drug.id'), server_default=text("5"), nullable=False)
    reading_date = Column(Date, nullable=False)
    breakfast = Column(Numeric(10, 4))
    lunch = Column(Numeric(10, 4))
    dinner = Column(Numeric(10, 4))
    bedtime = Column(Numeric(10, 4))

    # parent relationships (access parent)
    drug : Mapped["Drug"] = relationship(back_populates=("InsulinList"))
    patient : Mapped["Patient"] = relationship(back_populates=("InsulinList"))

    # child relationships (access children)



class PatientMedication(Base):  # type: ignore
    __tablename__ = 'patient_medication'
    _s_collection_name = 'PatientMedication'  # type: ignore

    id = Column(BigInteger, Sequence('patient_medication_id_seq'), primary_key=True)
    patient_id = Column(ForeignKey('patient.id', ondelete='CASCADE'), nullable=False)
    drug_id = Column(ForeignKey('drug.id'), nullable=False)
    dosage = Column(Numeric(10, 4))
    dosage_unit = Column(ForeignKey('drug_unit.unit_name'))

    # parent relationships (access parent)
    drug_unit : Mapped["DrugUnit"] = relationship(back_populates=("PatientMedicationList"))
    drug : Mapped["Drug"] = relationship(back_populates=("PatientMedicationList"))
    patient : Mapped["Patient"] = relationship(back_populates=("PatientMedicationList"))

    # child relationships (access children)



class Recommendation(Base):  # type: ignore
    __tablename__ = 'recommendation'
    _s_collection_name = 'Recommendation'  # type: ignore

    id = Column(BigInteger, Sequence('recommendation_id_seq'), primary_key=True)
    patient_id = Column(ForeignKey('patient.id', ondelete='CASCADE'), nullable=False)
    time_of_reading = Column(String(10), nullable=False)
    drug_id = Column(ForeignKey('drug.id'), nullable=False)
    dosage = Column(Numeric(10, 4))
    dosage_unit = Column(ForeignKey('drug_unit.unit_name'))
    recommendation_date = Column(DateTime, server_default=text("now()"))

    # parent relationships (access parent)
    drug_unit : Mapped["DrugUnit"] = relationship(back_populates=("RecommendationList"))
    drug : Mapped["Drug"] = relationship(back_populates=("RecommendationList"))
    patient : Mapped["Patient"] = relationship(back_populates=("RecommendationList"))

    # child relationships (access children)
