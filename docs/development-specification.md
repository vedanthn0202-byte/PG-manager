# PG Connect

## Complete Website Development Specification and Implementation Blueprint

**Document version:** 1.0\
**Product:** PG Connect --- PG Management & Rental Automation SaaS\
**Initial market:** Individual Paying Guest (PG) owners in Bengaluru,
Karnataka, India\
**Platform:** Responsive web application\
**Document purpose:** Product requirements, technical architecture,
database design, development roadmap, testing strategy, deployment plan
and implementation guidance.

------------------------------------------------------------------------

# 1. Executive Summary

PG Connect is a multi-tenant Software-as-a-Service (SaaS) web
application that helps individual PG owners manage their accommodation
businesses from one centralized platform.

The platform will manage:

-   One or more PG properties under an owner account.
-   Buildings, floors, rooms and individual beds.
-   Room types, sharing capacity, facilities and rental prices.
-   Tenant profiles, check-in, room allocation, transfers and checkout.
-   Monthly rent invoices, outstanding balances and payment history.
-   Online payments through a payment gateway.
-   Owner-recorded offline payments such as cash or direct UPI
    transfers.
-   Security deposits and settlements.
-   Property operating expenses.
-   Tenant self-service portal.
-   Owner dashboard, occupancy information and financial reports.

The product should be straightforward for a non-technical PG owner to
use while following sound software engineering practices.

## 1.1 Product vision

Digitize the day-to-day operations of PG accommodation businesses and
reduce dependence on notebooks, spreadsheets, WhatsApp messages and
disconnected payment records.

## 1.2 Product positioning

**PG Connect --- A Smart PG Management & Rental Automation Platform.**

The initial product is an operational management system, not a public PG
discovery marketplace. Public tenant search, booking and listing
functionality can be considered separately in a future version.

## 1.3 Target users

-   Individual PG owners operating one or more properties.
-   Staff or managers appointed by an owner.
-   Tenants living in registered PG properties.
-   Internal PG Connect platform administrators.

## 1.4 Product principles

1.  Correct room and bed occupancy is more important than visual
    complexity.
2.  Financial records must be traceable and auditable.
3.  A tenant must only access their own information.
4.  An owner must only access their own business data.
5.  Payment success must be confirmed by the backend, not trusted from
    the browser.
6.  The application must work on desktop and mobile browsers.
7.  Start with a modular monolith rather than premature microservices.
8.  Build and verify one module at a time.

------------------------------------------------------------------------

# 2. Goals, Non-Goals and Success Measures

## 2.1 Primary goals

1.  Centralize property and room information.
2.  Track each bed's availability and occupancy.
3.  Maintain complete tenant lifecycle records.
4.  Generate and track monthly rent invoices.
5.  Enable secure digital rent collection.
6.  Record offline payments accurately.
7.  Track security deposits and refunds.
8.  Give tenants access to their own rental information.
9.  Track expenses and provide basic business reporting.
10. Support multiple PG properties under one owner.

## 2.2 Initial non-goals

The first release will not attempt to provide:

-   A public PG search and discovery marketplace.
-   A public tenant-to-owner booking marketplace.
-   Native Android or iOS applications.
-   Automated bank account aggregation.
-   Full accounting, GST filing or statutory tax software.
-   Biometric identity verification.
-   AI forecasting or an AI chatbot.
-   Microservices architecture.
-   Automatic access-control hardware integration.

These may be considered after the core product has been validated with
real PG owners.

## 2.3 Proposed pilot success measures

These are targets to validate during testing and pilot use, not existing
achievements.

  Metric                                                      Proposed target
  --------------------------------- -----------------------------------------
  Duplicate active bed allocation                                           0
  Room occupancy accuracy                                                100%
  Verified payment reconciliation                                        100%
  Monthly invoice generation                                        Automated
  Common dashboard response           Under 2 seconds under normal pilot load
  Application availability                                       99.5% target
  Database backup                                                   Automated
  Backup restoration                                      Successfully tested
  Unauthorized cross-owner access                                           0

------------------------------------------------------------------------

# 3. Product Scope and Release Plan

## 3.1 Version 1 --- MVP

The first usable release includes:

-   Owner registration, login and password recovery.
-   Owner profile.
-   Multiple property registration.
-   Room and bed management.
-   Tenant registration and profiles.
-   Tenant-to-bed allocation.
-   Check-in, transfer and checkout.
-   Monthly rent invoices.
-   Additional invoice charges.
-   Partial payment and outstanding balance tracking.
-   Online payment gateway integration.
-   Owner-recorded offline payment.
-   Payment verification and webhook handling.
-   Downloadable receipts.
-   Security deposit records.
-   Basic expense tracking.
-   Owner dashboard.
-   Tenant portal.
-   Role-based permissions.
-   Audit logs for important actions.
-   Responsive UI.
-   Automated tests.
-   Docker-based local development.

## 3.2 Version 2 --- Operational enhancements

-   Staff invitations and detailed permission management.
-   Maintenance request workflow.
-   Email and SMS notifications.
-   WhatsApp notifications where approved integrations are available.
-   Advanced financial reports.
-   Rental agreement document management.
-   Advanced occupancy analytics.
-   Automated reminders.
-   Property-level operational reports.

## 3.3 Version 3 --- Advanced product features

-   AI assistant for owner questions.
-   Revenue forecasting.
-   Occupancy prediction.
-   Expense anomaly detection.
-   SaaS subscription billing for PG owners.
-   Advanced business benchmarking.
-   Integrations with additional accounting and communication systems.

**Scope rule:** Do not delay the MVP by implementing Version 2 or
Version 3 features prematurely.

------------------------------------------------------------------------

# 4. User Roles and Permissions

The system uses role-based access control (RBAC), with property-level
scoping where applicable.

## 4.1 PG Owner

The owner is the primary customer and administrator of their PG
business.

Permissions:

-   Create and manage their properties.
-   Create rooms and beds.
-   Register and manage tenants.
-   Allocate and transfer tenants.
-   Process tenant check-in and checkout.
-   Set rental rates and billing rules.
-   Generate and review invoices.
-   Monitor online and offline payments.
-   Manage deposits and settlements.
-   Record property expenses.
-   View financial and occupancy reports.
-   Invite staff and assign permissions.
-   View audit history.

## 4.2 Manager / Staff

Staff access is granted by an owner and can be scoped to one or more
properties.

Possible permissions:

-   View assigned properties.
-   Register tenants.
-   View room and bed availability.
-   Assist with check-in and checkout.
-   Allocate beds if specifically authorized.
-   View limited payment status.
-   Create and update maintenance requests.
-   View operational information.

Staff must not automatically receive access to sensitive financial
reports, owner settings or all properties.

## 4.3 Tenant

Tenants have access only to their own profile and rental records.

Permissions:

-   View personal profile.
-   View current property, room and bed.
-   View current and historical invoices.
-   Make online payments.
-   Download receipts.
-   View payment history.
-   View security deposit information.
-   Submit maintenance requests.
-   Update permitted contact information.

A tenant must never gain access to another tenant's records by changing
an ID in a URL or API request.

## 4.4 Platform Administrator

An internal role for operating PG Connect itself.

Permissions:

-   Manage platform accounts and account status.
-   Monitor application health.
-   Investigate support requests.
-   Manage platform configuration.
-   Monitor integration health.

Platform administrators should not casually access tenant financial or
identity information. Exceptional access must be limited and audited.

## 4.5 Permission matrix

  ---------------------------------------------------------------------------------
  Capability      Owner            Staff              Tenant         Platform admin
  --------------- ---------------- ------------------ -------------- --------------
  Property        Full             Assigned/limited   None           Support
  management                                                         

  Room management Full             Assigned/limited   Own room view  Support

  Tenant          Full             Limited            Own profile    Support
  management                                                         

  Rent management Full             Limited            Own invoices   Support

  Payments        Monitor/manage   Limited status     Pay/view own   Integration
                                                                     monitoring

  Financial       Full             None by default    None           Restricted
  reports                                                            

  Maintenance     Full             Assigned           Submit own     Support

  Platform        None             None               None           Full
  configuration                                                      
  ---------------------------------------------------------------------------------

------------------------------------------------------------------------

# 5. Functional Requirements

