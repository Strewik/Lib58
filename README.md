**Lib58**
Lib58 is a library management sysystem to manage books and users.
the system is built in react vite frontend and Django restframework in the backend. Authentication by JWT.
A user can sign themselves up but the accounts are created as suspended[inactive] until activated[approved] by the staff.
When staff or admin logs in the are redirected to the admin dashboard[dashboard] where they have admin level privileges.
When a client logs in they are redirected  to the client dashboard where they can only see their their account information.
An admin can view statistics on the dashboard. can view and edit users; view, edit, add and delete, issue and return books. 

**Setup** 
git clone:
cd frontend && npm install 
run: npm run dev

cd backend && pip install -r requirements.txt
run: python manage.py runserver

sample logins: email: john@mail.com  password: John

deployed app: https://lib58-1.onrender.com/