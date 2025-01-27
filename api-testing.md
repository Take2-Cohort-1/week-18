---
theme: ../take2-slidev-theme
class: text-center
highlighter: shiki
lineNumbers: false
info: |
  ## API Testing
drawings:
  persist: false
title: API Testing
---

## API Testing

---

# API Testing with Jest

- Why test APIs?

<v-click>

- Ensuring endpoints work as expected
- Catching regressions before production
- Automating with CI/CD
</v-click>

<!--
- Why test at all?
- Specifically, why test external or internal APIs?
-->

---

## Excursion: Deployment & CI/CD

- "Deploying" means running your new code live, e.g. on the internet
- Modern teams often deploy automatically when a dev pushes to git
  - This is called **Continuous Deployment** (CD)

- Before auto-deployment, _tests_ are run to ensure the code about to go live works as expected
  - This is called **Continuous Integration** (CI)

---

## Jest: Quick Intro

- A JavaScript testing framework
<v-click>

- Offers test runner, assertions, and more
- Zero config (in most cases)
- Three main functions: `describe`, `test` (or `it`), `expect`
</v-click>

<!--
- Jest is widely used, well-maintained
- Great ecosystem of plugins
-->

---

## Setup & Installation

When using `npm`, install jest as a _dev_ dependency

```sh
$ npm install --save-dev jest
```

- No need to do anything when using `bun`, it integrates
  the jest functionality
- Add `"test": "jest"` to scripts in `package.json`
- Optionally configure with `jest.config.js`

<!--
- Show `package.json` snippet
- Basic config
-->

---

## Basic Test Example

```js
// sum.js
export function sum(a, b) {
  return a + b;
}
```

```js
// sum.test.js
import { sum } from "./sum";

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});
```

<v-click>

- Run `npm test` / `bun test`
</v-click>

<!--
- Test is successful
- Example is straightforward
-->

---

## Testing Express APIs

- Start server
- Use `fetch` to call local endpoints
- Check response statuses, bodies

```js
// server.js
import express from "express";
const app = express();

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from API" });
});

export default app;
```

---

## Example API Test

```js
// server.test.js
describe("GET /api/hello", () => {
  it("should return the greeting message", async () => {
    const response = await fetch(`http://localhost:3000/api/hello`);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.message).toBe("Hello from API");
  });
});
```

---

## Coverage & Reports

- `--coverage` flag
- Generate coverage reports (lcov, text, HTML)
- Helps identify untested code paths

```sh
$ npm test -- --coverage
$ bun test --coverage
```

<!--
- Integrate with CI pipelines
- Use thresholds to ensure quality
-->

---

## Database Fixtures

- **What are fixtures?** Predefined data sets used during tests
- **Why use them?**  
  - Ensure predictable database state
  - Speed up test setup and teardown
  - Promote reproducible and isolated tests

<!--
- Think of fixtures as "known data" to start every test
- Avoid unpredictability from leftover data
-->

---

## Example: Loading a Fixture

```js
// test.js

test("GET /api/users returns fixture data", async () => {
  await User.insertMany([{ name: "Frodo" }, { title: "Bilbo" }]);
  ...
});
```

- Ensure tests start from a known data state
- Consider teardown or truncation after each test (see `api.test.js`)

<!-- - Minimizes side effects between tests - Some use in-memory DBs (sqlite) or mocking -->

