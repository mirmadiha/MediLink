# MediLink

An AI-powered Digital Health Record Platform for Smarter, Safer Healthcare.

<p align="center">
  <a href="https://github.com/mirmadiha/MediLink"><img src="https://img.shields.io/github/stars/mirmadiha/MediLink?style=for-the-badge&color=blue" alt="Stars" /></a>
  <a href="https://github.com/mirmadiha/MediLink/blob/main/LICENSE"><img src="https://img.shields.io/github/license/mirmadiha/MediLink?style=for-the-badge&color=emerald" alt="License" /></a>
  <a href="https://dotnet.microsoft.com/download/dotnet/8.0"><img src="https://img.shields.io/badge/.NET-8.0-purple?style=for-the-badge&logo=dotnet" alt=".NET 8" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React 18" /></a>
</p>

---

## Problem Statement

During consultations, patients often forget to share critical medical history, including drug allergies, ongoing medications, chronic illnesses, or previous treatments. This is especially challenging in Jammu & Kashmir, where patients frequently consult multiple healthcare providers across different clinics and locations. Without a unified, patient-centric record system that securely shares medical histories under strict patient consent verification, doctors are forced to make decisions based on incomplete clinical information. This results in duplicate diagnostic tests, repeated antibiotic prescriptions, and critical gaps in care.

---

## Why It Matters in Jammu & Kashmir

* **Fragmented Health Logs**: Patient health records are scattered across independent clinics and hospitals with no centralized interoperability.
* **Clinic Hopping**: Patients regularly move between different providers, preventing clinicians from referencing previous treatments.
* **Patient Safety Risks**: Lack of access to historical records leads to medication errors, high rates of duplicate diagnostic tests, and delayed diagnosis.
* **Continuity of Care**: Unconsolidated files impact the management of chronic conditions and reduce the effectiveness of local healthcare systems.

---

## Features

### Patient
* **Secure Auth**: JWT-validated stateless session login.
* **Health Record Upload**: Drag-and-drop file uploader for scans and reports.
* **Consolidated Profile**: View personal ABHA ID, demographics, and clinical history.
* **AI Patient Summary**: Get clear, simplified explanations of raw diagnostic metrics.
* **Medical Timeline**: View health events sorted chronologically on a vertical timeline.

### Doctor
* **Patient Search**: Lookup patients securely using unique ABHA IDs.
* **History Lookup**: Access clinical charts, timelines, and summaries upon explicit patient consent.
* **Prescription Builder**: Add/remove medicine rows dynamically in real-time.
* **AI Patient Overview**: Review clinical alerts, allergies, and chronic conditions compiled by AI.

### Admin
* **User Management**: Onboard and manage practicing clinicians and hospital roles.
* **Platform Monitoring**: Monitor registry activities and platform statistics.
* **Record Management**: Oversee record access logs and audit trails.

### AI
* **Medical Report Summarization**: Translates raw diagnostic parameters into plain language.
* **Patient Overview**: Consolidates patient profiles to highlight critical allergies and medical risks.
* **Timeline Generation**: Dynamically maps previous events to generate a visual timeline.
* **Quick Health Insights**: Flags potential drug-allergy conflicts automatically.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, Vite, Tailwind CSS |
| **Backend** | .NET 8 Web API, Entity Framework Core |
| **Database** | SQL Server |
| **Authentication** | JWT (JSON Web Tokens) |
| **Version Control** | Git & GitHub |

---

## How to Run Locally

### Prerequisites
* Node.js (v18+)
* .NET 8 SDK
* SQL Server
* Git

### Clone Repository
```bash
git clone https://github.com/mirmadiha/MediLink.git
cd MediLink
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd ../backend
dotnet restore
dotnet run
```

*Note: Update the database connection string in `backend/appsettings.json` to point to your local SQL Server instance before running the backend application.*

---

## Live Demo

> Live demo coming soon.

---

## Future Improvements

* **ABHA ID Integration**: Connect directly with the official ABDM (Ayushman Bharat Digital Mission) registry APIs.
* **Laboratory Integration**: Automate scan delivery directly from lab systems to patient vaults.
* **OCR for Medical Reports**: Implement Optical Character Recognition to automatically parse uploaded clinical printouts.
* **AI-Powered Drug Interaction Alerts**: Provide real-time warnings on potential contraindications during prescription building.
* **Emergency Access Consent**: Enable secure one-time emergency bypass mechanisms with patient audits.
* **Hospital Interoperability**: Support native HL7/FHIR health data standards.
* **Mobile Application**: Release dedicated Android and iOS companion apps.

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
