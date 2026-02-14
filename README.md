# LinkVault 🔐

Securely share **text or files via temporary links** with expiry, password protection, and self-destruct view.

---

## Live Demo

- App: `https://linkvault-frontend.vercel.app/`

---

## Features

- Upload **text or file**
- Secure **shareable link**
- **Expiry-based auto delete**
- **Password-protected links**
- **One-time view (self-destruct)**
- File **preview + download**
- View counter
- Drag & Drop upload
- File size validation
- Rate limiting (anti-abuse)
- Logging & health endpoint
- Clean responsive UI

---

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Fetch API

### Backend
- Node.js
- Express
- MongoDB Atlas
- GridFS (file storage)
- Multer (upload)
- bcrypt (password hashing)
- express-rate-limit
- morgan logging

### Deployment
- Frontend → Vercel
- Backend → Railway
- Database → MongoDB Atlas

---

## How It Works

1. User uploads text/file  
2. Backend generates **unique linkId**  
3. Content stored in MongoDB (GridFS for files)  
4. Optional:
   - Expiry time
   - Password protection
   - One-time view  
5. Secure link returned to user  
6. On access:
   - Expiry validated
   - Password validated
   - View counter updated
   - File streamed or text returned  

---

## Usage

### Upload

1. Select **Text** or **File**
2. Enter content or choose file
3. Choose expiry time
4. (Optional) Set password
5. (Optional) Enable **View only once**
6. Click **Generate Link**
7. Share generated link

---

### View Content

1. Open link
2. If password protected → enter password
3. View content or preview file
4. Download if needed
5. If one-time → link expires after first view

---

## Setup (Local)

### Backend

```bash
cd backend
npm install
