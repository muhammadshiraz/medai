-- drop database medai;
-- create database medai;
-- \c media;

DROP  VIEW IF EXISTS patient_full_view;
DROP TABLE IF EXISTS insulin_rules;
DROP TABLE IF EXISTS contraindication;
DROP TABLE IF EXISTS dosage;
DROP TABLE IF EXISTS patient_medication;
DROP TABLE IF EXISTS patient_lab;
DROP TABLE IF EXISTS reading_history;
DROP TABLE IF EXISTS reading;
DROP TABLE IF EXISTS recommendation;
DROP TABLE IF EXISTS drug;
DROP TABLE IF EXISTS drug_unit;
DROP TABLE IF EXISTS patient;

create table drug_unit(
	unit_name VARCHAR(10) PRIMARY KEY
);

insert into drug_unit(unit_name) values ('mg');
insert into drug_unit(unit_name) values ('mcg');
insert into drug_unit(unit_name) values ('ml');
insert into drug_unit(unit_name) values ('unit');
insert into drug_unit(unit_name) values ('g');
insert into drug_unit(unit_name) values ('kg');
insert into drug_unit(unit_name) values ('l');
insert into drug_unit(unit_name) values ('oz');	

create table patient (
	id SERIAL8 PRIMARY KEY,
	name VARCHAR(256) NOT NULL,
	birth_date DATE, -- constraint (18 * 365) < NOW() - birth_date
	age NUMERIC(10,1), -- birth_date / 365.5
	weight BIGINT, 
	height BIGINT,
	hba1c NUMErIC(10,2),
	duration BIGINT, -- in months
	ckd INT,
	cad INT,
	hld INT,
	patient_sex VARCHAR(1) DEFAULT 'M', -- enum('M', 'F'),
	creatine_mg_dl NUMERIC(10,4),
	medical_record_number VARCHAR(256),
	created_date TIMESTAMP DEFAULT NOW()
);

create table patient_lab (
	id SERIAL8 PRIMARY KEY,
	patient_id BIGINT NOT NULL,
	lab_name VARCHAR(256) NOT NULL, -- Quest, LabCorp, etc
	lab_test_name VARCHAR(256) NOT NULL,
	lab_test_code VARCHAR(256),
	lab_test_description TEXT,
	lab_date DATE DEFAULT NOW(),
	lab_result JSON, -- { 'result': 'value', 'unit': 'mg/dl', 'reference_range': '0-100'}
	FOREIGN KEY (patient_id) REFERENCES patient(id) ON DELETE CASCADE
);
-- blood sugar reading
create table reading (
	id SERIAL8 PRIMARY KEY,
	patient_id BIGINT NOT NULL,
	time_of_reading VARCHAR(10) NOT NULL, -- enum('breakfast', 'lunch', 'dinner', 'bedtime'),
	reading_value NUMERIC(10,4),
	reading_date DATE DEFAULT NOW(),
	notes TEXT,
	FOREIGN KEY (patient_id) REFERENCES patient(id) ON DELETE CASCADE
);

create table reading_history (
	id SERIAL8 PRIMARY KEY,
	patient_id BIGINT NOT NULL,
	reading_date DATE NOT NULL, -- copy from reading
	breakfast NUMERIC(10,4) DEFAULT 0, 
	lunch NUMERIC(10,4) DEFAULT 0, 
	dinner NUMERIC(10,4) DEFAULT 0, 
	bedtime NUMERIC(10,4) DEFAULT 0, 
	notes_for_day TEXT,
	FOREIGN KEY (patient_id) REFERENCES patient(id) ON DELETE CASCADE
);
-- Drug 

