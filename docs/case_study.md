# ClinicFlow Case Study

### Smart Clinic Queue Management System
**Hackathon Project Submission**

* **Developed By**: Nimalan Mani M
* **Technology Stack**: React.js, Node.js, Express.js, Socket.IO, Supabase, Tailwind CSS

---

## 1. Executive Summary

ClinicFlow is a real-time clinic queue management platform designed to replace traditional paper-token systems used in neighborhood clinics.

Patients often wait for long periods without knowing their queue status, while receptionists manually manage queues using paper slips and verbal announcements. This leads to confusion, inefficiency, and poor patient experience.

ClinicFlow digitizes the entire process by providing:
* Instant patient registration
* Automatic token generation
* Live queue tracking
* Real-time updates across devices
* Estimated waiting times
* QR-based patient access

The platform enables both receptionists and patients to view queue information without requiring page refreshes.

---

## 2. Problem Statement

A large percentage of small clinics still rely on paper tokens and manual queue management.

Common challenges include:
* Patients do not know their position in the queue.
* Receptionists manually track every patient.
* Doctors have no visibility into queue progress.
* Patients repeatedly ask receptionists for updates.
* Waiting times are unpredictable.
* No centralized queue dashboard exists.

As clinic traffic increases, manual systems become difficult to manage and create a poor patient experience. The challenge was to create a simple and affordable digital queue management system that works in real time.

---

## 3. Proposed Solution

ClinicFlow provides a centralized digital queue system.

### Receptionist Features
* Add patients instantly
* Generate queue tokens automatically
* Call next patient
* Reset queue
* Monitor queue statistics

### Patient Features
* View current serving token
* View queue updates live
* Check position in queue
* Estimate waiting time
* Access queue through QR code

### System Benefits
* Eliminates manual token management
* Reduces patient uncertainty
* Improves operational efficiency
* Provides real-time visibility

---

## 4. System Architecture

ClinicFlow follows a client-server architecture.

### Frontend
* React.js
* Tailwind CSS

### Backend
* Node.js
* Express.js

### Real-Time Communication
* Socket.IO

### Database
* Supabase PostgreSQL

### Architecture Flow
```text
Reception Dashboard --> Socket.IO Events --> Node.js Server --> Supabase Database --> Patient Display --> Live Updates
```
All connected clients receive queue updates instantly whenever a change occurs.

---

## 5. Database Design

### Table: `patients`

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` (PK) | `bigint` | Unique auto-incremented record identifier. |
| `token` | `integer` | Sequence token generated for each patient. |
| `name` | `text` | Name of the patient. |
| `status` | `text` | Current state: `waiting`, `serving`, or `completed`. |
| `joined_at` | `timestamp` | Time when the patient was registered. |
| `start_time` | `timestamp` | Timestamp when the receptionist clicked "Call Next" (consultation started). |
| `end_time` | `timestamp` | Timestamp when the next patient was called (consultation ended). |
| `consultation_duration` | `integer` | Duration in minutes (`end_time` - `start_time`). |

---

## 6. Socket.IO Event Flow

The core functionality of ClinicFlow relies on WebSocket communication.

### Event: `addPatient`
* Receptionist adds patient &rarr; Server generates token &rarr; Database updated &rarr; `queueUpdated` broadcast &rarr; All clients receive update.

### Event: `callNext`
* Receptionist clicks Call Next &rarr; Current patient marked completed &rarr; Next patient marked serving &rarr; Database updated &rarr; `queueUpdated` broadcast &rarr; Patient display updates instantly.

### Event: `resetQueue`
* Receptionist clicks Reset Queue &rarr; All records cleared &rarr; Database reset &rarr; `queueUpdated` broadcast &rarr; All screens refreshed automatically.

---

## 7. User Interface Design

The interface was designed with simplicity and clarity as primary goals.

### Design Principles
* Minimal learning curve
* High visibility of important information
* Large token displays
* Clear action buttons
* Mobile-friendly layouts

### Color Usage
* **Blue**: System controls & routing actions
* **Green**: Active queue status & live sync connected indicators
* **Orange**: Waiting patient counts
* **Purple**: Average consultation duration card
* **Red**: Disconnected badge & queue reset actions

---

## 8. Key Features

* **Real-Time Queue Synchronization**: Changes appear instantly across all connected devices using Socket.IO.
* **Automatic Token Generation**: Each patient receives a unique token.
* **QR-Based Access**: Patients can scan a QR code to access the queue display.
* **Estimated Waiting Time**: Calculated using consultation duration data.
* **Duplicate Prevention**: Prevents duplicate patient entries and double clicks.
* **Persistent Storage**: Queue data is stored in Supabase and remains available across sessions.

---

## 9. Screenshots

1. **Screenshot 1**: Receptionist Queue Control & Registration Panel
   ![Receptionist Queue Control & Registration Panel](../frontend/src/assets/Screenshot%202026-06-21%20114353.png)
2. **Screenshot 2**: Patient Display Monitor & Active Token Highlight
   ![Patient Display Monitor & Active Token Highlight](../frontend/src/assets/Screenshot%202026-06-21%20114557.png)
3. **Screenshot 3**: Patient Live Position & Status Tracker
   ![Patient Live Position & Status Tracker](../frontend/src/assets/Screenshot%202026-06-21%20114717.png)
4. **Screenshot 4**: Real-Time Synchronized Queue Counters
   ![Real-Time Synchronized Queue Counters](../frontend/src/assets/Screenshot%202026-06-21%20114756.png)
5. **Screenshot 5**: System Architecture & Database Configuration Setup
   ![System Architecture & Database Configuration Setup](../frontend/src/assets/Screenshot%202026-06-21%20114809.png)
6. **Screenshot 6**: Clean Responsive Layouts for Mobile Access & QR Check-in
   ![Clean Responsive Layouts for Mobile Access & QR Check-in](../frontend/src/assets/Screenshot%202026-06-21%20114817.png)

---

## 10. Results and Outcomes

ClinicFlow successfully enables real-time queue synchronization between receptionist and patient screens without requiring page refreshes.

Using Socket.IO, patient registrations, token updates, and queue status changes are instantly reflected across all connected devices. The platform provides live queue visibility, estimated waiting times, duplicate patient prevention, database storage persistence, and QR-based patient access.

---

## 11. Future Enhancements

Given additional development time, the platform can be expanded with:
* Doctor dashboard
* Appointment scheduling
* SMS notifications & WhatsApp alerts
* Voice token announcements (Text-to-Speech)
* Multi-language support
* Multi-clinic management
* Role-based authentication
* Analytics dashboard
* AI-powered wait time prediction

---

## 12. Conclusion

ClinicFlow successfully addresses the challenges of manual clinic queue management by introducing a real-time, digital queue system.

By combining React.js, Socket.IO, Node.js, and Supabase, the platform delivers instant synchronization, improved patient transparency, and reduced receptionist workload. The project demonstrates how modern web technologies can solve everyday operational problems in healthcare environments while remaining simple, scalable, and cost-effective.
