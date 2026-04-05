# 📊 UML Diagrams — MediCore HMS

---

## 1. Use Case Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Hospital Management System                    │
│                                                                  │
│  ┌──────────┐    ┌──────────────────────────────────────────┐   │
│  │          │───▶│ Register Patient                         │   │
│  │          │───▶│ View Patients                            │   │
│  │Receptionist───▶│ Allocate Bed                            │   │
│  │          │───▶│ Schedule Appointment                     │   │
│  │          │───▶│ Add to Emergency Queue                   │   │
│  └──────────┘    └──────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────┐    ┌──────────────────────────────────────────┐   │
│  │          │───▶│ View Patients                            │   │
│  │  Doctor  │───▶│ Update Patient Status                    │   │
│  │          │───▶│ Complete Appointment                     │   │
│  │          │───▶│ Process Emergency Queue                  │   │
│  │          │───▶│ Toggle Availability                      │   │
│  └──────────┘    └──────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────┐    ┌──────────────────────────────────────────┐   │
│  │          │───▶│ All Receptionist + Doctor actions        │   │
│  │  Admin   │───▶│ Register Users                           │   │
│  │          │───▶│ Manage Beds (CRUD)                       │   │
│  │          │───▶│ View Audit Logs                          │   │
│  │          │───▶│ Delete Patients                          │   │
│  └──────────┘    └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Class Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                       DESIGN PATTERNS                           │
└─────────────────────────────────────────────────────────────────┘

── STATE PATTERN ──────────────────────────────────────────────────

  ┌─────────────────────────┐
  │    <<abstract>>         │
  │      PatientState       │
  ├─────────────────────────┤
  │ + toWaiting(ctx)        │
  │ + toAdmitted(ctx)       │
  │ + toUnderTreatment(ctx) │
  │ + toDischarge(ctx)      │
  │ # invalidTransition()   │
  └─────────────────────────┘
           ▲
    ┌──────┼──────────────────────────────────────────┐
    │      │                                          │
┌───┴──────┴──┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Registered  │  │   Waiting    │  │   Admitted   │  │UnderTreatment│
│    State    │  │    State     │  │    State     │  │    State     │
├─────────────┤  ├──────────────┤  ├──────────────┤  ├──────────────┤
│+toWaiting() │  │+toAdmitted() │  │+toUnder...() │  │+toDischarge()│
│+toAdmitted()│  │              │  │+toDischarge()│  │              │
└─────────────┘  └──────────────┘  └──────────────┘  └──────────────┘

  ┌─────────────────────────┐
  │    PatientContext       │◀── holds reference to current state
  ├─────────────────────────┤
  │ - #currentState         │
  │ - #patient              │
  ├─────────────────────────┤
  │ + transition(newStatus) │
  │ + getStatus()           │
  └─────────────────────────┘

── STRATEGY PATTERN ───────────────────────────────────────────────

  ┌─────────────────────────┐
  │    <<abstract>>         │
  │  BedAllocationStrategy  │
  ├─────────────────────────┤
  │ + allocate(patient,beds)│
  └─────────────────────────┘
           ▲
    ┌──────┴──────────────────┐
    │                         │
┌───┴──────────────┐  ┌───────┴──────────────┐
│ICUAllocation     │  │GeneralAllocation     │
│Strategy          │  │Strategy              │
├──────────────────┤  ├──────────────────────┤
│+allocate()       │  │+allocate()           │
│ → ICU first      │  │ → General only       │
│ → General fallbk │  │ → no ICU             │
└──────────────────┘  └──────────────────────┘

  ┌─────────────────────────┐
  │      BedAllocator       │◀── context
  ├─────────────────────────┤
  │ - #strategy             │
  ├─────────────────────────┤
  │ + setStrategy(patient)  │
  │ + allocate(patient,beds)│
  └─────────────────────────┘

