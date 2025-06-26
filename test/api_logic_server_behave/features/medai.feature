Feature: Patient Testing
 Scenario: Validate Recommendations
     Given Existing Patients Readings
      When Blood Sugar History is given
      Then Recommendations should match prior entry
