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

## How to Upload to GitHub

1.  **Create a New Repository**:
    - Go to [GitHub.com](https://github.com/) and click the **+** icon -> **New repository**.
    - Name it (e.g., `movie-dashboard`).
    - Do *not* check "Initialize with README" (since we already have one).
    - Click **Create repository**.

2.  **Upload Files**:
    - Open your terminal in this project folder.
    - Run the following commands:
    ```bash
    git init
    git add .
    git commit -m "Initial commit of Movie Dashboard"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/movie-dashboard.git
    git push -u origin main
    ```
    *(Replace `YOUR_USERNAME` with your actual GitHub username and use the URL provided by GitHub after step 1)*.

    **Alternative (Web Upload)**:
    - If you are uncomfortable with the command line, you can simply click "uploading an existing file" on the GitHub repository page and drag-and-drop all files (`index.html`, `style.css`, `script.js`, `README.md`) there.
