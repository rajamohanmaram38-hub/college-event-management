# 🔥 Firebase Connection Guide for CampusPulse

This guide details all credentials needed to connect both the **Frontend Client** and **Backend Server** to Firebase.

---

## 📋 Summary of Required Credentials

### 1. For Frontend Client (`client/`) — Web App Credentials
These allow the browser to connect to Firebase Authentication and Cloud Firestore:

| Variable | Description | Where to Find |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Public Web API Key | Project Settings → General → Your apps |
| `VITE_FIREBASE_AUTH_DOMAIN` | `[project-id].firebaseapp.com` | Project Settings → General → Your apps |
| `VITE_FIREBASE_PROJECT_ID` | Your Firebase Project ID | Project Settings → General |
| `VITE_FIREBASE_STORAGE_BUCKET` | `[project-id].appspot.com` | Project Settings → General → Your apps |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Cloud Messaging Sender ID | Project Settings → Cloud Messaging |
| `VITE_FIREBASE_APP_ID` | Web Application ID (`1:xxx:web:xxx`) | Project Settings → General → Your apps |
| `VITE_FIREBASE_MEASUREMENT_ID` | Google Analytics ID (Optional) | Project Settings → General → Your apps |

File location: `client/.env`

---

### 2. For Backend Server (`server/`) — Admin Service Account
These give the server privileged admin access for server-side verification and Firestore operations:

**Option A (Recommended & Easiest):**
Download your private key file as `serviceAccountKey.json` and place it at:
```
server/serviceAccountKey.json
```
*(This file is pre-configured in `.gitignore` to prevent secret leaks)*

**Option B (Environment Variables):**
| Variable | Description |
|---|---|
| `FIREBASE_PROJECT_ID` | Your Project ID |
| `FIREBASE_CLIENT_EMAIL` | Service Account email address |
| `FIREBASE_PRIVATE_KEY` | RSA Private Key (enclosed in quotes with `\n`) |

File location: `server/.env`

---

## 🛠️ Step-by-Step Setup in Firebase Console

### Step 1: Create a Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (or select an existing one).
3. Name it (e.g. `campuspulse-event-portal`) and continue.

### Step 2: Register Web App (For Frontend Credentials)
1. In your project dashboard, click the **Web icon** (`</>`).
2. App nickname: `CampusPulse-Web`.
3. Click **Register app**.
4. You will see a `firebaseConfig` block:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "campuspulse-xxx.firebaseapp.com",
     projectId: "campuspulse-xxx",
     storageBucket: "campuspulse-xxx.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```
5. Copy these values into your `client/.env` file.

### Step 3: Enable Authentication & Firestore
1. In the left sidebar:
   - Go to **Build** → **Authentication** → Click **Get Started** → Enable **Email/Password**.
   - Go to **Build** → **Firestore Database** → Click **Create database** → Select **Production mode** (or Test mode).

### Step 4: Download Service Account Key (For Backend Credentials)
1. Click the ⚙️ **Project settings** gear in the sidebar.
2. Select the **Service accounts** tab.
3. Click **Generate new private key** → confirm by clicking **Generate key**.
4. Rename the downloaded file to `serviceAccountKey.json`.
5. Place it directly inside the `server/` directory:
   ```
   college-event-management/
   └── server/
       └── serviceAccountKey.json
   ```

### Step 5: (Optional) Seed Firestore Database
Once you have added `serviceAccountKey.json`, run:
```bash
node database/seedFirestore.js
```
This will automatically upload all demo events, students, and registrations directly into your Firestore collections!
