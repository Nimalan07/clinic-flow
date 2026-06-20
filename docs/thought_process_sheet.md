# ClinicFlow (Queue Cure '26) Thought Process Sheet

This document outlines the architectural decisions, design patterns, concurrency controls, and edge case solutions implemented in **ClinicFlow**.

---

## 1. Core Architecture
ClinicFlow is a real-time full-stack application built using:
- **Frontend**: React (Vite) + Tailwind CSS (responsive layouts, fully optimized for 1920x1080 screens).
- **Backend**: Node.js Express server + Socket.io for state-broadcast orchestration.
- **Database**: Supabase (PostgreSQL) for persistent storage.

---

## 2. Dynamic Wait Time & Average Duration (No Hardcoding)
* **Calculation**: Rather than relying on a hardcoded 10-minute fallback, the average consultation duration is dynamically calculated from actual database records of completed appointments:
  $$\text{Consultation Duration} = \text{End Time} - \text{Start Time}$$
* **Database Updates**: When "Call Next" is clicked, the backend writes the exact `consultation_duration` in minutes to the database.
* **Estimated Wait**: The wait time for a patient is computed as:
  $$\text{Estimated Wait} = \text{Patients Waiting Ahead} \times \text{Average Consultation Time}$$
* **Empty State Handling**: If no data is available (new day, empty database), the system cleanly defaults to `-` instead of displaying arbitrary fallbacks.

---

## 3. Concurrency Control (Race Conditions & Double-Clicks)
* **Double Call Protection**: Clicking "Call Next" triggers a lock variable (`isProcessing = true`) on the Node.js backend. Subsequent rapid clicks are ignored until the current database transaction finishes. This prevents race conditions where one click updates multiple database entries.
* **Transactional integrity**: Database queries are written to execute in sequential, isolated promises.

---

## 4. Edge Cases Resolved

### A. Autoplay Policy Restriction
* **Problem**: Browsers block audio playback unless the user interacts with the page first (autoblocking policies).
* **Solution**: Implemented a global click listener that unlocks the browser audio context on the first user click. Removed annoying "Enable sound" prompt banners, creating a seamless user experience.

### B. Mounting/Navigation State Synchronization
* **Problem**: React Router unmounts components when tabs are switched, resetting local state and causing empty lists.
* **Solution**: Added a `"requestQueue"` socket event triggered on component mounting (`useEffect`). Clients fetch the latest database state immediately upon load or navigation.

### C. Mounting Audio ding Guard
* **Problem**: When a patient screen loads or is refreshed, it receives the queue update payload and triggers a loud notification ding instantly.
* **Solution**: Implemented a React `useRef` mounting guard (`isInitial = useRef(true)`) to suppress audio playback during initial render. The audio ding triggers *only* when a new token is explicitly called.

### D. Server Restart Resiliency
* **Problem**: If the Node server crashed or restarted, in-memory status variables were lost, causing client state desync.
* **Solution**: Synced `currentToken` state dynamically from active database rows (`status === "serving"`) inside `getQueueData()` and `callNext()`, making the backend stateless and crash-resilient.
