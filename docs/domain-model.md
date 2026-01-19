### Domain Model:
- Both `Tutor` and `Student` are specific roles of a `User`.
- A `Tutor` **conducts** a `Booking` and **specializes in** various subjects.
- A `Student` **attends** a `Booking` and is **billed** via an `Invoice`.
- A `Booking` **generates** an `Invoice` and **contains** `SessionDocuments` for learning materials.
- A `Tutor` **speaks** multiple `Languages` and is **categorized by** `Tags`.
- A `Tutor` is **based in** a `Country`.
- An `Invoice` is **billed to** a `Student` and represents a **payout to** a `Tutor`.

```mermaid
classDiagram
    class User {
        +string name
        +string email
        +string role
    }

    class Tutor {
        +string bio
        +float hourly_rate
        +teaches()
        +managesBookings()
    }

    class Student {
        +learns()
        +requestsBookings()
    }

    class Booking {
        +datetime start
        +datetime end
        +string status
        +string name
        +isJoinable() bool
    }

    class Invoice {
        +float amount
        +string status
        +processPayment()
    }

    class SessionDocument {
        +string filename
        +string path
        +mime_type
    }

    class Country {
        +string name
        +string code
    }

    class Language {
        +string name
    }

    class Speciality {
        +string name
    }

    class Tag {
        +string name
    }

    %% Inheritance
    User <|-- Tutor : acts as
    User <|-- Student : acts as

    %% Domain Relationships
    Tutor "1" --> "*" Booking : conducts
    Student "1" --> "*" Booking : attends
    Booking "1" --> "0..1" Invoice : generates
    Booking "1" --> "*" SessionDocument : contains
    
    Tutor "*" -- "*" Language : speaks
    Tutor "*" -- "*" Speciality : specializes in
    Tutor "*" -- "*" Tag : categorized by
    Tutor "*" -- "1" Country : based in

    Invoice "*" -- "1" Student : billed to
    Invoice "*" -- "1" Tutor : payout to
```

