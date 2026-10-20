# UserPulse &mdash; Responsive User Management Application

A responsive, feature-rich **User Management Application** built with **React 19**, **Vite**, **Tailwind CSS v4**, **React Router DOM v7**, **Lucide React**, **React Hot Toast**, and **Axios**. The application integrates directly with the [DummyJSON API](https://dummyjson.com), paired with a centralized React Context state engine that seamlessly handles mock API limitations.

---

## 🚀 Key Features

- **📊 Comprehensive Directory Dashboard (`/`)**:
  - Live metric cards showing Total Users, Gender distribution (Male / Female), and quick action controls.
  - Responsive data table displaying user Avatar, Full Name, Age, Gender badge, Email, Company, and Action controls.
  - **Live Search**: Instant real-time filtering across First Name and Last Name with quick clear.
  - **Multi-Column Sorting**: Sort by **Name** (A&rarr;Z, Z&rarr;A), **Age** (youngest / oldest), or **Email** (A&rarr;Z, Z&rarr;A) directly via dropdown or by clicking the interactive table headers.
  - **Gender Filtering**: Filter by Gender (`All`, `Male`, `Female`).
  - **View Switcher**: Toggle between **Data Table View** and **Responsive Grid Cards View**.
  - **Pagination**: Configurable items per page (5, 10, 20, 50) with current range indicators and quick pagination controls.
  - **Empty States**: Helpful zero-state with a one-click "Reset Filters" action.

- **👤 Comprehensive User Details Profile (`/user/:id`)**:
  - Hero profile card with avatar, full name, maiden name, user ID, role, and company.
  - **Personal & Physical Metrics**: Age, Birth Date, Blood Group, Height (cm), Weight (kg), Eye Color, Hair characteristics.
  - **Contact & Network**: Email (clickable `mailto`), Phone (clickable `tel`), IP Address, MAC Address.
  - **Residential Address**: Full address (Street, City, State, Postal Code, Country) and geographical coordinates (Lat/Lng).
  - **Company & Organization**: Company Name, Title, Department, and University.

- **➕ Add New User Form (`/create`)**:
  - Input fields with client-side validation:
    - **First Name** (Required, minimum 2 characters)
    - **Last Name** (Required, minimum 2 characters)
    - **Age** (Required, positive integer between 1 and 120)
    - **Email** (Required, RFC-compliant format)
    - Gender, Phone, Company, Job Title, Street Address, City (Optional/Extended attributes)
  - Inline error notifications, disabled states during submission, and loading spinner.
  - Submits a `POST` request to `https://dummyjson.com/users/add`.
  - On success: Appends the newly created user to the local state, displays a toast notification, and navigates back to the Dashboard.

- **✏️ Edit User Form (`/edit/:id`)**:
  - Automatically fetches and pre-fills existing user details from context state or the API.
  - Full client-side validation ensuring data integrity.
  - Submits a `PUT` request to `https://dummyjson.com/users/{id}`.
  - On success: Immediately updates the user in the local state, displays a toast notification, and navigates back to the Dashboard.

- **🗑️ Delete User & Confirmation Modal**:
  - Accessible confirmation modal preventing accidental deletions.
  - Submits a `DELETE` request to `https://dummyjson.com/users/{id}` and updates local state.

---

## 💡 Crucial Mock API Handling & Architecture

### The Limitation of DummyJSON
Because [DummyJSON](https://dummyjson.com) is a mock testing API, `POST /users/add`, `PUT /users/{id}`, and `DELETE /users/{id}` requests return mock JSON responses (such as a generated `id: 209`), but **they do not persist records to the server database**. Consequently:
- A subsequent `GET /users` from the server will not include newly added users.
- A subsequent `GET /users/209` or `PUT /users/209` will return `404 Not Found` from DummyJSON.

### How Our Application Solves This
To deliver an authentic, seamless user experience:
1. **Centralized React Context (`UserContext`)**:
   - The initial list of users is fetched from `GET /users?limit=30` and stored in a shared React Context state.
   - When a user is added (`addUser`), the returned user object from the `POST` response is prepended to the local state array.
   - When a user is edited (`updateUser`), the local state array is updated in-memory with the modified attributes.
   - When a user is deleted (`deleteUser`), the record is filtered out of the local state.
2. **Resilient User Lookup (`getUserById`)**:
   - When viewing (`/user/:id`) or editing (`/edit/:id`), the application checks the **local state first**.
   - If the user was recently created or modified in the current session, their latest data is loaded immediately without failing.
   - If the user is not found in local memory (e.g., deep direct link), it gracefully falls back to fetching from `GET /users/{id}`.
3. **Local Storage Synchronization**:
   - State updates are cached in browser `localStorage`, allowing user-created records and modifications to persist even across page reloads.
   - A **Reset Data** button in the top navigation bar allows resetting the local dataset back to the initial DummyJSON records at any time.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Component framework and UI runtime |
| **Vite 8** | Ultra-fast build tool and local development server |
| **Tailwind CSS v4** | Modern utility-first styling engine with `@tailwindcss/vite` |
| **React Router DOM v7** | Client-side routing with clean URL parameters |
| **Lucide React** | Modern iconography |
| **React Hot Toast** | Non-intrusive toast notification alerts |
| **Axios** | HTTP client for REST API communication |

---

## 📂 Project Structure

```
user-management-application/
├── index.html                   # HTML entry point with Google Fonts & SEO metadata
├── vite.config.js               # Vite config with React & Tailwind plugins
├── package.json                 # Project dependencies & scripts
└── src/
    ├── api/
    │   └── userApi.js           # Axios client & DummyJSON API service methods
    ├── context/
    │   └── UserContext.jsx      # Global state provider for mock API sync & persistence
    ├── components/
    │   ├── Navbar.jsx           # Top header navigation, metrics badge & reset button
    │   ├── Footer.jsx           # Clean footer with system status indicator
    │   ├── UserTable.jsx        # Data table with avatars, sortable headers & action buttons
    │   ├── UserCard.jsx         # Card layout for responsive / grid view
    │   ├── LoadingSpinner.jsx   # Skeleton loaders and spinning indicators
    │   ├── EmptyState.jsx       # Zero-match fallback with filter reset
    │   └── DeleteConfirmModal.jsx # Accessible delete confirmation modal
    ├── pages/
    │   ├── Dashboard.jsx        # Directory route (/) with search, sort, filter & pagination
    │   ├── UserDetails.jsx      # Profile details route (/user/:id)
    │   ├── CreateUser.jsx       # Add user form route (/create)
    │   ├── EditUser.jsx         # Edit user form route (/edit/:id)
    │   └── NotFound.jsx         # 404 error page with navigation back to dashboard
    ├── App.jsx                  # Main router setup & toast notifications container
    ├── main.jsx                 # React root element & UserProvider wrapper
    └── index.css                # Tailwind CSS v4 styling & typography utilities
```

---

## ⚙️ Installation & Running Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **NPM**: v9.0.0 or higher

### Steps

1. **Clone or Navigate to the Directory**:
   ```bash
   cd /home/user/user-management-application
   ```

2. **Install Dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Build for Production**:
   ```bash
   npm run build
   ```

5. **Preview the Production Build**:
   ```bash
   npm run preview
   ```

---

## 🧪 Testing Workflows Walkthrough

1. **Search**:
   - Type any first or last name (e.g. `Emily` or `Williams`) in the search bar.
   - The table filters immediately to matching results.
2. **Sort**:
   - Click the "User / Name", "Age", or "Email" table headers to toggle Ascending / Descending order.
3. **Filter**:
   - Select `Male` or `Female` from the Gender dropdown to filter the active records.
4. **Create User**:
   - Click **Add User**, submit with empty fields to observe inline validation messages.
   - Complete required fields and click **Create User** &mdash; a success toast displays and the new user is prepended to the top of the table.
5. **View Details**:
   - Click the Eye icon on any user to view their detailed metrics, address, network IP, and company details.
6. **Edit User**:
   - Click the Pencil icon on any user, modify values, and click **Save Changes** &mdash; the updated values reflect immediately on the dashboard.
