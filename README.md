# Sukoon – Elderly Wellness & Support App  

## Course  
**CS 435 — Human Computer Interaction**

## Group Members  
- Member 1  
- Member 2  
- Member 3  
- Member 4  

---

## 📌 Project Overview

**Sukoon** is a mobile + backend system designed to support elderly individuals in their daily lives.  
The app focuses on:

- Gentle reminders for medicines and daily tasks  
- Simple mind games for cognitive stimulation  
- Light movement / exercise routines  
- Community connection through local events  
- Easy access to medical records  
- A one-tap **SOS** emergency call feature  

The project was developed as a **high-fidelity prototype** for CS 435, applying HCI concepts such as user-centred design, accessibility, and usability evaluation.

---

## 📱 Core Features

### 1. Onboarding & Profile
- Simple, step-by-step onboarding flow  
- Collects basic details: name, age, gender, mobile number, emergency contact  
- Designed with **large text**, **clear contrast**, and minimal choices  
- Profile screen shows key information and allows editing later  

---

### 2. Home Screen

The Home screen acts as a dashboard and entry point to all features.  
Cards on the Home screen include:

- **Sukoon Connect** – Community events and peer connection  
- **Sukoon Reminders** – Quick access to calendar and to-dos  
- **Mind Games** – Memory-based shopping list game  
- **Move with Sukoon** – Exercise / movement routines via short videos  
- **Not Feeling Well?** – Triage style flow asking for symptoms and severity, then suggesting self-care or doctor consultation options  

The Home screen is always reachable from the **bottom tab** navigation.

---

### 3. Sukoon Connect
- Allows creating and viewing **community events** (e.g., satsang, walks, bhajan, yoga group)  
- Event fields: title, date, time, location, contact number  
- Helps reduce **social isolation** by promoting group activities nearby  

---

### 4. Sukoon Reminders
- Calendar view with month navigation  
- “Things to do today” section to add simple to-dos  
- Reminders for:
  - Medicines  
  - Doctor visits  
  - Personal tasks  
- Stores tasks with created/completed timestamps for later analytics  
- Supports **English and Hindi** labels (Devanagari digits for Hindi view)  

---

### 5. Mind Games (Shopping Match Game)
- The app shows a small shopping list to remember  
- User then selects items from a mixed list of correct items + distractors  
- Feedback on how many items were correctly recalled  
- Each game session is logged (date + score) to feed into **My Progress**  

---

### 6. Move with Sukoon
- Curated list of gentle movement / exercise routines  
- Selecting a routine opens an info page with a button to play the video on YouTube  
- Every time a user opens a routine, the session is logged for that day  
- Helps encourage light daily movement and routine building  

---

### 7. Medical Records
- Simple interface to add **medical notes**:
  - Title
  - Date
  - Free-text notes
  - Optional attached file (e.g., PDF report, prescription image)  
- Records are displayed in a list with:
  - Open file option (where supported)
  - Delete option  

---

### 8. My Progress
- Monthly summary of:
  - To-dos created vs completed  
  - Days mind games were played + best score per day  
  - Number of exercise sessions per day  
- Visualised using line/bar charts  
- Auto-generated feedback text:
  - Encouraging when activity is high  
  - Gentle nudge if month is quiet  
- A **Doctor / Family Note** section to record monthly comments, saved per month  

---

### 9. SOS Emergency Screen
- A dedicated full-screen **SOS page**  
- Large, round **“Call for Help”** button at the centre  
- Uses saved emergency contact from the profile  
- Opens the phone dialer with the emergency number pre-filled  
- Designed to be very simple and visible, especially in stressful situations  

---

### 10. Navigation & Layout

- **Bottom Tab Navigation**
  - **Home** – main dashboard and entry to all features  
  - **Reminders** – calendar + to-dos  
  - **Help** – instructions, about, guidance  
  - **Profile** – user details, language, My Progress, Medical Records, SOS  

- **Top Bar (TopBar component)**
  - Persistent across most screens  
  - Left: optional back button  
  - Right: close/back icon  
  - Separate dedicated **SOS** screen accessible from Profile & other places  