Requirement IDs should be used later in API implementation, test cases
and acceptance criteria.

  -----------------------------------------------------------------------
  ID                      Module                  Requirement
  ----------------------- ----------------------- -----------------------
  FR-01                   Authentication          Owners can register and
                                                  securely log in.

  FR-02                   Authentication          Users can recover
                                                  access through a
                                                  verified recovery
                                                  process.

  FR-03                   Property                Owners can create,
                                                  edit, view and
                                                  deactivate properties.

  FR-04                   Property                Owners can manage
                                                  property contact and
                                                  address information.

  FR-05                   Room                    Owners can create rooms
                                                  with capacity and
                                                  facilities.

  FR-06                   Bed                     Owners can create and
                                                  manage individual beds.

  FR-07                   Bed                     System tracks each
                                                  bed's availability.

  FR-08                   Tenant                  Owners can register and
                                                  update tenant profiles.

  FR-09                   Allocation              Authorized users can
                                                  allocate tenants to
                                                  available beds.

  FR-10                   Allocation              System prevents
                                                  overlapping active
                                                  allocations.

  FR-11                   Tenant lifecycle        Owners can check in,
                                                  transfer and check out
                                                  tenants.

  FR-12                   Rent                    System generates
                                                  monthly invoices for
                                                  eligible tenant stays.

  FR-13                   Rent                    Invoices support line
                                                  items and additional
                                                  charges.

  FR-14                   Rent                    System calculates
                                                  amount paid and
                                                  outstanding balance.

  FR-15                   Payment                 Tenants can initiate
                                                  online rent payments.

  FR-16                   Payment                 Backend verifies
                                                  gateway payments and
                                                  webhook events.

  FR-17                   Payment                 System prevents
                                                  duplicate payment
                                                  processing.

  FR-18                   Payment                 Owners can record
                                                  verified offline
                                                  payments.

  FR-19                   Receipt                 System generates
                                                  payment receipts.

  FR-20                   Deposit                 Owners can record
                                                  deposits and settlement
                                                  details.

  FR-21                   Expense                 Owners can record
                                                  property operating
                                                  expenses.

  FR-22                   Dashboard               Owners can view
                                                  occupancy and financial
                                                  summaries.

  FR-23                   Tenant portal           Tenants can view only
                                                  their own rental
                                                  information.

  FR-24                   Notification            System can send rent
                                                  due and payment outcome
                                                  notifications.

  FR-25                   Reporting               Owners can view monthly
                                                  collections and
                                                  expenses.

  FR-26                   Audit                   Important allocation
                                                  and financial actions
                                                  are audited.

  FR-27                   Multi-property          Owners can manage
                                                  multiple properties
                                                  from one account.

  FR-28                   Access control          Every protected
                                                  resource is checked
                                                  against the user's
                                                  permissions and
                                                  ownership scope.
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 6. Non-Functional Requirements

  -----------------------------------------------------------------------
  Category                            Requirement
  ----------------------------------- -----------------------------------
  Security                            Passwords are hashed using Argon2id
                                      or bcrypt.

  Authorization                       RBAC and owner/property-level data
                                      isolation are enforced server-side.

  Performance                         Common dashboard and tenant queries
                                      target under 2 seconds at pilot
                                      load.

  Reliability                         Payment processing is idempotent.

  Scalability                         The schema supports multiple owners
                                      and properties.

  Availability                        Initial target of 99.5%
                                      availability during pilot.

  Usability                           Responsive layout for desktop,
                                      tablet and mobile browsers.

  Maintainability                     Modular backend and documented
                                      APIs.

  Data integrity                      Foreign keys, database constraints
                                      and transactions protect records.

  Backup                              Automated backups and tested
                                      restoration.

  Privacy                             Only authorized users can access
                                      tenant information.

  Compatibility                       Current major desktop and mobile
                                      browsers.

  Observability                       Application logs, error reporting
                                      and health checks.

  Accessibility                       Forms, labels, keyboard navigation
                                      and readable contrast should follow
                                      good accessibility practices.
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 7. Detailed Feature Specifications

## 7.1 Authentication and onboarding

Owner journey:

1.  Open PG Connect.
2.  Register with name, email and phone.
3.  Verify email or phone using a configured provider.
4.  Set a password.
5.  Log in.
6.  Create the first PG property.
7.  Open the owner dashboard.

Features:

-   Registration.
-   Login and logout.
-   Password hashing.
-   Password reset.
-   Email or phone verification.
-   Session/token lifecycle.
-   Login rate limiting.
-   Account suspension handling.
-   Secure invitation flow for staff and tenants.

Use secure, HttpOnly cookies for browser sessions where practical. If
using access and refresh tokens, define secure storage, rotation,
revocation and expiration. Avoid storing long-lived sensitive tokens in
browser local storage.

## 7.2 Property management

An owner can manage multiple PG properties.

Property fields:

-   PG/property name.
-   Address.
-   Locality.
-   City.
-   PIN code.
-   Contact number.
-   Description.
-   Number of floors.
-   Facilities.
-   Food availability.
-   Property status.
-   Optional property images.

Property statuses may include active, inactive and archived.

Each property belongs to one owner. All property-specific queries must
enforce that ownership relationship.

## 7.3 Room management

Room fields:

-   Property.
-   Room number.
-   Floor number.
-   Room type.
-   Capacity.
-   AC/non-AC.
-   Attached/common bathroom.
-   Facilities.
-   Room status.
-   Default monthly rent, if used.

Example room types:

-   Single sharing.
-   Double sharing.
-   Triple sharing.
-   Four sharing.
-   Custom sharing.

Room capacity is the maximum number of beds configured for that room.
Actual occupancy is calculated from active bed stays, not manually typed
as an independent value.

## 7.4 Bed management

Each bed is an individually allocatable inventory unit.

Bed fields:

-   Room ID.
-   Bed label (A, B, C or 1, 2, 3).
-   Monthly rent.
-   Status.
-   Optional notes.

Example:

  Bed   Status        Rent per month
  ----- ----------- ----------------
  A     Occupied              ₹6,500
  B     Occupied              ₹6,500
  C     Available             ₹6,500

A bed cannot have two overlapping active tenant stays. Availability must
be derived from valid stays and protected by database-level concurrency
controls.

## 7.5 Tenant management

Tenant profile fields:

-   Full name.
-   Phone number.
-   Email.
-   Emergency contact.
-   Optional permanent address.
-   Owner account.
-   Account status.
-   Created date.

Avoid collecting identity documents or sensitive information unless
there is a clear business and legal need. If documents are later
supported, use private object storage, restricted access, retention
policies and audit logging.

## 7.6 Tenant stay and allocation management

A tenant profile represents a person. A tenant stay represents that
person's occupancy of a particular bed for a defined period.

Stay fields:

-   Tenant.
-   Property.
-   Bed.
-   Check-in date.
-   Expected checkout date.
-   Actual checkout date.
-   Agreed monthly rent.
-   Billing due day.
-   Status.
-   Agreement reference.

Possible stay statuses:

-   Reserved (only if reservation functionality is enabled).
-   Active.
-   Checked out.
-   Cancelled.

The agreed rent must be stored on the stay so historical rent does not
change when the bed's advertised/default price changes.

### Allocation workflow

1.  Owner selects a tenant.
2.  Owner selects a property.
3.  System displays available beds.
4.  Owner selects a bed.
5.  Owner enters check-in date, agreed rent and billing rule.
6.  Backend validates the property, bed and date range.
7.  Database transaction creates the stay.
8.  Availability is recalculated.
9.  Tenant is invited to activate their portal.
10. Applicable initial charges and deposit records are created.

### Tenant transfer

A room/bed transfer should close the old stay at the effective transfer
date and create a new stay for the new bed. The process must be
transactional and preserve historical records.

### Checkout

1.  Owner selects the active stay.
2.  System calculates the final billing period and any applicable
    prorated amount.
3.  Owner reviews outstanding invoices.
4.  Owner records approved adjustments or damage charges.
5.  Deposit settlement is recorded.
6.  Stay is closed.
7.  Bed becomes available for subsequent dates.
8.  Historical tenant, invoice and payment records remain intact.

## 7.7 Rent and invoice management

The system generates monthly invoices for eligible active stays.

Invoice fields:

