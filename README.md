# ClinicFlow

**ClinicFlow** is a real-time, responsive Full-Stack Clinic Queue Management System built for the **Queue Cure '26** Hackathon. It replaces traditional paper token systems and verbal calling with an automated, live-synchronized dashboard.

---

## 🚀 Key Features

### 1. Receptionist Dashboard (`/`)
* **Patient Registration**: Add patients easily; names are registered and unique tokens are generated.
* **Smart Calling Controls**: One-click "Call Next" action to mark the active patient as completed and call the next patient in line.
* **Concurrency Lock**: Prevents accidental double-clicks or duplicate database mutations.
* **Queue Overview Table**: Clear display showing the status (waiting, serving, completed) of all registered patients.
* **Reset Controls**: Easily clear the queue to start a fresh session.

### 2. Patient Waiting Room Display (`/patient`)
* **Now Serving**: Highlighted banner calling the current patient token with animation.
* **Real-time Stats Grid**:
  * Active Token being seen.
  * Count of patients waiting in the queue.
  * Dynamic **Estimated Wait Time** computed from actual completed consultations.
* **Audio Alerts**: Playback dings immediately notify the waiting room when a receptionist calls the next patient.
* **Tab-Switch Resilience**: Emits instant sync requests upon mounting, preventing empty states when navigating.
* **Token Position Lookup**: Waiting patients can type in their token number to view their position in line and their estimated wait time.

---

## 🛠️ Tech Stack

* **Frontend**: React (Vite), React Router, Tailwind CSS, Socket.io-client.
* **Backend**: Node.js, Express, Socket.io, CommonJS.
* **Database**: Supabase (PostgreSQL client).

---

## 📦 Local Setup Instructions

### Prerequisites
* Node.js (v16+)
* A Supabase project with a `patients` table.

### 1. Clone & Install Dependencies
Clone the repository, then install packages for both the server and client:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

### 3. Run Locally
To run the server and client concurrently:

```bash
# In the backend directory
npm start

# In the frontend directory (new terminal tab)
npm run dev
```

---

## 📄 Submission Documentation
For more in-depth architectural and design details, check out:
* [Socket Event Flow Diagram](docs/socket_event_diagram.md) - Explains real-time events.
* [Thought Process & Edge Cases Sheet](docs/thought_process_sheet.md) - Details concurrency controls, dynamic computations, and solutions to autoplay block rules.
