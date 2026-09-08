SAD Service Request Management System

Student Name: James Albert R. Abasula  
Course & Section: System Analysis and Design  
Repository URL: [https://github.com/YOUR_GITHUB_USERNAME/SAD-ServiceRequest-Abasula](https://github.com/abasulajamesalbert-spec/SAD-ServiceRequest-Abasula)  
Live Application: [https://YOUR_GITHUB_USERNAME.github.io/SAD-ServiceRequest-Abasula/ ](https://abasulajamesalbert-spec.github.io/SAD-ServiceRequest-Abasula/) 


1. Problem Statement
The university ICT office receives support requests through verbal, text, and social media channels. This decentralization causes requests to be forgotten, duplicated, or unmonitored. The ICT Service Request Management System centralizes technical support management into a single web platform, enabling personnel to systematically log, track, and resolve technical issues.


2. System Actors
System User / ICT Personnel: Primary actor responsible for creating, viewing, updating, searching, filtering, and resolving service requests.

3. Use Case Diagram
![Use Case Diagram](UseCase.drawio.png)

User --> Login
    User --> Dashboard
    User --> Create
    User --> View
    User --> Search
    User --> Filter
    User --> Update
    User --> Delete
    User --> Logout

4. Entity Relationship Diagram (ERD)
![Entity Relationship Diagram](ERD.drawio.png)

erDiagram
    USER ||--o{ SERVICE_REQUEST : "creates (1:M)"
    USER {
        uuid user_id PK
        string email
    }
    SERVICE_REQUEST {
        bigint id PK
        string requester_name
        string department
        string category
        string description
        string priority
        string status
        timestamp created_at
        uuid user_id FK
    }

Cardinality: `USER` (1) creates many (`M`) `SERVICE_REQUEST` records.

5. Requirements Traceability Matrix (RTM)

| Req ID | Requirement | System Feature | Test Case | Status |
| :--- | :--- | :--- | :--- | :--- |
| FR-01 | User Login | Login Page | TC-01 | PASS |
| FR-02 | Create Request | Request Form | TC-02 | PASS |
| FR-03 | View Requests | Request Table | TC-03 | PASS |
| FR-04 | Update Request | Edit Button | TC-04 | PASS |
| FR-05 | Delete Request | Delete Confirmation | TC-05 |PASS |
| FR-06 | Search Records | Search Bar | TC-06 | PASS |
| FR-07 | Filter Records | Dropdown Filters | TC-07 | PASS |
| FR-08 | Dashboard Summary | Metrics Cards | TC-08 | PASS |

6. System Verification & Test Cases

| Test ID | Test Scenario | Expected Outcome | Result |
| :--- | :--- | :--- | :--- |
| TC-01 | Login Verification | Authenticates valid credentials and redirects to dashboard | PASS |
| TC-02 | Request Creation | Inserts new record into Supabase and updates metrics | PASS |
| TC-03 | Request Display | Renders existing data dynamically in the HTML table | PASS |
| TC-04 | Request Update | Modifies record fields and updates database | PASS |
| TC-05 | Request Deletion | Prompts confirmation modal and removes database record | PASS |
| TC-06 | Search Filtering | Real-time filter by requester, department, category, description | PASS |
| TC-07 | Dropdown Filtering | Filters table records by status and priority | PASS |
| TC-08 | Deployment Test | Application runs accurately on live GitHub Pages domain | PASS |