-   Invoice number.
-   Tenant stay.
-   Billing period start and end.
-   Issue date.
-   Due date.
-   Subtotal.
-   Tax/charge lines if applicable.
-   Total amount.
-   Amount paid.
-   Balance due.
-   Status.

Invoice line items may include:

-   Monthly rent.
-   Electricity charge.
-   Food charge.
-   Maintenance charge.
-   Other approved charge.
-   Late fee, only if configured and disclosed.
-   Credit or adjustment.

Example:

  Description               Amount
  ----------------------- --------
  Monthly rent              ₹6,500
  Electricity                 ₹300
  Other approved charge       ₹200
  Total                     ₹7,000
  Previous outstanding          ₹0
  Total payable             ₹7,000

Billing rules must be configured explicitly. The recommended initial
option is a fixed monthly due date selected by the owner, with support
for individual tenant billing dates as a later enhancement.

Important rules:

-   Support partial payments.
-   Preserve issued invoice contents.
-   Do not silently rewrite historical invoices when rent changes.
-   Use credit notes or adjustment entries for corrections.
-   Support configurable proration for mid-month check-in and checkout.
-   Define how advances and overpayments are handled before implementing
    them.
-   Avoid generating duplicate invoices for the same stay and billing
    period.

## 7.8 Payment management

Recommended gateway: Razorpay, subject to merchant onboarding, account
eligibility, current product terms and production approval.

Payment workflow:

1.  Tenant opens an invoice.
2.  Tenant selects Pay Now.
3.  Backend validates invoice ownership and outstanding balance.
4.  Backend creates a payment order with the gateway.
5.  Frontend opens the gateway checkout.
6.  Gateway processes the payment.
7.  Backend verifies the gateway response/signature.
8.  Backend receives and verifies webhook events.
9.  Payment event is processed idempotently.
10. A payment record is finalized.
11. Invoice balance is recalculated.
12. Receipt is generated.
13. Owner and tenant views are updated.

Payment statuses:

-   Initiated.
-   Pending.
-   Successful.
-   Failed.
-   Refunded.
-   Partially refunded.

Never treat a frontend redirect or screenshot as proof of payment. A
verified gateway response/webhook is required.

### Offline payments

Owners or authorized staff may record:

-   Cash.
-   Direct UPI transfer.
-   Bank transfer.
-   Other configured offline method.

Record:

-   Amount.
-   Date.
-   Method.
-   Reference number, if available.
-   Recording user.
-   Notes.
-   Related invoice.

An offline payment must be clearly marked as owner-recorded; it is not
automatically verified by the payment gateway.

### Payment safeguards

-   Store gateway order and payment references.
-   Verify webhook signatures.
-   Enforce unique provider event IDs.
-   Use idempotency keys where supported.
-   Handle delayed and out-of-order events.
-   Do not process one payment twice.
-   Keep refunds and reversals as separate traceable events.
-   Reconcile gateway records with internal records.
-   Never store card numbers, CVV or UPI PINs.

## 7.9 Security deposit management

Deposit fields:

-   Tenant stay.
-   Amount received.
-   Amount refunded.
-   Amount adjusted.
-   Status.
-   Received date.
-   Settlement date.

Deposit status examples:

-   Due.
-   Partially received.
-   Held.
-   Partially settled.
-   Refunded.
-   Closed.

Deposit refunds and deductions must be recorded as separate
transactions. Do not overwrite the original deposit receipt.

## 7.10 Expense management

Expense categories:

-   Electricity.
-   Water.
-   Internet.
-   Food and groceries.
-   Housekeeping.
-   Staff salary.
-   Repairs.
-   Maintenance.
-   Other.

Expense fields:

-   Property.
-   Category.
-   Description.
-   Amount.
-   Expense date.
-   Receipt/document reference.
-   Created by.

Only authorized owner/staff users can create or view expense records.

## 7.11 Dashboard and reporting

Owner dashboard metrics:

-   Total properties.
-   Total rooms.
-   Total beds.
-   Occupied beds.
-   Available beds.
-   Occupancy percentage.
-   Rent invoiced this month.
-   Rent collected this month.
-   Outstanding rent.
-   Overdue invoices.
-   Expenses this month.
-   Net operating cash summary.

Suggested calculations:

Occupancy percentage:

`occupied beds / total active beds * 100`

Invoice balance:

`invoice total - successful payments allocated to invoice - valid credits`

Collection summary:

`sum of successful rent payments in selected period`

Expense summary:

`sum of recorded property expenses in selected period`

A displayed "profit" figure must be clearly defined. Initially label it
as an estimated operating surplus if it excludes taxes, depreciation,
financing, owner withdrawals or other accounting adjustments.

## 7.12 Tenant portal

Tenant navigation:

-   Dashboard.
-   My stay.
-   My invoices.
-   Make payment.
-   Payment history.
-   Receipts.
-   Security deposit.
-   Maintenance requests.
-   Profile.

The tenant portal must use server-side authorization to ensure all
records belong to the authenticated tenant.

## 7.13 Notifications

Notification events:

-   Tenant invitation.
-   Rent invoice generated.
-   Rent due soon.
-   Rent overdue.
-   Payment successful.
-   Payment failed.
-   Receipt available.
-   Checkout reminder.
-   Maintenance status changed.

Begin with email notifications if an email provider is configured. SMS
and WhatsApp should be added only after provider setup, consent and
applicable messaging requirements are understood.

Notifications should be queued and retried safely. A notification
failure must not undo a successful payment or invoice transaction.

## 7.14 Maintenance management

A tenant can create a request with:

-   Category.
-   Title.
-   Description.
-   Optional photo.
-   Property and room reference.
-   Priority.

Staff/owner can:

-   Assign the request.
-   Change status.
-   Add internal notes.
-   Mark it resolved.

Possible statuses:

-   Open.
-   Assigned.
-   In progress.
-   Resolved.
-   Closed.

Maintenance is a planned Version 2 feature unless needed for the first
pilot.

------------------------------------------------------------------------

# 8. Database Design

## 8.1 Database technology

Use PostgreSQL as the primary relational database and SQLAlchemy as the
ORM. Use Alembic for schema migrations.

General conventions:

-   UUID primary keys.
-   `NUMERIC(12,2)` for money.
-   `DATE` for calendar dates.
-   `TIMESTAMPTZ` for timestamps.
-   Store timestamps in UTC.
-   Display local time in `Asia/Kolkata`.
-   Use foreign keys and indexes.
-   Use soft deactivation/archive where history must be retained.
-   Never use floating-point types for money.

## 8.2 Core tables

### 1. users

  Column          Type          Notes
  --------------- ------------- --------------------
  id              UUID          Primary key
  full_name       VARCHAR       Required
  email           VARCHAR       Unique, normalized
  phone           VARCHAR       Contact
  password_hash   TEXT          Secure hash
  status          VARCHAR       Active/suspended
  created_at      TIMESTAMPTZ   Creation time
  updated_at      TIMESTAMPTZ   Last update

A user account may be an owner, staff member, tenant login or platform
administrator. Roles should be represented explicitly rather than
inferred from a user-supplied field.

### 2. owner_profiles

  Column            Type
  ----------------- ---------------------------
  id                UUID
  user_id           UUID FK users
  business_name     VARCHAR nullable
  contact_details   JSONB or explicit columns
  created_at        TIMESTAMPTZ

### 3. properties

  Column           Type
  ---------------- ------------------------
  id               UUID
  owner_id         UUID FK owner_profiles
  property_name    VARCHAR
  address          TEXT
  locality         VARCHAR
  city             VARCHAR
  pincode          VARCHAR
  contact_number   VARCHAR
  description      TEXT
  status           VARCHAR
  created_at       TIMESTAMPTZ
  updated_at       TIMESTAMPTZ

### 4. staff_memberships

  Column        Type
  ------------- ----------------------------------------
  id            UUID
  user_id       UUID FK users
  owner_id      UUID FK owner_profiles
  property_id   UUID FK properties, nullable
  role          VARCHAR
  permissions   JSONB or normalized permission mapping
  status        VARCHAR
  created_at    TIMESTAMPTZ