create table drug (
	id SERIAL8 PRIMARY KEY,
	drug_name VARCHAR(256) NOT NULL,
	dosage NUMERIC(10,4),
	dosage_unit VARCHAR(10), -- default enum('mg', 'mcg', 'ml', 'unit'),
	drug_type VARCHAR(256),
	manufacturer VARCHAR(256), -- s/b lookup
	side_effects TEXT,
	FOREIGN KEY (dosage_unit) REFERENCES drug_unit(unit_name)
);
INSERT INTO drug (drug_name, dosage, dosage_unit, drug_type, manufacturer, side_effects) VALUES ('Metformin', 2000, 'unit', 'Oral', 'Merck', 'Nausea, vomiting, diarrhea, gas, weakness, indigestion, abdominal discomfort, headache, metallic taste, muscle pain, heartburn, stomach pain, rash, upper respiratory tract infection, low blood sugar');
INSERT INTO drug (drug_name, dosage, dosage_unit, drug_type, manufacturer, side_effects) VALUES ('Glimepiride', 4, 'unit', 'Oral', 'Merck', 'Nausea, vomiting, diarrhea, gas, weakness, indigestion, abdominal discomfort, headache, metallic taste, muscle pain, heartburn, stomach pain, rash, upper respiratory tract infection, low blood sugar');
INSERT INTO drug (drug_name, dosage, dosage_unit, drug_type, manufacturer, side_effects) VALUES ('Tradjenta', 5, 'unit', 'Oral', 'Merck', 'Nausea, vomiting, diarrhea, gas, weakness, indigestion, abdominal discomfort, headache, metallic taste, muscle pain, heartburn, stomach pain, rash, upper respiratory tract infection, low blood sugar');
INSERT INTO drug (drug_name, dosage, dosage_unit, drug_type, manufacturer, side_effects) VALUES ('Glargine', 20, 'unit', 'Injectable', 'Merck', 'Nausea, vomiting, diarrhea, gas, weakness, indigestion, abdominal discomfort, headache, metallic taste, muscle pain, heartburn, stomach pain, rash, upper respiratory tract infection, low blood sugar');
INSERT INTO drug (drug_name, dosage, dosage_unit, drug_type, manufacturer, side_effects) VALUES ('Lispro', 36, 'unit', 'Injectable', 'Merck', 'Nausea, vomiting, diarrhea, gas, weakness, indigestion, abdominal discomfort, headache, metallic taste, muscle pain, heartburn, stomach pain, rash, upper respiratory tract infection, low blood sugar');
INSERT INTO drug (drug_name, dosage, dosage_unit, drug_type, manufacturer, side_effects) VALUES ('Farxiga', 10, 'unit', 'Oral', 'Merck', 'Nausea, vomiting, diarrhea, gas, weakness, indigestion, abdominal discomfort, headache, metallic taste, muscle pain, heartburn, stomach pain, rash, upper respiratory tract infection, low blood sugar');
INSERT INTO drug (drug_name, dosage, dosage_unit, drug_type, manufacturer, side_effects) VALUES ('Ozempic', 0.5, 'unit', 'Injectable', 'Merck', 'Nausea, vomiting, diarrhea, gas, weakness, indigestion, abdominal discomfort, headache, metallic taste, muscle pain, heartburn, stomach pain, rash, upper respiratory tract infection, low blood sugar');

-- update drug set dosage_unit='unit' 
create table patient_medication (
	id SERIAL8 PRIMARY KEY,
	patient_id BIGINT NOT NULL,
	drug_id BIGINT NOT NULL,
	dosage NUMERIC(10,4),
	dosage_unit VARCHAR(10), -- default enum('mg', 'mcg', 'ml', 'unit'),
	FOREIGN KEY (drug_id) REFERENCES drug(id),
	FOREIGN KEY (dosage_unit) REFERENCES drug_unit(unit_name),
	FOREIGN KEY (patient_id) REFERENCES patient(id) ON DELETE CASCADE
);
-- drug recommendation
create table recommendation (
	id SERIAL8 PRIMARY KEY,
	patient_id BIGINT NOT NULL,
	time_of_reading VARCHAR(10) NOT NULL, -- enum('breakfast', 'lunch', 'dinner', 'bedtime'),
	drug_id BIGINT NOT NULL,
	dosage NUMERIC(10,4),
	dosage_unit VARCHAR(10), -- default enum('mg', 'mcg', 'ml', 'unit'),
	recommendation_date TIMESTAMP DEFAULT NOW(),
	FOREIGN KEY (patient_id) REFERENCES patient(id) ON DELETE CASCADE,
	FOREIGN KEY (dosage_unit) REFERENCES drug_unit(unit_name),
	FOREIGN KEY (drug_id) REFERENCES drug(id) 
);


-- A drug can have multiple dosages
create table dosage (
	id SERIAL8 PRIMARY KEY,
	drug_id BIGINT NOT NULL,
	drug_name VARCHAR(256), -- parent copy
	drug_type VARCHAR(256), -- parent copy
	min_dose NUMERIC(10,4),
	max_dose NUMERIC(10,4),
	dosage_unit VARCHAR(10), -- default enum('mg', 'mcg', 'ml', 'unit'),
	min_age NUMERIC(10,4) DEFAULT 18,
	max_age NUMERIC(10,4) DEFAULT 105,
	min_weight NUMERIC(10,4), -- in kg
	max_weight NUMERIC(10,4),
	min_creatine NUMERIC(10,4),
	max_creatine NUMERIC(10,4),
	FOREIGN KEY (dosage_unit) REFERENCES drug_unit(unit_name),
	FOREIGN KEY (drug_id) REFERENCES drug(id) ON DELETE CASCADE
);

create table contraindication (
	id SERIAL8 PRIMARY KEY,
	drug_id_1 BIGINT NOT NULL,
	drug_id_2 BIGINT NOT NULL,
	description TEXT,
	FOREIGN KEY (drug_id_1) REFERENCES drug(id),
	FOREIGN KEY (drug_id_2) REFERENCES drug(id) 
);