── REPOSITORY PATTERN ─────────────────────────────────────────────

  ┌─────────────────────────┐
  │    <<abstract>>         │
  │     BaseRepository      │
  ├─────────────────────────┤
  │ # table                 │
  ├─────────────────────────┤
  │ + findById(id)          │
  │ + findAll()             │
  │ + create(data)          │
  │ + update(id, data)      │
  │ + delete(id)            │
  │ # _getDb()              │
  └─────────────────────────┘
           ▲
    ┌──────┼──────────────────────────────────────────┐
    │      │                                          │
┌───┴──┐ ┌─┴──────┐ ┌──────────┐ ┌────────┐ ┌───────┴──────┐
│User  │ │Patient │ │   Bed    │ │Doctor  │ │Appointment   │
│Repo  │ │Repo    │ │   Repo   │ │Repo    │ │Repo          │
└──────┘ └────────┘ └──────────┘ └────────┘ └──────────────┘

── SINGLETON PATTERN ──────────────────────────────────────────────

  ┌─────────────────────────┐
  │       Database          │
  ├─────────────────────────┤
  │ - static #instance      │
  │ - #pool                 │
  │ - #db                   │
  ├─────────────────────────┤
  │ + static getInstance()  │
  │ + connect()             │
  │ + disconnect()          │
  │ + getDb()               │
  └─────────────────────────┘
```

---

## 3. Sequence Diagram — Patient Registration & Bed Allocation

```
Client          Controller      PatientService   BedAllocationService   DB
  │                 │                │                   │               │
  │─POST /patients─▶│                │                   │               │
  │                 │─registerPatient▶│                   │               │
  │                 │                │─create patient────────────────────▶│
  │                 │                │◀─patient created──────────────────│
  │                 │                │─log audit─────────────────────────▶│
  │                 │◀─patient data──│                   │               │
  │◀─201 Created────│                │                   │               │
  │                 │                │                   │               │
  │─POST /beds/allocate─────────────────────────────────▶│               │
  │                 │                │                   │─findPatient───▶│
  │                 │                │                   │◀─patient data─│
  │                 │                │                   │─findAvailable─▶│
  │                 │                │                   │◀─beds list────│
  │                 │                │                   │               │
  │                 │                │              [Strategy Pattern]   │
  │                 │                │                   │               │
  │                 │                │         severity≥7? ICUStrategy   │
  │                 │                │         severity<7? GeneralStrategy│
  │                 │                │                   │               │
  │                 │                │                   │─assignBed─────▶│
  │                 │                │                   │─markOccupied──▶│
  │                 │                │                   │─log audit─────▶│
  │◀─200 Bed Allocated──────────────────────────────────│               │
```

---

## 4. Sequence Diagram — Emergency Queue Processing

```
Client       EmergencyController   EmergencyQueueService   BedAllocationService
  │                 │                      │                       │
  │─POST /emergency/enqueue───────────────▶│                       │
  │                 │                      │─validate patient       │
  │                 │                      │─persist to DB          │
  │                 │                      │─enqueue (max-heap)     │
  │                 │                      │─update patient→waiting │
  │◀─201 Queued─────│                      │                       │
  │                 │                      │                       │
  │─POST /emergency/process───────────────▶│                       │
  │                 │                      │─dequeue() O(log n)     │
  │                 │                      │─markProcessed in DB    │
  │                 │                      │─allocateBed()─────────▶│
  │                 │                      │                       │─Strategy Pattern
  │                 │                      │◀─allocation result────│
  │◀─200 Processed──│                      │                       │
```

---

## 5. Sequence Diagram — Appointment Scheduling (Conflict Detection)

```
Client       AppointmentController   AppointmentService   DoctorRepo   AppointmentRepo
  │                 │                       │                 │               │
  │─POST /appointments────────────────────▶│                 │               │
  │                 │                       │─findDoctor──────▶│               │
  │                 │                       │◀─doctor data────│               │
  │                 │                       │                 │               │
  │                 │                       │─validateShiftHours()            │
  │                 │                       │  (private method)               │
  │                 │                       │                 │               │
  │                 │                       │─hasConflict()───────────────────▶│
  │                 │                       │  (overlap SQL query)            │
  │                 │                       │◀─conflict: false────────────────│
  │                 │                       │                 │               │
  │                 │                       │─create appointment──────────────▶│
  │                 │                       │─log audit                       │
  │◀─201 Scheduled──│                       │                 │               │
  │                 │                       │                 │               │
  │─POST /appointments (conflict)─────────▶│                 │               │
  │                 │                       │─hasConflict()───────────────────▶│
  │                 │                       │◀─conflict: true─────────────────│
  │◀─409 Conflict───│                       │                 │               │