### 5. rooms

  Column                 Type
  ---------------------- -------------------------
  id                     UUID
  property_id            UUID FK properties
  room_number            VARCHAR
  floor_number           INTEGER
  room_type              VARCHAR
  capacity               INTEGER
  ac_type                VARCHAR
  bathroom_type          VARCHAR
  default_monthly_rent   NUMERIC(12,2), nullable
  status                 VARCHAR
  created_at             TIMESTAMPTZ

Add a unique constraint for `(property_id, room_number)` unless the
product explicitly supports duplicate room labels on different floors.

### 6. beds

  Column         Type
  -------------- ---------------
  id             UUID
  room_id        UUID FK rooms
  bed_label      VARCHAR
  monthly_rent   NUMERIC(12,2)
  status         VARCHAR
  created_at     TIMESTAMPTZ

Add a unique constraint for `(room_id, bed_label)`.

### 7. tenants

  Column              Type
  ------------------- ------------------------
  id                  UUID
  owner_id            UUID FK owner_profiles
  full_name           VARCHAR
  phone               VARCHAR
  email               VARCHAR nullable
  emergency_contact   VARCHAR nullable
  address             TEXT nullable
  status              VARCHAR
  created_at          TIMESTAMPTZ

### 8. tenant_accounts

  Column         Type
  -------------- ----------------------
  id             UUID
  tenant_id      UUID FK tenants
  user_id        UUID FK users
  status         VARCHAR
  invited_at     TIMESTAMPTZ
  activated_at   TIMESTAMPTZ nullable

Add unique constraints to prevent one tenant from being linked to
multiple unintended accounts.

### 9. tenant_stays

  Column                   Type
  ------------------------ --------------------
  id                       UUID
  tenant_id                UUID FK tenants
  property_id              UUID FK properties
  bed_id                   UUID FK beds
  check_in_date            DATE
  expected_checkout_date   DATE nullable
  actual_checkout_date     DATE nullable
  agreed_monthly_rent      NUMERIC(12,2)
  billing_due_day          INTEGER
  status                   VARCHAR
  created_at               TIMESTAMPTZ

A stay represents a tenant's occupancy of a bed for a date range.
Historical stays must be retained.

### 10. invoices

  Column                 Type
  ---------------------- ----------------------------------------------------
  id                     UUID
  tenant_stay_id         UUID FK tenant_stays
  invoice_number         VARCHAR
  billing_period_start   DATE
  billing_period_end     DATE
  issue_date             DATE
  due_date               DATE
  subtotal               NUMERIC(12,2)
  total_amount           NUMERIC(12,2)
  amount_paid            NUMERIC(12,2), preferably derived/cached carefully
  balance_due            NUMERIC(12,2), preferably derived/cached carefully
  status                 VARCHAR
  created_at             TIMESTAMPTZ

Add a uniqueness rule to prevent duplicate invoices for the same stay
and billing period.

### 11. invoice_items

  Column        Type
  ------------- ------------------
  id            UUID
  invoice_id    UUID FK invoices
  description   VARCHAR
  quantity      NUMERIC
  unit_price    NUMERIC(12,2)
  total         NUMERIC(12,2)

### 12. payments

  Column               Type
  -------------------- ------------------------
  id                   UUID
  invoice_id           UUID FK invoices
  tenant_id            UUID FK tenants
  amount               NUMERIC(12,2)
  payment_method       VARCHAR
  gateway_order_id     VARCHAR nullable
  gateway_payment_id   VARCHAR nullable
  status               VARCHAR
  paid_at              TIMESTAMPTZ nullable
  recorded_by          UUID FK users nullable
  created_at           TIMESTAMPTZ

For a more flexible model, use `payment_allocations` between payments
and invoices. This supports one payment allocated to multiple invoices
and payments covering only part of an invoice.

### 13. payment_events

  Column              Type
  ------------------- ---------------------------------------------
  id                  UUID
  provider_event_id   VARCHAR unique
  event_type          VARCHAR
  payload_reference   TEXT or JSONB with sensitive data minimized
  processing_status   VARCHAR
  received_at         TIMESTAMPTZ
  processed_at        TIMESTAMPTZ nullable

Store only the webhook data required for verification, reconciliation
and audit. Protect secrets and personal information.

### 14. security_deposits

  Column            Type
  ----------------- ----------------------
  id                UUID
  tenant_stay_id    UUID FK tenant_stays
  amount_received   NUMERIC(12,2)
  amount_refunded   NUMERIC(12,2)
  amount_adjusted   NUMERIC(12,2)
  status            VARCHAR
  received_at       TIMESTAMPTZ
  settled_at        TIMESTAMPTZ nullable

For robust accounting, add a separate `deposit_transactions` table for
receipts, adjustments and refunds.

### 15. expenses

  Column              Type
  ------------------- --------------------
  id                  UUID
  property_id         UUID FK properties
  category            VARCHAR
  description         TEXT
  amount              NUMERIC(12,2)
  expense_date        DATE
  receipt_reference   TEXT nullable
  created_by          UUID FK users
  created_at          TIMESTAMPTZ

### 16. maintenance_requests

  Column        Type
  ------------- --------------------------
  id            UUID
  property_id   UUID FK properties
  room_id       UUID FK rooms nullable
  tenant_id     UUID FK tenants nullable
  title         VARCHAR
  description   TEXT
  priority      VARCHAR
  status        VARCHAR
  assigned_to   UUID FK users nullable
  created_at    TIMESTAMPTZ
  resolved_at   TIMESTAMPTZ nullable

### 17. notifications

  Column              Type
  ------------------- ----------------------
  id                  UUID
  user_id             UUID FK users
  notification_type   VARCHAR
  message             TEXT
  status              VARCHAR
  scheduled_at        TIMESTAMPTZ
  sent_at             TIMESTAMPTZ nullable

### 18. audit_logs

  Column          Type
  --------------- -----------------------------
  id              UUID
  actor_user_id   UUID FK users
  property_id     UUID FK properties nullable
  action          VARCHAR
  entity_type     VARCHAR
  entity_id       UUID
  old_values      JSONB
  new_values      JSONB
  created_at      TIMESTAMPTZ

## 8.3 Additional tables recommended for production correctness

The following tables may be introduced in the first implementation where
their functionality is needed:

-   `payment_allocations`: maps payment amounts to one or more invoices.
-   `deposit_transactions`: immutable deposit receipt, deduction and
    refund history.
-   `invoice_adjustments`: credit/debit adjustments with reason and
    actor.
-   `staff_invitations`: secure staff onboarding.
-   `tenant_invitations`: secure tenant portal onboarding.
-   `refresh_sessions`: refresh token/session tracking and revocation.
-   `notification_attempts`: provider delivery and retry history.
-   `file_assets`: private document metadata and storage references.
-   `owner_billing_accounts`: future SaaS subscription configuration.

## 8.4 Relationship overview

``` text
USERS
  |-- OWNER_PROFILES
  |     |-- PROPERTIES
  |     |     |-- ROOMS
  |     |     |     |-- BEDS
  |     |     |     |     |-- TENANT_STAYS
  |     |     |     |             |-- TENANTS
  |     |     |     |             |-- INVOICES
  |     |     |     |                    |-- INVOICE_ITEMS
  |     |     |     |                    |-- PAYMENT_ALLOCATIONS
  |     |     |     |                             |-- PAYMENTS
  |     |     |     |-- EXPENSES
  |     |     |     |-- MAINTENANCE_REQUESTS
  |     |
  |     |-- STAFF_MEMBERSHIPS
  |
  |-- TENANT_ACCOUNTS
  |
  |-- AUDIT_LOGS
  |
  |-- NOTIFICATIONS

PAYMENTS
  |-- PAYMENT_EVENTS

TENANT_STAYS
  |-- SECURITY_DEPOSITS
  |-- DEPOSIT_TRANSACTIONS
```

## 8.5 Critical database constraints

1.  A bed cannot have two active occupants over overlapping date ranges.
2.  A tenant cannot have two overlapping active stays unless an
    explicitly supported business rule permits it.
3.  Room capacity must equal or exceed the number of configured beds;
    occupancy cannot exceed configured capacity.
4.  A stay's bed must belong to the same property as the stay.
5.  A tenant must belong to the same owner as the stay's property.
6.  A payment cannot be applied beyond the invoice balance unless an
    explicit advance/credit workflow exists.
