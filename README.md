# PopCornTime - Trending Movie Dashboard

A premium, dark-themed dashboard to view trending movies, powered by The Movie Database (TMDb) API.

## Features
- **Trends**: Displays the top trending movies of the week.
- **Filtering**: Dynamic genre buttons to filter the displayed movies.
- **Interactive UI**: Hover effects, tooltips, and responsive grid layout.
- **Instant Search**: Loads data instantly using your API key.

## Setup Instructions

### 1. Get a TMDb API Key
This project requires an API Key from TMDb to fetch data.
1.  Go to [The Movie Database (TMDb)](https://www.themoviedb.org/).
2.  Sign up or Login.
3.  Go to **Settings** -> **API**.
4.  Create a new API Key (Developer).
5.  Copy your **API Key String**.

### 2. Run Locally
You can simply open `index.html` in your browser, but for the best experience (and to avoid some browser security restrictions), it's better to use a local server.

**Option A: Python (easiest)**
If you have Python installed, open your terminal/command prompt in this folder and run:
```bash
python3 -m http.server
```
Then open `http://localhost:8000` in your browser.

**Option B: VS Code Live Server**
1.  Open this folder in VS Code.
2.  Install the "Live Server" extension.
3.  Right-click `index.html` and select "Open with Live Server".

### 3. Usage
1.  When the page loads, paste your **TMDb API Key** in the input field at the top.
2.  Click **Load Dashboard**.
3.  Browse movies and use the genre buttons to filter!
