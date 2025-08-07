# Requirements Document

## Introduction

InsureTrack is an admin-only Progressive Web Application (PWA) designed to help administrators manage car insurance expiry data and automatically send email reminders to customers. The system allows admins to upload Excel files containing customer insurance information, manage the data through a dashboard interface, and automatically notify customers via Gmail when their insurance is approaching expiration.

## Requirements

### Requirement 1

**User Story:** As an admin, I want to upload Excel files containing insurance data, so that I can efficiently import customer information into the system.

#### Acceptance Criteria

1. WHEN an admin selects an Excel file (.xlsx format) THEN the system SHALL parse the file using SheetJS library
2. WHEN the file is parsed THEN the system SHALL validate that it contains required fields: Name, Email, ExpiryDate
3. WHEN the file validation is successful THEN the system SHALL display a preview table of the data
4. WHEN the admin confirms the preview THEN the system SHALL save all entries to the database
5. IF the file format is invalid or missing required fields THEN the system SHALL display an error message and reject the upload

### Requirement 2

**User Story:** As an admin, I want to view and manage all insurance entries in a dashboard, so that I can monitor customer insurance status and make necessary updates.

#### Acceptance Criteria

1. WHEN an admin accesses the dashboard THEN the system SHALL display all insurance entries in a table format
2. WHEN displaying entries THEN the system SHALL show Name, Email, Expiry Date, and Status columns
3. WHEN calculating status THEN the system SHALL categorize entries as Active (>7 days), Expiring Soon (≤7 days), or Expired (<today)
4. WHEN an admin uses search functionality THEN the system SHALL filter entries based on name or email
5. WHEN an admin clicks edit on an entry THEN the system SHALL open a modal with editable fields
6. WHEN an admin clicks delete on an entry THEN the system SHALL prompt for confirmation before removal
7. WHEN an admin adds a new entry THEN the system SHALL validate the data and save it to the database

### Requirement 3

**User Story:** As an admin, I want the system to automatically send email reminders to customers, so that they are notified before their insurance expires.

#### Acceptance Criteria

1. WHEN the system runs daily at 8 AM THEN it SHALL check all insurance entries for upcoming expirations
2. WHEN an entry expires in exactly 7 days THEN the system SHALL send an email reminder to the customer
3. WHEN sending emails THEN the system SHALL use Gmail SMTP with proper authentication
4. WHEN composing emails THEN the system SHALL include customer name, expiry date, and professional messaging
5. WHEN email sending fails THEN the system SHALL log the error and retry mechanism
6. WHEN emails are sent successfully THEN the system SHALL log the activity for admin review

### Requirement 4

**User Story:** As an admin, I want to access the application as a PWA, so that I can install it like a native app and use it offline when needed.

#### Acceptance Criteria

1. WHEN a user visits the application THEN the browser SHALL offer to install the PWA
2. WHEN the PWA is installed THEN it SHALL appear in the device's app drawer/start menu
3. WHEN the PWA is opened THEN it SHALL display with a native app-like interface
4. WHEN offline THEN the system SHALL cache essential UI components and display cached data
5. WHEN connectivity is restored THEN the system SHALL sync any pending changes

### Requirement 5

**User Story:** As an admin, I want a responsive and professional interface, so that I can efficiently manage the system on both desktop and mobile devices.

#### Acceptance Criteria

1. WHEN accessing the application on different screen sizes THEN the interface SHALL adapt responsively
2. WHEN viewing the dashboard table on mobile THEN it SHALL remain readable and functional
3. WHEN using modals and forms THEN they SHALL be touch-friendly and properly sized
4. WHEN the system provides feedback THEN it SHALL use toast notifications for success/error messages
5. WHEN displaying status information THEN it SHALL use color-coded indicators (green: active, yellow: expiring, red: expired)

### Requirement 6

**User Story:** As an admin, I want to configure system settings, so that I can customize reminder timing and email configurations.

#### Acceptance Criteria

1. WHEN an admin accesses settings THEN the system SHALL allow modification of reminder days (default: 7 days)
2. WHEN an admin updates email configuration THEN the system SHALL validate Gmail credentials
3. WHEN settings are changed THEN the system SHALL save the configuration and apply it to future operations
4. WHEN invalid settings are entered THEN the system SHALL display validation errors

### Requirement 7

**User Story:** As an admin, I want to view email activity logs, so that I can monitor the system's email sending performance and troubleshoot issues.

#### Acceptance Criteria

1. WHEN an admin accesses the logs page THEN the system SHALL display all email sending attempts
2. WHEN displaying logs THEN the system SHALL show timestamp, recipient, status (success/failure), and error details
3. WHEN filtering logs THEN the system SHALL allow filtering by date range and status
4. WHEN email sending fails THEN the system SHALL record detailed error information for troubleshooting