7.  Financial transactions must not be silently deleted.
8.  Invoice numbers must be unique within the defined numbering scope.
9.  Money must use decimal database types.
10. Timestamps must be stored consistently in UTC.
11. Database transactions must protect multi-step financial and
    allocation operations.
12. Database-level constraints or exclusion constraints should protect
    date-range allocation concurrency.

For PostgreSQL, consider a date-range exclusion constraint on active bed
stays, using a suitable range type and a partial condition for
non-cancelled stays. The implementation must account for open-ended
stays and checkout-date semantics.

------------------------------------------------------------------------

# 9. System Architecture

## 9.1 Recommended technology stack

  -----------------------------------------------------------------------
  Layer                   Technology              Purpose
  ----------------------- ----------------------- -----------------------
  Frontend                React                   Web interface

  Language                TypeScript              Frontend type safety

  Styling                 Tailwind CSS            Responsive UI

  UI components           Accessible component    Consistent forms,
                          library                 tables and dialogs

  Backend                 Python + FastAPI        REST API and business
                                                  logic

  ORM                     SQLAlchemy              Database access

  Migrations              Alembic                 Database schema
                                                  versioning

  Database                PostgreSQL              Persistent relational
                                                  data

  Cache/queue             Redis                   Caching and background
                                                  coordination

  Background jobs         Celery or a suitable    Billing and
                          scheduler/worker        notifications

  Authentication          Secure cookie/session   User sessions
                          or access/refresh token 
                          design                  

  Payments                Razorpay                Online payment
                                                  processing

  Testing                 Pytest, Vitest,         Unit, API and UI
                          Playwright              testing

  Containers              Docker                  Consistent environments

  CI/CD                   GitHub Actions          Automated quality
                                                  checks and deployment

  Cloud                   AWS or another suitable Hosting and managed
                          provider                infrastructure

  Monitoring              Structured logs and     Operational visibility
                          error monitoring        
  -----------------------------------------------------------------------

Choose managed PostgreSQL and object storage where practical. Do not
introduce Kubernetes for the first MVP unless there is a clear
operational need.

## 9.2 Architecture style

Use a **modular monolith**.

Benefits:

-   One backend deployment.
-   Clear module boundaries.
-   Simpler development and debugging.
-   Easier transactions across related business data.
-   Lower operational overhead.
-   Can be split into services later if scale justifies it.

## 9.3 High-level architecture

``` text
                 USERS
                   |
       +-----------+-----------+
       |           |           |
     OWNER       STAFF       TENANT
       |           |           |
       +-----------+-----------+
                   |
          RESPONSIVE WEB APP
          React + TypeScript
                   |
              HTTPS / API
                   |
             FASTAPI BACKEND
                   |
       +-----------+------------+
       |           |            |
   AUTH/RBAC   BUSINESS      INTEGRATIONS
               MODULES
       |           |            |
       |      +----+----+       +---- Razorpay
       |      |    |    |       +---- Email provider
       |   Property Rent  Tenant
       |   Rooms  Billing Portal
       |      |    |    |
       |   Expenses Maintenance
       |      |
       +------+----------------+
                   |
            PostgreSQL
                   |
                 Redis
                   |
            Background Worker
                   |
       Billing / Reminders / Reports
```

## 9.4 Frontend experiences

### Owner dashboard

-   Overview.
-   Properties.
-   Rooms and beds.
-   Tenants.
-   Stays and allocations.
-   Invoices.
-   Payments.
-   Deposits.
-   Expenses.
-   Reports.
-   Staff.
-   Settings.

### Staff dashboard

-   Assigned properties.
-   Room availability.
-   Tenant registration.
-   Check-in and checkout assistance.
-   Maintenance requests.
-   Limited operational payment status.

### Tenant portal

-   Dashboard.
-   My stay.
-   My invoices.
-   Make payment.
-   Payment history.
-   Receipts.
-   Security deposit.
-   Maintenance requests.
-   Profile.

## 9.5 Backend module boundaries

-   `auth`: registration, login, sessions, recovery.
-   `users`: user accounts and profiles.
-   `owners`: owner profiles and business settings.
-   `properties`: property CRUD and ownership.
-   `rooms`: rooms, beds and facilities.
-   `tenants`: tenant profiles and invitations.
-   `stays`: allocation, transfer, check-in and checkout.
-   `billing`: invoice generation and adjustments.
-   `payments`: orders, gateway events, reconciliation and receipts.
-   `deposits`: deposit receipts and settlements.
-   `expenses`: operating expense records.
-   `maintenance`: issue workflow.
-   `notifications`: delivery and retry.
-   `reports`: dashboard and analytics.
-   `audit`: sensitive action history.

------------------------------------------------------------------------

# 10. Suggested Repository Structure

``` text
pg-connect/
|
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- app/
|   |   |-- components/
|   |   |-- layouts/
|   |   |-- pages/
|   |   |-- features/
|   |   |   |-- auth/
|   |   |   |-- dashboard/
|   |   |   |-- properties/
|   |   |   |-- rooms/
|   |   |   |-- tenants/
|   |   |   |-- stays/
|   |   |   |-- billing/
|   |   |   |-- payments/
|   |   |   |-- expenses/
|   |   |   |-- maintenance/
|   |   |   |-- tenant-portal/
|   |   |-- hooks/
|   |   |-- services/
|   |   |-- types/
|   |   |-- utils/
|   |   |-- App.tsx
|   |-- package.json
|
|-- backend/
|   |-- app/
|   |   |-- api/
|   |   |   |-- v1/
|   |   |-- core/
|   |   |-- models/
|   |   |-- schemas/
|   |   |-- repositories/
|   |   |-- services/
|   |   |-- integrations/
|   |   |-- tasks/
|   |   |-- middleware/
|   |   |-- main.py
|   |-- migrations/
|   |-- tests/
|   |-- requirements.txt
|
|-- infrastructure/
|   |-- docker/
|   |-- deployment/
|
|-- docs/
|   |-- requirements/
|   |-- architecture/
|   |-- database/
|   |-- api/
|   |-- testing/
|
|-- docker-compose.yml
|-- .env.example
|-- .gitignore
|-- README.md
```

Keep business logic in services, database access in repositories or
clearly separated data-access functions, request/response validation in
schemas, and HTTP routing in API modules.

------------------------------------------------------------------------

# 11. API Specification

Use versioned REST endpoints under `/api/v1`.

## 11.1 Authentication

  --------------------------------------------------------------------------------
  Method                  Endpoint                         Purpose
  ----------------------- -------------------------------- -----------------------
  POST                    `/api/v1/auth/register`          Owner registration

  POST                    `/api/v1/auth/login`             Login

  POST                    `/api/v1/auth/logout`            Logout

  POST                    `/api/v1/auth/refresh`           Refresh session, if
                                                           token design is used

  POST                    `/api/v1/auth/forgot-password`   Start recovery

  POST                    `/api/v1/auth/reset-password`    Complete recovery

  GET                     `/api/v1/auth/me`                Current user
  --------------------------------------------------------------------------------

## 11.2 Properties

  ------------------------------------------------------------------------------------
  Method                  Endpoint                             Purpose
  ----------------------- ------------------------------------ -----------------------
  GET                     `/api/v1/properties`                 List authorized
                                                               properties

  POST                    `/api/v1/properties`                 Create property

  GET                     `/api/v1/properties/{property_id}`   Get property

  PATCH                   `/api/v1/properties/{property_id}`   Update property

  DELETE                  `/api/v1/properties/{property_id}`   Deactivate/archive
                                                               property
  ------------------------------------------------------------------------------------

## 11.3 Rooms and beds

  Method   Endpoint                                   Purpose
  -------- ------------------------------------------ -------------
  GET      `/api/v1/properties/{property_id}/rooms`   List rooms
  POST     `/api/v1/properties/{property_id}/rooms`   Create room
  PATCH    `/api/v1/rooms/{room_id}`                  Update room
  GET      `/api/v1/rooms/{room_id}/beds`             List beds
  POST     `/api/v1/rooms/{room_id}/beds`             Create bed
  PATCH    `/api/v1/beds/{bed_id}`                    Update bed

