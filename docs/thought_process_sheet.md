# ClinicFlow (Queue Cure '26) Thought Process Sheet

This document outlines the architectural decisions, design patterns, concurrency controls, and edge case solutions implemented in **ClinicFlow**.

---

## 1. Core Architecture & Design Decisions

ClinicFlow is built as a real-time full-stack application using:
- **Frontend**: React (Vite) + Tailwind CSS (responsive layouts, fully optimized for 1920x1080 screens).
- **Backend**: Node.js Express server + Socket.io for state-broadcast orchestration.
- **Database**: Supabase (PostgreSQL) for persistent storage.

### Architectural Trade-offs Considered:
* **WebSockets (Socket.IO) vs. HTTP Polling**: 
  * *Decision*: Selected WebSockets.
  * *Reasoning*: Polling introduces delays (usually 5–10 seconds) or creates unnecessary server/database load. Socket.IO offers instant, sub-second broadcast updates when the receptionist takes an action.
* **Stateless Backend vs. Memory Storage**: 
  * *Decision*: Stateless backend (always syncing from database).
  * *Reasoning*: Keeping active token details in Node memory works until the server restarts or scales horizontally. Under our design, if the Node process restarts, the server queries the database immediately to restore the active state, maintaining high availability.

---

## 2. Supabase Schema Design Decisions

The database design was structured intentionally to enable clean analytics and audits:
* **Tracking `start_time` and `end_time`**: Rather than just tracking a single "completed" timestamp, storing both start and end timestamps allows clinic administrators to calculate consultation speed and identify peak efficiency hours.
* **Enumerated `status` strings**: Using `'waiting'`, `'serving'`, and `'completed'` instead of boolean flags (`isWaiting`, `isServing`) makes the system extensible for future states (like `'paused'`, `'cancelled'`, or `'referred'`).

---

## 3. Dynamic Wait Time & Average Duration (No Hardcoding)
* **Calculation**: Rather than relying on a hardcoded 10-minute fallback, the average consultation duration is dynamically calculated from actual database records of completed appointments:
  $$\text{Consultation Duration} = \text{End Time} - \text{Start Time}$$
* **Database Updates**: When "Call Next" is clicked, the backend writes the exact `consultation_duration` in minutes to the database.
* **Estimated Wait**: The wait time for a patient is computed as:
  $$\text{Estimated Wait} = \text{Patients Waiting Ahead} \times \text{Average Consultation Time}$$
* **Empty State Handling**: If no data is available (new day, empty database), the system cleanly defaults to `-` instead of displaying arbitrary fallbacks.

---

## 4. Concurrency Control (Race Conditions & Double-Clicks)
* **Double Call Protection**: Clicking "Call Next" triggers a lock variable (`isProcessing = true`) on the Node.js backend. Subsequent rapid clicks are ignored until the current database transaction finishes. This prevents race conditions where one click updates multiple database entries.
* **Transactional integrity**: Database queries are written to execute in sequential, isolated promises.

---

## 5. Edge Cases Resolved

### A. Autoplay Policy Restriction
* **Problem**: Browsers block audio playback unless the user interacts with the page first (autoblocking policies).
* **Solution**: Implemented a global click listener that unlocks the browser audio context on the first user click. Removed annoying "Enable sound" prompt banners, creating a seamless user experience.

### B. Mounting/Navigation State Synchronization
* **Problem**: React Router unmounts components when tabs are switched, resetting local state and causing empty lists.
* **Solution**: Added a `"requestQueue"` socket event triggered on component mounting (`useEffect`). Clients fetch the latest database state immediately upon load or navigation.

### C. Mounting Audio ding Guard
* **Problem**: When a patient screen loads or is refreshed, it receives the queue update payload and triggers a loud notification ding instantly.
* **Solution**: Implemented a React `useRef` mounting guard (`isInitial = useRef(true)`) to suppress audio playback during initial render. The audio ding triggers *only* when a new token is called.

### D. Server Restart Resiliency
* **Problem**: If the Node server crashed or restarted, in-memory status variables were lost, causing client state desync.
* **Solution**: Synced `currentToken` state dynamically from active database rows (`status === "serving"`) inside `getQueueData()` and `callNext()`, making the backend stateless and crash-resilient.

---

## 6. Input Security & Validation
* **Trimmed Inputs**: Whitespace sanitization on patient names prevents registration of blank tokens.
* **Token Formatting**: Number parsing on the client side prevents string mismatch bugs during patient position queries.
