# Troubleshoot: `python` not found

## Symptom
- `python manage.py runserver`
- error: `Python was not found; run without arguments to install from the Microsoft Store, or disable this shortcut...`

## Fix (Windows 11)
1. Install Python
   - Download/install **Python 3.x** from https://www.python.org/downloads/
   - During install, tick: **“Add Python to PATH”**.

2. Verify from a *new* terminal
   - Open a new VSCode terminal or restart terminal.
   - Run:
     - `python -V`
3. If `python` still isn’t found, ensure PATH is correct
   - In Windows search: **Environment Variables**
   - Edit **Path** and ensure something like:
     - `C:\Users\<you>\AppData\Local\Programs\Python\Python3x\`
     - `...\Scripts\`

4. Then run Django again
   - `cd c:/Users/HomePC/Desktop/DELUXE-BOOKING-TICKET`
   - `python -m pip install -r requirements.txt`
   - `python manage.py migrate`
   - `python manage.py runserver`

## After Python works
To move SQLite -> PostgreSQL:
1. Create Postgres DB and set `DATABASE_URL`.
2. Run:
   - `python manage.py makemigrations`
   - `python manage.py migrate`
3. Copy data (example):
   - `python manage.py dumpdata --indent 2 --exclude contenttypes --exclude auth.permission > data.json`
   - `python manage.py loaddata data.json`

> Note: Without working Python executable, migrations/data copy cannot run.
