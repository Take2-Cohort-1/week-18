# Project Brief: Building a Todo Backend with Express.js and MongoDB

Your task is to build a backend service for managing a "todos" application using
Express.js and MongoDB. This backend should provide a suite of RESTful API
endpoints that handle CRUD operations for two main resources: "todos" and their
nested "attachments". You will be provided with a suite of API tests using `bun`
to verify that your implementation meets the functional requirements.

This project is designed to be completed within two days.

For every step:

- Read the brief and acceptance criteria. If you're unsure what to do, get help.
- The tests use the `NODE_ENV`
- Run the tests for your current step using `bun test` to ensure your
  implementation meets the requirements. Invoke using:
  ```sh
    NODE_ENV=test bun test --bail --preload ./test_helper.js
  ```
  - `NODE_ENV=test`: sets an ENV variable before running any tests
  - `--bail`: abort on first failed test
  - `--preload`: execute this file (`./test_helper.js`) before running the
    tests.
- When you've fulfilled the acceptance criteria, make a commit and push it to
  GitHub. This means one commit per step.
- In the associated GitHub project board, move your card.

## Step 1: Set Up Your Project

- Create a new project & repo: `todo-express`
- Use this getting started guide: https://bun.sh/guides/ecosystem/express
- Create a `index.ts` file as the base file for your server. Using TypeScript is optional.
- Install necessary dependencies, including Express, and mongoose
- Install Docker Desktop if you have not yet; then to start MongoDB in a
  container:
  ```sh
  docker pull mongo:latest
  docker run -d --name mongodb -p 27017:27017 mongo
  ```
- `docker stop mongodb` to stop the container
- `docker start mongodb` to start the container again, e.g. after a reboot
- Check if mongodb is running. The following command should output a 1 to the
  terminal: `docker exec mongodb mongosh --eval 'db.runCommand("ping").ok' localhost:27017`
- Run your server with `NODE_ENV=test bun --watch index.ts`. This will restart
  the server when you make changes.
- Make sure your server uses `NODE_ENV` to determine which DB it connects to.
  Could be as simple as:
  ```js
  const dbName = process.env.NODE_ENV == "test" ? "todos_test" : "todos_dev";
  ```
- When testing, use `todos_test` as your database.
- Run your tests with `NODE_ENV=test bun test --preload ./test_helper.js`.
  Read this file to understand what happens before every test run.

## Step 2: Implement the Todo Resource

- Create CRUD endpoints for the "todo" resource.
- Properties for "todo":
  - `title` (string, required, must be >= 2 characters long)
  - `description` (string, optional)
  - `due_at` (date, optional, must be a valid date if provided)

### Acceptance Criteria (API Tests)

- Create: Create a new "todo" with valid data.
- Read Collection: Fetch all "todos" and validate the correct data is returned.
- Read Single Resource: Fetch a specific "todo" by its ID.
- Update: Update a "todo" and confirm changes.
- Delete: Delete a "todo" and ensure it is no longer available.

## Step 3: Add Nested Attachments to Todos

- Implement CRUD operations for "attachments" as a nested resource of a "todo".
- Properties for "attachment":
  - `filename` (string, required, the original filename)
  - `filesize` (number, required)
  - `storage_url` (string, required, representing where the file is stored)

### Acceptance Criteria (API Tests)

- Create: Create a new attachment for an existing "todo".
- Read Collection: List attachments for a "todo" and verify correct data.
- Read Single Resource: Fetch a specific attachment.
- Update: Update an attachment's properties.
- Delete: Delete an attachment and confirm its removal.
- Handle Conflicts: Attempt to upload an attachment with a filename that already
  exists and validate the correct response (422)

## Step 4: Full Validation and Error Handling

- Ensure that input data is validated:
  - `title` is required when creating a todo.
  - `due_at` must be a valid date if provided.
  - Attachments must include `filename`, `filesize`, and multipart data when
    created. `storage_url` must not be given in the POST request.
  - Attachments must include `filename`, `filesize`, and `storage_url` when
    rendered.
- Implement appropriate error handling and responses, i.e.
  - 400 Bad Request for syntactically incorrect data such as malformed JSON
  - 404 Not Found for non-existing resources
  - 422 Unprocessable Entity for semantically invalid data, such as an invalid
    date format for `due_at` or a missing key.

### Acceptance Criteria (API Tests)

(Note: you must write these API tests yourself)

- Test the `POST /posts` endpoint with invalid data (e.g., missing `title` or
  malformed `due_at`).
- Error output should be JSON in the following form:
  ```json
  { "errors": { "title": "required", "due_at": "invalid" } }
  ```
- Verify the response contains the correct error messages.
- Attempt to access a "todo" or "attachment" that does not exist and verify that
  the response is a 404.

## Step 5: Adding a feature: virtual attribute "overdue"

Your product manager, in their infinite wisdom, wants a new feature: when the
`due_at` date is in the past, the API should add a `past_due` boolean. If the
date’s in the past, it’s true; if not, false. And of course, they don’t want it
saved in the database, because why would we store useful information? No, it’s a
"virtual" attribute—like the feature itself might be soon.

### Acceptance Criteria

- All relevant endpoints should return the new `past_due` boolean.
- The feature must be covered by API tests.
- Your commit must include the feature and tests, as well as a good commit
  message.

## Step 6: Even more API testing

Think about which behaviour of your API is not under test yet. Add some
appropriate tests.

### Acceptance Criteria

- Modify or create at least two API tests.
- Find the problem with running the current API test suite repeatedly.

## Step 7: Adding a feature: attribute "completed"

Your product manager, always on the cutting edge of groundbreaking ideas, now
wants a new attribute: `completed.` It’s a boolean, because nothing says
innovation like true or false. If something’s done, it’s true; if not, false.
And naturally, it’ll need to live in the database because apparently, this one
_is_ important enough to keep around. Groundbreaking stuff here.

You get a feeling that this feature isn't quite finished so you make it a point
to ask questions around how the system should behave now.

### Acceptance Criteria

- Ask the product manager (on Slack) a relevant question about how the feature
  works.
- All relevant endpoints should accept and return the new `completed` boolean.
- The feature must be covered by API tests.
- Your commit must include the feature and tests, as well as a good commit
  message.