This consistent structure ensures elderly users always know *where* they are and *how* to go back.

---

## 🧰 Tech Stack

### Frontend (sukoon-app)
- **React Native** with **Expo**
- **React Navigation** (stack + bottom tabs)
- **Context API** for:
  - Authentication state
  - Language selection (English / Hindi)
- **AsyncStorage** for local persistence:
  - Reminders and to-dos
  - Game sessions
  - Exercise sessions
  - Medical records
  - Monthly notes
  - Basic user info (on the device)

### Backend (sukoon-backend)
- **Node.js** + **Express**
- **MongoDB** (local or cloud, e.g., MongoDB Atlas)
- Typical structure:
  - `src/config` – DB and app configuration  
  - `src/models` – Mongoose models (e.g., User, Event, Record)  
  - `src/controllers` – request handlers  
  - `src/routes` – API route definitions  
  - `src/middleware` – auth / validation / logging middleware  
  - `uploads/` – folder for uploaded files (e.g., reports)  

> Note: For the high-fidelity prototype, the frontend can run fully with local storage.  
> The backend enables real persistence, multi-user data, and file uploads in a production-like setup.

---

## 📁 Project Structure

At the root of the repository:

```bash
SUKOON-PROJECT/
├── favicon_io/              # App icon / branding assets (optional)
├── sukoon-app/              # React Native + Expo mobile app
│   ├── .expo/
│   ├── assets/
│   ├── node_modules/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── navigation/
│   │   ├── screens/
│   │   ├── theme/
│   │   └── utils/
│   ├── App.js
│   ├── app.json
│   ├── package.json
│   └── babel.config.js
├── sukoon-backend/          # Node.js + Express backend
│   ├── node_modules/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   ├── uploads/
│   ├── server.js            # Entry point
│   ├── package.json
│   └── .env                 # Environment variables (not committed)
└── README.md
```

### Prerequisites

- Node.js (LTS, e.g., 18+) and npm or yarn
- Expo CLI (optional, can use npx expo inline)
- Android Emulator or physical Android device with Expo Go
- (Optional) MongoDB running locally or MongoDB Atlas connection string

Setup & Run Instructions
1. Clone the Repository
git clone https://github.com/<your-username>/<repository-name>.git
cd <repository-name>   # e.g., cd SUKOON-PROJECT  

2. Backend Setup (sukoon-backend)
cd sukoon-backend
npm install  


Create a .env file inside sukoon-backend/:

PORT=5000
MONGODB_URI=mongodb://localhost:27017/sukoon
# Any other secrets like:
# JWT_SECRET=some_super_secret_key
# CLIENT_ORIGIN=http://localhost:19006  


Start the backend server:

npm start
# or, if a dev script exists:
npm run dev  


The backend will typically run at: http://localhost:5000
(Adjust according to your actual server.js and package.json scripts.)

3. Frontend Setup (sukoon-app)

In a new terminal:

cd sukoon-app
npm install  


If the app uses an API base URL for the backend, set it in a config file or .env (for example: API_BASE_URL=http://localhost:5000).

Start the Expo app:

npx expo start
# or
npm start  


Then you can:

Press a to open the Android emulator, or

Scan the QR code in Expo Go on your physical device, or

Press w to open it in the web browser (for basic testing).

🌐 Making the Repository Public on GitHub

On GitHub, create a new public repository (for example: sukoon-hci-app).

On your local machine (inside SUKOON-PROJECT/):

git init
git add .
git commit -m "Initial commit: Sukoon HCI project"
git branch -M main
git remote add origin https://github.com/<your-username>/<repository-name>.git
git push -u origin main  


Confirm that the repo is public and contains:

sukoon-app folder (frontend code)

sukoon-backend folder (backend code)

README.md

(Later) demo video link and report PDF if required

🙌 Acknowledgement

This project was created as part of CS 435 — Human Computer Interaction, applying concepts of:

User research and personas

Low-fidelity to high-fidelity prototyping

Accessibility and elderly-friendly design

Usability-focused evaluation

Sukoon aims to bring a little more calm, structure, and support into the everyday lives of elderly users.