## 11.4 Tenants and stays

  Method   Endpoint                             Purpose
  -------- ------------------------------------ ------------------------
  GET      `/api/v1/tenants`                    List tenants
  POST     `/api/v1/tenants`                    Register tenant
  GET      `/api/v1/tenants/{tenant_id}`        Tenant detail
  PATCH    `/api/v1/tenants/{tenant_id}`        Update tenant
  POST     `/api/v1/stays`                      Allocate tenant to bed
  GET      `/api/v1/stays`                      List authorized stays
  POST     `/api/v1/stays/{stay_id}/transfer`   Transfer bed
  POST     `/api/v1/stays/{stay_id}/checkout`   Checkout tenant

## 11.5 Billing and payments

  Method   Endpoint                                      Purpose
  -------- --------------------------------------------- ---------------------------------
  GET      `/api/v1/invoices`                            List authorized invoices
  POST     `/api/v1/invoices`                            Create invoice, where permitted
  GET      `/api/v1/invoices/{invoice_id}`               Invoice detail
  POST     `/api/v1/invoices/{invoice_id}/adjustments`   Add adjustment
  POST     `/api/v1/payments/orders`                     Create gateway order
  POST     `/api/v1/payments/webhook`                    Receive gateway webhook
  POST     `/api/v1/payments/offline`                    Record offline payment
  GET      `/api/v1/payments/{payment_id}`               Payment detail
  GET      `/api/v1/payments/{payment_id}/receipt`       Download receipt

## 11.6 Deposits, expenses and reports

  Method     Endpoint                              Purpose
  ---------- ------------------------------------- ----------------------
  GET/POST   `/api/v1/deposits`                    List/create deposits
  POST       `/api/v1/deposits/{id}/settlements`   Record settlement
  GET/POST   `/api/v1/expenses`                    List/create expenses
  PATCH      `/api/v1/expenses/{id}`               Update expense
  GET        `/api/v1/dashboard/summary`           Dashboard summary
  GET        `/api/v1/reports/collections`         Collection report
  GET        `/api/v1/reports/occupancy`           Occupancy report

## 11.7 Tenant portal

  Method   Endpoint                       Purpose
  -------- ------------------------------ ----------------
  GET      `/api/v1/tenant/me`            Tenant profile
  GET      `/api/v1/tenant/stay`          Current stay
  GET      `/api/v1/tenant/invoices`      Own invoices
  GET      `/api/v1/tenant/payments`      Own payments
  GET      `/api/v1/tenant/deposit`       Own deposit
  POST     `/api/v1/tenant/maintenance`   Submit request

All endpoints must apply authentication and resource-level
authorization. List endpoints should support pagination and appropriate
filters.

------------------------------------------------------------------------

# 12. Key Business Workflows

## 12.1 New tenant registration and allocation

``` text
Owner logs in
    |
Open tenant registration
    |
Enter tenant details
    |
Select property
    |
Select available bed
    |
Enter check-in date, rent and deposit
    |
Backend validates ownership and availability
    |
Database transaction creates tenant stay
    |
Tenant invitation is sent
    |
Initial invoice/deposit records created as applicable
    |
Dashboard occupancy is updated
```

## 12.2 Monthly rent collection

``` text
Scheduled billing job
    |
Find eligible active tenant stays
    |
Check whether invoice already exists
    |
Calculate rent and approved charges
    |
Create invoice transactionally
    |
Notify tenant
    |
Tenant opens invoice
    |
Backend creates gateway order
    |
Gateway checkout
    |
Verified gateway response/webhook
    |
Idempotent payment processing
    |
Payment allocation recorded
    |
Invoice balance recalculated
    |
Receipt generated
    |
Owner and tenant dashboards updated
```

## 12.3 Tenant checkout

``` text
Owner selects active stay
    |
Enter checkout date
    |
Calculate final billing/proration
    |
Review outstanding invoices
    |
Record authorized charges/credits
    |
Settle security deposit
    |
Close tenant stay
    |
Bed becomes available for subsequent dates
    |
Historical records remain available
```

## 12.4 Room transfer

``` text
Owner selects tenant stay
    |
Select new available bed
    |
Choose effective transfer date
    |
Validate new bed and property
    |
Close old stay at transfer boundary
    |
Create new stay with agreed rent
    |
Commit both changes in one transaction
    |
Update availability and tenant portal
```

------------------------------------------------------------------------

# 13. UI/UX Design Requirements

## 13.1 Visual direction

Use a clean, modern SaaS dashboard.

Recommended characteristics:

-   Simple navigation.
-   Clear page titles.
-   Readable typography.
-   Consistent spacing.
-   Restrained use of color.
-   Clear status labels.
-   Useful tables with search and filters.
-   Responsive mobile layouts.
-   Accessible forms and error messages.
-   Confirmation for destructive or financial actions.

Avoid excessive gradients, animations and decorative cards that reduce
operational clarity.

## 13.2 Owner pages

1.  Login.
2.  Registration.
3.  Forgot password.
4.  Onboarding wizard.
5.  Owner dashboard.
6.  Property list.
7.  Create/edit property.
8.  Property overview.
9.  Room list.
10. Room detail and bed allocation.
11. Tenant list.
12. Tenant profile.
13. New tenant form.
14. Active stays.
15. Check-in and checkout.
16. Invoice list.
17. Invoice detail.
18. Payment history.
19. Deposit management.
20. Expense list.
21. Expense creation.
22. Reports.
23. Staff management.
24. Account settings.

## 13.3 Tenant pages

1.  Tenant login/activation.
2.  Tenant dashboard.
3.  My stay.
4.  My invoices.
5.  Invoice details.
6.  Payment checkout.
7.  Payment result.
8.  Payment history.
9.  Receipt download.
10. Security deposit.
11. Maintenance requests.
12. Profile.

## 13.4 Mobile responsiveness

For mobile:

-   Use a collapsible navigation menu.
-   Convert wide tables into cards or horizontally scrollable tables.
-   Keep primary actions easy to reach.
-   Ensure payment and invoice details remain readable.
-   Use mobile-friendly form controls.
-   Test at common phone widths.
-   Do not rely on hover interactions.

------------------------------------------------------------------------

# 14. Security, Privacy and Compliance

Security is a core product requirement because the platform handles
tenant personal data and payment records.

## 14.1 Authentication security

-   Hash passwords with Argon2id or bcrypt.
-   Apply login rate limits.
-   Use secure password reset tokens.
-   Expire and revoke sessions.
-   Protect against brute-force login attempts.
-   Require verification before enabling sensitive account actions.

## 14.2 Authorization and data isolation

-   Every owner-owned record must be scoped to the authenticated owner.
-   Staff access must be limited to assigned properties and permissions.
-   Tenant access must be scoped to the authenticated tenant.
-   Never rely only on frontend route protection.
-   Test cross-owner and cross-tenant access explicitly.
-   Consider PostgreSQL row-level security as an additional defense, not
    a substitute for correct application authorization.

## 14.3 Payment security

-   Use gateway-hosted checkout.
-   Never store card numbers, CVV or UPI PINs.
-   Verify gateway signatures.
-   Verify webhook signatures using the raw request body as required by
    the provider.
-   Make webhook processing idempotent.
-   Store provider references.
-   Reconcile payment records.
-   Keep test and production credentials separate.

## 14.4 Data privacy

-   Collect only information required for the service.
-   Explain why tenant information is collected.
-   Restrict document access.
-   Define retention and deletion policies.
-   Provide appropriate data correction and access processes.
-   Protect backups.
-   Avoid placing personal data in logs.
-   Review applicable Indian privacy and data protection requirements
    before commercial launch.

## 14.5 Financial auditability

-   Do not silently delete successful payments.
-   Record refunds and reversals separately.
-   Preserve issued invoice history.
-   Record who made manual payment entries.
-   Record reasons for financial adjustments.
-   Keep deposit transactions traceable.
-   Reconcile payment gateway records against internal records.

------------------------------------------------------------------------

# 15. Testing Strategy

## 15.1 Unit tests

Test:

-   Rent calculations.
-   Proration.
-   Invoice totals.
-   Outstanding balances.
-   Partial payments.
-   Deposit settlements.
-   Occupancy calculations.
-   Permission checks.

## 15.2 Integration tests

Test:

-   API and PostgreSQL.
-   Tenant registration.
-   Bed allocation.
-   Checkout.
-   Invoice generation.
-   Payment event processing.
-   Expense recording.
-   Tenant portal access.

