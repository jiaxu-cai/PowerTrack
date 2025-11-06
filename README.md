# PowerTrack

## Deployed Application URL
https://powertrack-50d1f.web.app/

## Public Git Repository
https://github.com/jiaxu-cai/PowerTrack

## Video Link:
https://youtu.be/2st5jCFHLIE


## Setting Up

### Prerequisites
- Node.js (version ^20.19.0 or >=22.12.0) - [Download Node.js](https://nodejs.org/)
- npm (comes with Node.js)

### Setup Steps

1. **Extract the submission zip file** to your desired location.

2. **Navigate to the application directory:**
   - Open a terminal/command prompt
   - Change directory to `PowerTrack/main` (where `index.html` and `package.json` are located)

3. **Install dependencies:**
   ```bash
   npm install
   ```
   This will install all required packages including Vue.js, Firebase, and other dependencies.

4. **Environment Configuration (if running locally):**
   - The application uses Firebase for authentication and data storage
   - For local development, you may need to configure Firebase environment variables
   - The deployed version already has these configured

## How to Run Locally

**Using Vite**
1. From the `PowerTrack/main` directory, run:
   ```bash
   npm run dev
   ```
2. The application will start on a local development server (typically `http://localhost:5173`)
3. Open the provided URL in your browser


## Test Accounts
Test user credentials are provided in the presentation slides.

## .env
.env file values are provided in the presentation slides.