create table insulin_rules (
        id SERIAL8 PRIMARY KEY,
        blood_sugar_reading VARCHAR(20) NOT NULL,
        blood_sugar_level INT NOT NULL,
        glargine_before_dinner INT,
        lispro_before_breakfast INT,
        lispro_before_lunch INT,
        lispro_before_dinner INT
);


CREATE TABLE insulin (
	id BIGSERIAL NOT NULL, 
	patient_id BIGINT NOT NULL, 
	drug_type INT NOT NULL DEFAULT 5, -- Lispro
	reading_date DATE NOT NULL, 
	breakfast NUMERIC(10,4) DEFAULT 0, 
	lunch NUMERIC(10,4) DEFAULT 0, 
	dinner NUMERIC(10,4) DEFAULT 0, 
	bedtime NUMERIC(10,4) DEFAULT 0, 
	PRIMARY KEY (id),
	FOREIGN KEY (drug_type)  REFERENCES "drug" ("id") ,
	FOREIGN KEY (patient_id)  REFERENCES "patient" ("id") ON DELETE CASCADE
);


CREATE VIEW patient_full_view AS
SELECT 
    p.id AS patient_id,
    p.name,
    p.birth_date,
    p.age,
    p.weight,
    p.height,
    p.hba1c,
    p.duration,
    p.ckd,
    p.cad,
    p.hld,
    p.patient_sex,
    p.creatine_mg_dl,
    p.medical_record_number,
    p.created_date,
    
    -- Blood Sugar History
    rh.breakfast,
    rh.lunch,
    rh.dinner,
    rh.bedtime,
    rh.notes_for_day,
    
    -- Medications
    pm.drug_id,
    d.drug_name,
    pm.dosage,
    pm.dosage_unit,


    MAX(CASE WHEN d.drug_name = 'Metformin' THEN pm.dosage ELSE NULL END) AS Metformin,
    MAX(CASE WHEN d.drug_name = 'Tradjenta' THEN pm.dosage ELSE NULL END) AS Tradjenta,
    MAX(CASE WHEN d.drug_name = 'Glimepiride' THEN pm.dosage ELSE NULL END) AS Glimepiride,
    MAX(CASE WHEN d.drug_name = 'Farxiga' THEN pm.dosage ELSE NULL END) AS Farxiga,
	MAX(CASE WHEN d.drug_name = 'Ozempic' THEN pm.dosage ELSE NULL END) AS Ozempic,
    
    -- AI Recommendations-- Pivoted Medications
    MAX(CASE WHEN d_rec.drug_name = 'Metformin' THEN rec.dosage ELSE NULL END) AS Metformin,
    MAX(CASE WHEN d_rec.drug_name = 'Tradjenta' THEN rec.dosage ELSE NULL END) AS Tradjenta,
    MAX(CASE WHEN d_rec.drug_name = 'Glimepiride' THEN rec.dosage ELSE NULL END) AS Glimepiride,
    MAX(CASE WHEN d_rec.drug_name = 'Farxiga' THEN rec.dosage ELSE NULL END) AS Farxiga,
    MAX(CASE WHEN d_rec.drug_name = 'Glargine' THEN rec.dosage ELSE NULL END) AS Glargine,
	MAX(CASE WHEN d_rec.drug_name = 'Lispro' THEN rec.dosage ELSE NULL END) AS Lispro,
	MAX(CASE WHEN d_rec.drug_name = 'Ozempic' THEN rec.dosage ELSE NULL END) AS Ozempic,
	

FROM patient p
LEFT JOIN patient_lab pl ON p.id = pl.patient_id
LEFT JOIN reading r ON p.id = r.patient_id
LEFT JOIN reading_history rh ON p.id = rh.patient_id
LEFT JOIN patient_medication pm ON p.id = pm.patient_id
LEFT JOIN drug d ON pm.drug_id = d.id
LEFT JOIN recommendation rec ON p.id = rec.patient_id
LEFT JOIN drug d_rec ON rec.drug_id = d_rec.id
GROUP BY p.id, p.name, p.birth_date, p.age, p.weight, p.height, p.hba1c, p.duration, p.ckd, p.cad, p.hld, 
		p.patient_sex, p.creatine_mg_dl, p.medical_record_number, p.created_date, pl.lab_name, pl.lab_test_name, 
		pl.lab_test_code, pl.lab_test_description, pl.lab_date, pl.lab_result, r.reading_date, r.notes, rh.breakfast, 
		rh.lunch, rh.dinner, rh.bedtime, rh.notes_for_day, rec.time_of_reading, rec.drug_id, d_rec.drug_name, 
		rec.dosage, rec.dosage_unit;