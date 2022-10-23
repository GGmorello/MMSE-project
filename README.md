# MMSE-project
Final Project for the course Modern Methods in Software Engineering (ID2207)

## Get started

To run the app, you wil have to start both the front-end and backend projects separately.

### Starting the front-end

To start, make sure you modify the `APP_URL` constant in the `frontend/src/components/common/WebService.ts` to the correct value, depending on the environment you're running on:

- On Mac, set this to `http://127.0.0.1:5000/`
- On Windows, set it to `http://localhost:5000/`

Next, make sure you install the latest version of node/NPM on your machine.

The most convenient tool for this is `nvm`, which can be downloaded using `homebrow` or download NVM for Windows.

The versions we've used in the project are the following:
- `node -v`

v17.3.0
- `npm -v`

8.3.0

After installing both node and NPM, navigate to the `frontend` folder and run `npm ci`, which will install all packages related to the project.

Continue by running `npm run start`, which should start the app in your browser. Voilá, you have the frontend up and running!

### Starting the back-end

We need to install some packages in order to run the backend project as well.

When in the root of the project, run `pip install -r requirements.txt`. (If you have pip3 installed, write `pip3` instead of `pip`).

After installing the packages, you can run the app by executing `flask --app flaskr --debug run`. Voilá, that should be enough for the backend to run!

Some known problems when running the backend:
- The filepath for the `schema.sql` is invalid

We haven't figured out exactly why this happens, and seems to work differently in different environments

To fix it, modify the `flaskr/db.py` file, replacing:
- `with open(file_path + '/schema.sql') as f:`

with some absolute folder path to the `schema.sql` file.

It might also work to write `open('./flaskr/schema.sql)` - assuming you're running the project while in the project root.

## Debugging the app

Feel free to login and try the app with different users! All credentials can be found in the `schema.sql` file - and I'll also include them here!

- 'SVM', 'SVM', SERVICE_MANAGER
- 'PDM', 'PDM', 'PRODUCTION_MANAGER'
- 'HRM', 'HRM', 'HR_MANAGER'
- 'AUS', 'AUS', 'AUDIO_SPECIALIST'
- 'TOPC', 'TOPC', 'TOP_CHEF'
- 'ADM', 'ADM', 'ADMINISTRATION_MANAGER'
- 'FMM', 'FMM', 'FINANCIAL_MANAGER'
- 'CSS', 'CSS', 'CUSTOMER_SERVICE'
- 'CLIENT', 'CLIENT', 'CLIENT'
- 'SCSO', 'SCSO', 'SENIOR_CUSTOMER_SERVICE_OFFICER'
