# ClinicFlow Socket Event Diagram

This document illustrates the real-time communication architecture between the clients (Receptionist dashboard, Patient monitor display) and the Node.js WebSocket server.

```mermaid
sequenceDiagram
    autonumber
    actor Receptionist
    actor Patient
    participant Client as Frontend (Vite)
    participant Server as Socket Server (Node)
    participant DB as Database (Supabase)

    %% Initial Sync on Mount
    Note over Client, Server: Mounting / Tab Navigation
    Client->>Server: Emit "requestQueue"
    Server->>DB: Query current queue & average duration
    DB-->>Server: Return active patients & stats
    Server-->>Client: Emit "queueUpdated" (payload with queue state)

    %% Add Patient Flow
    Note over Receptionist, DB: Registering a New Patient
    Receptionist->>Client: Type name & press Enter
    Client->>Server: Emit "addPatient" (patientName)
    Server->>DB: Insert patient (status: "waiting", token: nextToken)
    DB-->>Server: Confirm write
    Server->>DB: Query updated queue data
    DB-->>Server: Return queue list
    Server->>Client: Broadcast "queueUpdated" to ALL connected clients
    Client-->>Patient: Render updated queue list instantly

    %% Call Next Flow
    Note over Receptionist, DB: Calling the Next Patient
    Receptionist->>Client: Click "Call Next" (isProcessing = true)
    Client->>Server: Emit "callNext"
    Server->>DB: Update serving patient to "completed" & record duration
    Server->>DB: Update oldest waiting patient to "serving"
    DB-->>Server: Confirm updates
    Server->>DB: Query updated queue data
    DB-->>Server: Return queue list
    Server->>Client: Broadcast "queueUpdated" to ALL connected clients
    Note over Client: PatientView detects new serving token & triggers alarm ding
    Client-->>Patient: Play audio ding once + blink current token display
```

## Description of Events

1. **`requestQueue` (Client -> Server)**:
   - **When**: Triggered immediately when a client page mounts (either Receptionist dashboard or Patient view) or when the user navigates between views using React Router.
   - **Why**: Synchronizes local component state immediately with the active database, preventing blank lists on mount.

2. **`queueUpdated` (Server -> Client Broadcast)**:
   - **When**: Sent whenever the queue state undergoes a change (new patient registered, next patient called, or queue reset) or upon `requestQueue`.
   - **Payload**:
     ```json
     {
       "queue": [
         { "id": 1, "token": 1, "name": "Ravi", "status": "serving", "joined_at": "..." },
         { "id": 2, "token": 2, "name": "Kamal", "status": "waiting", "joined_at": "..." }
       ],
       "currentToken": 1,
       "averageConsultationTime": 5
     }
     ```

3. **`addPatient` (Client -> Server)**:
   - **When**: Receptionist enters a name and clicks "Register" or presses Enter.
   - **Effect**: Triggers database write for a new patient entry, followed by a broadcasted `queueUpdated` event.

4. **`callNext` (Client -> Server)**:
   - **When**: Receptionist clicks the "Call Next" button.
   - **Effect**: Completes the active patient, calculates and records their exact consultation duration, transitions the next patient to "serving", and triggers a broadcasted `queueUpdated` event.