```

---

## 6. ER Diagram

```
┌──────────────────┐         ┌──────────────────┐
│      users       │         │     doctors      │
├──────────────────┤         ├──────────────────┤
│ id (PK, UUID)    │◀────────│ id (PK, UUID)    │
│ email (UNIQUE)   │  1    1 │ userId (FK)      │
│ passwordHash     │         │ specialization   │
│ role (enum)      │         │ department       │
│ firstName        │         │ licenseNumber    │
│ lastName         │         │ shiftStart       │
│ isActive         │         │ shiftEnd         │
│ createdAt        │         │ consultationFee  │
└──────────────────┘         │ isAvailable      │
                             └──────────────────┘
                                      │ 1
                                      │
                                      │ M
                             ┌──────────────────┐
                             │  appointments    │
                             ├──────────────────┤
┌──────────────────┐         │ id (PK, UUID)    │
│     patients     │         │ patientId (FK)   │
├──────────────────┤         │ doctorId (FK)    │
│ id (PK, UUID)    │◀────────│ scheduledAt      │
│ name             │  1    M │ endsAt           │
│ age              │         │ durationMinutes  │
│ gender (enum)    │         │ reason           │
│ phone            │         │ status (enum)    │
│ email            │         │ notes            │
│ bloodType        │         └──────────────────┘
│ severity (1-10)  │
│ status (enum)    │         ┌──────────────────┐
│ bedId (FK)       │         │  emergencyQueue  │
│ doctorId (FK)    │         ├──────────────────┤
│ registeredAt     │◀────────│ id (PK, UUID)    │
│ admittedAt       │  1    M │ patientId (FK)   │
│ dischargedAt     │         │ severity (1-10)  │
└──────────────────┘         │ reason           │
         │ 1                 │ symptoms         │
         │                   │ status (enum)    │
         │ 1                 │ queuedAt         │
┌──────────────────┐         │ processedAt      │
│      beds        │         └──────────────────┘
├──────────────────┤
│ id (PK, UUID)    │         ┌──────────────────┐
│ bedNumber (UNIQ) │         │   auditLogs      │
│ type (ICU/Gen)   │         ├──────────────────┤
│ ward             │         │ id (PK, UUID)    │
│ floor            │         │ action           │
│ isOccupied       │         │ entityType       │
│ isUnderMaint.    │         │ entityId         │
└──────────────────┘         │ performedBy (FK) │
                             │ oldValue (JSONB) │
                             │ newValue (JSONB) │
                             │ ipAddress        │
                             │ createdAt        │
                             └──────────────────┘
```

---

## 7. Component Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         React Frontend                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │Dashboard │  │Patients  │  │   Beds   │  │  Emergency   │   │
│  │  Page    │  │  Page    │  │  Page    │  │    Queue     │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
│                    ↕ Axios HTTP Client                          │
└─────────────────────────────────────────────────────────────────┘
                           ↕ REST API
┌─────────────────────────────────────────────────────────────────┐
│                       Express Backend                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Routes → Controllers → Services → Repositories → DB    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │State Pattern │  │Strategy Pat. │  │  Priority Queue      │  │
│  │(Patient FSM) │  │(Bed Alloc.)  │  │  (Emergency Queue)   │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                           ↕ Drizzle ORM
┌─────────────────────────────────────────────────────────────────┐
│                        PostgreSQL                               │
│  users │ doctors │ patients │ beds │ appointments │ auditLogs  │
└─────────────────────────────────────────────────────────────────┘
```