## 15.3 Payment tests

Test:

-   Successful payment.
-   Failed payment.
-   Pending payment.
-   Delayed webhook.
-   Duplicate webhook.
-   Invalid webhook signature.
-   Refund.
-   Partial refund.
-   Payment for an already-paid invoice.
-   Partial invoice payment.

## 15.4 Security tests

Test:

-   Tenant cannot read another tenant's invoice.
-   Owner cannot access another owner's property.
-   Staff cannot access unauthorized property.
-   Tenant cannot call owner-only endpoints.
-   Invalid or expired sessions are rejected.
-   IDs cannot be used to bypass authorization.

## 15.5 Concurrency tests

Test two users attempting to allocate the same bed at the same time.
Exactly one valid allocation should succeed.

## 15.6 UI tests

Use browser automation to test:

-   Registration and login.
-   Property creation.
-   Room and bed creation.
-   Tenant registration.
-   Allocation.
-   Invoice display.
-   Payment test flow.
-   Receipt access.
-   Mobile navigation.

## 15.7 Acceptance scenarios

1.  Two tenants cannot occupy the same bed for overlapping periods.
2.  A checked-out tenant's invoices remain available to the owner.
3.  A tenant cannot see another tenant's payment history.
4.  A duplicated webhook cannot create a duplicated payment.
5.  A failed payment does not reduce invoice balance.
6.  A partial payment updates the outstanding balance correctly.
7.  An owner cannot access another owner's property.
8.  A rent change does not alter previously issued invoices.
9.  A database backup can be restored.
10. A staff member cannot view restricted financial reports.
11. A room cannot be allocated beyond its configured bed capacity.
12. A payment refund is represented as a separate traceable transaction.

------------------------------------------------------------------------

# 16. Development Environment and Tooling

Recommended development environment:

-   Windows 11.
-   Visual Studio Code.
-   Python 3.12.
-   Node.js LTS.
-   npm.
-   Git.
-   Docker Desktop.
-   PostgreSQL through Docker for local development.
-   GitHub repository.

Use a supported Python version and pin project dependencies. Do not
automatically use the newest Python version if a required library has
compatibility problems.

## 16.1 Initial repository setup

Create the project repository:

``` powershell
mkdir pg-connect
cd pg-connect
git init
mkdir frontend, backend, infrastructure, docs
```

Create and activate the backend environment:

``` powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
```

Install initial backend dependencies:

``` powershell
pip install fastapi uvicorn sqlalchemy alembic psycopg[binary] pydantic-settings python-multipart argon2-cffi pytest httpx
```

Freeze dependencies after the initial environment is validated:

``` powershell
pip freeze > requirements.txt
```

Create the frontend using Vite:

``` powershell
cd ..\frontend
npm create vite@latest . -- --template react-ts
npm install
```

Add frontend dependencies as required:

``` powershell
npm install react-router-dom
npm install -D tailwindcss @tailwindcss/vite
```

Confirm the current Tailwind setup instructions when installing, because
its Vite integration may change between major versions.

## 16.2 Environment variables

Create `.env.example` and keep actual secrets in a local `.env` file
that is excluded from Git.

Example:

``` dotenv
APP_ENV=development
APP_NAME=PG Connect
DATABASE_URL=postgresql+psycopg://pgconnect:localpassword@localhost:5432/pgconnect
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:5173

PAYMENT_PROVIDER=razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

EMAIL_PROVIDER=
EMAIL_API_KEY=
```

Never commit real credentials, API keys, webhook secrets or production
database passwords.

## 16.3 Docker services

The local Docker Compose environment should eventually contain:

-   PostgreSQL.
-   Redis.
-   FastAPI backend.
-   React frontend (development or production configuration).
-   Background worker.
-   Optional scheduler.

Use health checks and persistent database volumes. Do not delete volumes
or run destructive database reset commands without a verified backup.

------------------------------------------------------------------------

# 17. Eight-Week Development Roadmap

The following is an indicative plan for an individual developer working
consistently. Actual duration depends on implementation complexity,
payment onboarding and testing.

## Week 1 --- Foundation

Tasks:

-   Create GitHub repository.
-   Initialize React + TypeScript.
-   Initialize FastAPI.
-   Configure PostgreSQL.
-   Configure SQLAlchemy and Alembic.
-   Configure Docker Compose.
-   Implement user and owner models.
-   Implement registration and login.
-   Add basic authentication tests.

Deliverable: application foundation and secure owner login.

## Week 2 --- Properties, rooms and beds

Tasks:

-   Property CRUD.
-   Room CRUD.
-   Bed CRUD.
-   Room capacity validation.
-   Occupancy queries.
-   Owner data isolation.
-   Frontend property and room screens.

Deliverable: working property and inventory management.

## Week 3 --- Tenant and allocation workflows

Tasks:

-   Tenant registration.
-   Tenant profiles.
-   Tenant invitations.
-   Tenant stays.
-   Bed allocation.
-   Checkout.
-   Transfer workflow.
-   Concurrency protection.
-   Tests for allocation edge cases.

Deliverable: complete tenant lifecycle.

## Week 4 --- Billing and deposits

Tasks:

-   Invoice schema.
-   Invoice items.
-   Monthly billing rules.
-   Invoice generation service.
-   Duplicate invoice prevention.
-   Partial payment calculations.
-   Deposit records.
-   Invoice screens.

Deliverable: reliable billing and deposit management.

## Week 5 --- Payments and tenant portal

Tasks:

-   Payment gateway test setup.
-   Order creation.
-   Hosted checkout integration.
-   Signature verification.
-   Webhook processing.
-   Idempotency.
-   Offline payment recording.
-   Receipt generation.
-   Tenant portal.

Deliverable: end-to-end payment workflow in test mode.

## Week 6 --- Dashboard and expenses

Tasks:

-   Owner dashboard.
-   Occupancy summaries.
-   Collections reports.
-   Outstanding rent.
-   Expense tracking.
-   Property filters.
-   Tenant payment history.
-   Responsive improvements.

Deliverable: operational owner dashboard.

## Week 7 --- Testing and hardening

Tasks:

-   Unit tests.
-   API integration tests.
-   Payment tests.
-   Authorization tests.
-   Cross-owner isolation tests.
-   Concurrency tests.
-   UI automation.
-   Security review.
-   Backup and restoration test.

Deliverable: pilot-ready MVP candidate.

## Week 8 --- Deployment and pilot

Tasks:

-   Production Docker configuration.
-   Cloud deployment.
-   HTTPS.
-   Managed PostgreSQL or secured database hosting.
-   Database backup schedule.
-   Monitoring and error reporting.
-   Production secrets configuration.
-   Documentation.
-   Demo data.
-   Pilot onboarding and feedback.

Deliverable: deployed MVP ready for controlled pilot use.

------------------------------------------------------------------------

# 18. Deployment and DevOps Plan

## 18.1 Environments

Maintain separate environments:

-   Local development.
-   Automated test/CI.
-   Staging.
-   Production.

Never use production tenant data in local testing unless it has been
appropriately anonymized and authorized.

## 18.2 CI/CD pipeline

Recommended GitHub Actions pipeline:

``` text
Developer pushes branch
        |
Pull request created
        |
Install backend dependencies
        |
Run linting and static checks
        |
Run backend unit tests
        |
Run frontend lint and tests
        |
Build frontend
        |
Build backend Docker image
        |
Run integration tests
        |
Review and merge
        |
Build release image
        |
Deploy to staging
        |
Smoke tests
        |
Approved production deployment
```

## 18.3 Operational monitoring

Monitor:

-   API availability.
-   API response time.
-   Error rates.
-   Database connectivity.
-   Database storage.
-   Background job failures.
-   Payment webhook failures.
-   Email delivery failures.
-   Failed login attempts.
-   Backup success.

## 18.4 Backup and recovery

-   Schedule automated database backups.
-   Encrypt backups.
-   Restrict backup access.
-   Define retention periods.
-   Test restoration periodically.
-   Document recovery steps.
-   Monitor failed backups.

A backup is not considered reliable until restoration has been tested.

------------------------------------------------------------------------

