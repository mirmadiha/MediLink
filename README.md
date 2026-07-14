#  MediLink

> An AI-powered unified healthcare platform that securely connects Patients, Doctors, and Healthcare Administrators through intelligent medical record management and AI-driven clinical insights.

<p align="center">
  <a href="https://github.com/mirmadiha/MediLink"><img src="https://img.shields.io/github/stars/mirmadiha/MediLink?style=for-the-badge&color=blue" alt="Stars" /></a>
  <a href="https://github.com/mirmadiha/MediLink/blob/main/LICENSE"><img src="https://img.shields.io/github/license/mirmadiha/MediLink?style=for-the-badge&color=emerald" alt="License" /></a>
  <a href="https://dotnet.microsoft.com/download/dotnet/8.0"><img src="https://img.shields.io/badge/.NET-8.0-purple?style=for-the-badge&logo=dotnet" alt=".NET 8" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React 18" /></a>
</p>
---

## Problem

Patients often forget to share critical medical information such as allergies, ongoing medications, chronic illnesses, or previous treatments during consultations. This becomes even more challenging when visiting multiple hospitals or consulting doctors in different locations.

Without access to a patient's complete medical history, doctors may order duplicate tests, prescribe unnecessary antibiotics, or make treatment decisions with incomplete information. In regions like Kashmir, the lack of a unified, patient-centric health record system further impacts continuity of care and patient safety.

---

## Solution

**MediLink** is a secure, AI-powered digital health record platform that enables authorized doctors to instantly access a patient's essential medical history with the patient's ABHA ID. By centralizing medical records in one place, it supports faster, safer, and more informed clinical decisions.

The platform also leverages AI to summarize medical reports, generate AI health overviews, and present medical history through an intuitive timeline—making healthcare information easier to understand for both doctors and patients while reducing duplicate tests and improving continuity of care.

---

## Features

### 👤 Patient Portal
* **Secure Auth**: JWT-validated stateless session login.
* **Health Record Upload**: Drag-and-drop file uploader for reports (PDF/PNG/JPG).
* **Consolidated Profile**: View personal ABHA ID, age, blood group, and medical history.
* **Interactive Prescriptions**: View active medications, dosage plans, and prescribing doctors.

### 🩺 Doctor Workspace
* **Secure Lookup**: Search patients via unique ABHA IDs.
* **Patient History Summary**: Access patient files, allergies, and chronic conditions upon consent.
* **Interactive Prescription Builder**: Add/remove prescription rows in real-time, detailing dosage, duration, and clinical notes.
* **Chronological Timeline**: Track previous consultations on a clinical event timeline.

### Hospital Admin Dashboard
* **Staff Registries**: Register, onboard, and manage practicing clinical doctors.
* **Platform Metrics**: View clinical counts and local hospital registries.

### AI Features
* **AI Medical Report Summary**: Explains raw lab scans in clear, patient-friendly language.
* **AI Patient Overview**: Computes a patient summary showing critical alerts, warnings, and suggested habits.
* **Medical Timeline**: Automatically parses record dates to arrange health events chronologically.
* **Quick Health Review**: Flags potential drug-to-allergy conflicts instantly.

---

## Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js (v18) + Vite | Core SPA component tree and fast building engine |
| **Styling** | Tailwind CSS (v4) | Responsive grids, shadows, and design tokens |
| **Icons** | Lucide React | Lightweight, vector clinical icon library |
| **Backend** | .NET 8 Web API | Restful routing gateways and authentication endpoints |
| **ORM** | Entity Framework Core | Database migrations and relational model mapping |
| **Database** | MS SQL Server | Structured data storage for users, records, and profiles |
| **Security** | JWT Authentication | Role-based authorization walls using identity frameworks (`Patient`, `Doctor`, `Admin`) |

---

## Project Structure

```
MediLink/
├── frontend/                     # React + Vite Client Application
│   ├── public/                   # Static assets (favicons, mockups)
│   ├── src/
│   │   ├── components/           # Reusable UI elements (Navbar, Cards, Dropdowns)
│   │   ├── pages/                # Dashboards (Patient, Doctor, Admin)
│   │   └── App.jsx               # Router registry
├── backend/                      # .NET 8 Web API Server
│   ├── Controllers/              # REST Endpoints (Auth, Patients, Doctors)
│   ├── Services/                 # Business logic and AI summarization handlers
│   ├── Models/                   # SQL schemas and database tables
│   └── Data/                     # DbContext database declarations
└── README.md
```

---

## Getting Started

### Prerequisites
* **Node.js** (v18 or higher)
* **.NET 8 SDK**
* **MS SQL Server**
* **Git**

### Clone the Repository
```bash
git clone https://github.com/mirmadiha/MediLink.git
cd MediLink
```

### Frontend Setup
```bash
cd frontend
npm install
```

### Backend Setup
```bash
cd ../backend
dotnet restore
```

### Database Setup
Update the connection string in `backend/appsettings.json`, then run:
```bash
dotnet ef database update
```

### Run the Application
Start the frontend dev server:
```bash
# In frontend/ directory
npm run dev
```

Start the backend server:
```bash
# In backend/ directory
dotnet run
```

---

## Environment Variables

### Frontend (`frontend/.env`)
* `VITE_API_URL`: Root address of the backend Web API (default: `http://localhost:5000/api`).

### Backend (`backend/appsettings.json`)
* `ConnectionStrings:DefaultConnection`: Connection string for MS SQL Server instance.
* `JWT:Secret`: Encription secret key for JWT token signatures.
* `JWT:Issuer` / `JWT:Audience`: Token validation headers.
* `AI:ApiKey`: API key configured to access summarization engines.

---

## Team
* **Maha Mateen** - Student (GitHub: [@mahamateen3009](https://github.com/mahamateen3009))
* **Qazi Isra** - Student (GitHub: [@QaziIsra](https://github.com/QaziIsra))
* **Tamana Zehra** - Student (GitHub: [@tamanazehra](https://github.com/tamanazehra))
* **Maryam Mirza** - Student (GitHub: [@mygclass2020](https://github.com/mygclass2020))
* **Madiha Aijaz** - Student (GitHub: [@mirmadiha](https://github.com/mirmadiha))

---

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
