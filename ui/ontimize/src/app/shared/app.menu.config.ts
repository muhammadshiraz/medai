import { MenuRootItem } from 'ontimize-web-ngx';

import { ContraindicationCardComponent } from './Contraindication-card/Contraindication-card.component';

import { DosageCardComponent } from './Dosage-card/Dosage-card.component';

import { DrugCardComponent } from './Drug-card/Drug-card.component';

import { DrugUnitCardComponent } from './DrugUnit-card/DrugUnit-card.component';

import { InsulinRuleCardComponent } from './InsulinRule-card/InsulinRule-card.component';

import { PatientCardComponent } from './Patient-card/Patient-card.component';

import { PatientLabCardComponent } from './PatientLab-card/PatientLab-card.component';

import { PatientMedicationCardComponent } from './PatientMedication-card/PatientMedication-card.component';

import { ReadingCardComponent } from './Reading-card/Reading-card.component';

import { ReadingHistoryCardComponent } from './ReadingHistory-card/ReadingHistory-card.component';

import { RecommendationCardComponent } from './Recommendation-card/Recommendation-card.component';


export const MENU_CONFIG: MenuRootItem[] = [
    { id: 'home', name: 'HOME', icon: 'home', route: '/main/home' },
    
    {
    id: 'data', name: ' data', icon: 'remove_red_eye', opened: true,
    items: [
    
        { id: 'Contraindication', name: 'CONTRAINDICATION', icon: 'view_list', route: '/main/Contraindication' }
    
        ,{ id: 'Dosage', name: 'DOSAGE', icon: 'view_list', route: '/main/Dosage' }
    
        ,{ id: 'Drug', name: 'DRUG', icon: 'view_list', route: '/main/Drug' }
    
        ,{ id: 'DrugUnit', name: 'DRUGUNIT', icon: 'view_list', route: '/main/DrugUnit' }
    
        ,{ id: 'InsulinRule', name: 'INSULINRULE', icon: 'view_list', route: '/main/InsulinRule' }
    
        ,{ id: 'Patient', name: 'PATIENT', icon: 'view_list', route: '/main/Patient' }
    
        ,{ id: 'PatientLab', name: 'PATIENTLAB', icon: 'view_list', route: '/main/PatientLab' }
    
        ,{ id: 'PatientMedication', name: 'PATIENTMEDICATION', icon: 'view_list', route: '/main/PatientMedication' }
    
        ,{ id: 'Reading', name: 'READING', icon: 'view_list', route: '/main/Reading' }
    
        ,{ id: 'ReadingHistory', name: 'READINGHISTORY', icon: 'view_list', route: '/main/ReadingHistory' }
    
        ,{ id: 'Recommendation', name: 'RECOMMENDATION', icon: 'view_list', route: '/main/Recommendation' }
    
    ] 
},
    
    { id: 'settings', name: 'Settings', icon: 'settings', route: '/main/settings'}
    ,{ id: 'about', name: 'About', icon: 'info', route: '/main/about'}
    ,{ id: 'logout', name: 'LOGOUT', route: '/login', icon: 'power_settings_new', confirm: 'yes' }
];

export const MENU_COMPONENTS = [

    ContraindicationCardComponent

    ,DosageCardComponent

    ,DrugCardComponent

    ,DrugUnitCardComponent

    ,InsulinRuleCardComponent

    ,PatientCardComponent

    ,PatientLabCardComponent

    ,PatientMedicationCardComponent

    ,ReadingCardComponent

    ,ReadingHistoryCardComponent

    ,RecommendationCardComponent

];