# 19. Risks and Mitigation

  -----------------------------------------------------------------------
  Risk                    Impact                  Mitigation
  ----------------------- ----------------------- -----------------------
  Duplicate bed           Incorrect occupancy     Database constraints
  allocation                                      and transactions

  Duplicate payment       Incorrect financial     Idempotent event
  webhook                 records                 processing

  Payment gateway delay   Confusing payment       Pending state and
                          status                  reconciliation

  Cross-owner data        Serious privacy issue   Server-side
  exposure                                        authorization and
                                                  isolation tests

  Incorrect rent          Financial disputes      Unit tests and
  calculation                                     immutable invoices

  Tenant data leakage     Privacy harm            Data minimization and
                                                  restricted access

  Failed background jobs  Missed                  Retry strategy and job
                          invoices/reminders      monitoring

  Database loss           Business disruption     Automated backups and
                                                  restore testing

  Scope expansion         Delayed MVP             Strict release
                                                  boundaries

  Provider integration    Integration failure     Isolated adapter layer
  changes                                         and provider
                                                  documentation
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 20. Business Model and Future Commercialization

The initial customer is an individual PG owner in Bengaluru.

A possible future SaaS pricing experiment:

  Plan             Illustrative monthly price Intended customer
  -------------- ---------------------------- -------------------------
  Starter                                ₹299 Small PG
  Professional                           ₹699 Medium PG
  Business                             ₹1,499 Multiple-property owner

These are hypotheses for customer research, not validated market prices.

Possible revenue streams:

-   Monthly SaaS subscription.
-   Premium analytics.
-   Additional property capacity.
-   Communication packages.
-   Optional payment-related services where permitted by provider terms
    and applicable rules.

Before charging customers, validate willingness to pay, operational
support costs, gateway fees, hosting costs and tax obligations.

------------------------------------------------------------------------

# 21. Pilot Validation Plan

Before broad release, test PG Connect with a small number of willing PG
owners.

Suggested validation process:

1.  Interview owners about their current record-keeping process.
2.  Understand how they allocate rooms and beds.
3.  Learn how they calculate rent and deposits.
4.  Identify how they record cash and UPI payments.
5.  Understand their checkout and refund process.
6.  Observe which reports they need.
7.  Set up demo properties and sample tenants.
8.  Run parallel records during a controlled trial.
9.  Compare PG Connect records with the owner's existing records.
10. Collect feedback and prioritize defects.

Do not migrate a PG owner's complete operational records until data
import, backup and verification procedures are ready.

## Pilot questions

-   How many PG properties do they operate?
-   How many rooms and beds are there?
-   Are rents fixed by room, bed or tenant?
-   What is the normal billing due date?
-   Are electricity and food charges included?
-   How are deposits handled?
-   What happens when a tenant leaves mid-month?
-   Do tenants pay by cash, direct UPI or another method?
-   Who manages tenant registration and checkout?
-   What reports would save the owner the most time?

------------------------------------------------------------------------

# 22. Resume and Portfolio Positioning

Suggested project title:

**PG Connect --- Multi-Tenant PG Management and Rental Automation SaaS**

Suggested description, to be updated after implementation:

> Developing a responsive SaaS platform for individual PG owners to
> manage multiple properties, room and bed allocation, tenant lifecycle,
> monthly rental billing, digital payments, deposits and operational
> expenses. Designed using React, TypeScript, FastAPI and PostgreSQL,
> with role-based access control, payment gateway verification,
> automated billing and containerized deployment.

Potential engineering highlights after they are genuinely implemented:

-   Designed a multi-tenant relational data model.
-   Implemented transactional room and bed allocation.
-   Built role-based owner, staff and tenant portals.
-   Integrated payment gateway order creation and webhook verification.
-   Implemented idempotent payment processing.
-   Automated monthly invoice generation.
-   Added Docker-based deployment and CI/CD.
-   Built automated tests for financial and authorization workflows.

Do not claim production users, performance improvements, security
certification or business results unless measured and verified.

------------------------------------------------------------------------

# 23. Definition of Done for Version 1

The MVP is ready for a controlled pilot only when:

-   [ ] Owner can register and log in.
-   [ ] Owner can create multiple properties.
-   [ ] Owner can create rooms and beds.
-   [ ] System displays correct occupancy.
-   [ ] Owner can register tenants.
-   [ ] Owner can allocate tenants to beds.
-   [ ] Concurrent duplicate allocation is prevented.
-   [ ] Owner can transfer and check out tenants.
-   [ ] Historical stays are retained.
-   [ ] Monthly invoices can be generated.
-   [ ] Duplicate invoices are prevented.
-   [ ] Partial payments work correctly.
-   [ ] Online payment works in gateway test mode.
-   [ ] Webhook signature is verified.
-   [ ] Duplicate webhook events are harmless.
-   [ ] Offline payments can be recorded with an audit trail.
-   [ ] Receipts can be downloaded.
-   [ ] Deposits can be recorded and settled.
-   [ ] Expenses can be recorded.
-   [ ] Owner dashboard shows accurate summaries.
-   [ ] Tenant can access only their own records.
-   [ ] Owner data is isolated from other owners.
-   [ ] Responsive UI works on common mobile sizes.
-   [ ] Automated tests pass.
-   [ ] Backups and restoration are tested.
-   [ ] Production secrets are not committed.
-   [ ] Application is deployed to a controlled environment.
-   [ ] User documentation is available.

------------------------------------------------------------------------

# 24. Recommended Implementation Order

Follow this order to avoid building dependent modules prematurely.

1.  Repository and development environment.
2.  Database configuration and migrations.
3.  Users, owners and authentication.
4.  Property management.
5.  Rooms and beds.
6.  Tenant profiles.
7.  Tenant stays and allocation.
8.  Checkout and transfers.
9.  Invoice and billing engine.
10. Payment records and payment allocations.
11. Payment gateway integration.
12. Deposit management.
13. Tenant portal.
14. Expense management.
15. Owner dashboard and reports.
16. Notifications.
17. Testing and security hardening.
18. Deployment and pilot.

At every stage:

-   Make a small change.
-   Run relevant tests.
-   Verify the application manually.
-   Commit working changes.
-   Keep database migrations under version control.
-   Back up important data before risky changes.
-   Avoid destructive commands unless the target and recovery plan are
    clear.

------------------------------------------------------------------------

# 25. Decisions Still Requiring Product Confirmation

The product direction is established, but the following business rules
should be confirmed before implementing dependent database and billing
logic.

  -----------------------------------------------------------------------
  Decision                Recommended starting    Status
                          point                   
  ----------------------- ----------------------- -----------------------
  Target customer         Individual PG owners    Confirmed

  Initial geography       Bengaluru               Confirmed

  Platform                Responsive web          Confirmed
                          application             

  Product name            PG Connect              Proposed/selected

  Initial scope           PG management + tenant  Confirmed
                          payment portal          

  Multiple properties     Support from the        Recommended
                          beginning               

  Rent billing            Fixed monthly due date  Pending confirmation
                          configurable by owner   

  Rent pricing            Default room price with Pending confirmation
                          per-bed override        

  Payments                Online gateway +        Pending confirmation
                          owner-recorded offline  
                          payments                

  Tenant onboarding       Owner registers and     Pending confirmation
                          invites tenant          

  UI style                Clean, modern SaaS      Pending confirmation
                          dashboard               

  Staff portal            Limited role-based      Planned
                          access                  

  Maintenance module      Version 2               Planned

  AI features             Version 3               Deferred
  -----------------------------------------------------------------------

These decisions affect invoice scheduling, pricing history, payment
records and access control. Confirm them before finalizing the
implementation schema.

------------------------------------------------------------------------

# 26. Immediate Next Steps

Before writing application code:

1.  Confirm the pending business rules in Section 25.
2.  Create the GitHub repository named `pg-connect`.
3.  Create the frontend and backend project skeleton.
4.  Configure Python, Node.js and Docker.
5.  Set up PostgreSQL and Alembic.
6.  Implement the first database migration.
7.  Build owner registration and authentication.
8.  Verify the first end-to-end workflow before proceeding to property
    management.

**Recommended first development milestone:** An owner can register, log
in, create a PG property and see that property on a protected dashboard.

This is the foundation on which all later modules will depend.

------------------------------------------------------------------------

**End of PG Connect Development Specification --- Version 1.0**
