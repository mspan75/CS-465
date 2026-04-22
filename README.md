Here’s a tightened version that keeps your content intact but trims repetition and sharpens phrasing:

---

# Travlr Getaways — CS-465 Full Stack Development I

**Michael Spaniolo**
**Southern New Hampshire University — CS-465**
**Instructor: Kaan Esendemir**

A full-stack MEAN application built over the semester: a customer-facing Express site using Handlebars, a RESTful API backed by MongoDB, and an Angular SPA for admin CRUD. Write operations are protected with JWT authentication and salted, hashed passwords.

**Stack:** MongoDB · Express · Angular · Node.js
**Auth:** Passport.js (local) · JWT · PBKDF2 / SHA-512

---

## Architecture

### Frontend Comparison: Express vs Angular SPA

This project includes two frontends with fundamentally different rendering models.

The customer-facing app (`/app_server`) is server-rendered using Express and Handlebars. Requests like `/travel` trigger a controller that fetches data from `/api/trips`, injects it into a template, and returns a fully rendered HTML page. Each navigation results in a full reload.

The admin app (`/app_admin`) is an Angular SPA. The server delivers a minimal HTML shell and JavaScript bundle; Angular handles rendering in the browser and communicates with the API via JSON. Navigation updates the view without reloading the page, and validation runs client-side. The result is a faster, more app-like experience suited for administrative workflows.

Both frontends share the same backend but consume data differently. Express interacts directly with Mongoose models, while Angular communicates exclusively through the API. This separation makes the backend extensible to other clients, such as mobile apps.

### Why MongoDB / NoSQL?

Trip data is naturally document-oriented (`code`, `name`, `length`, `start`, `resort`, etc.) and does not require relational joins. MongoDB fits this structure well, storing each trip as a single document.

Using JavaScript across the stack simplifies data flow: Mongoose returns JavaScript objects, Express serializes them as JSON, and Angular consumes them as TypeScript interfaces. This avoids impedance mismatch between relational and object-based data models. MongoDB also supports horizontal scaling, allowing growth without schema redesign.

---

## Functionality

### JavaScript vs JSON

JavaScript is a programming language; JSON is a data format. JSON is derived from JavaScript object syntax but only supports data—no functions, comments, or execution logic.

In this app, JSON serves as the communication layer between Angular and Express. The frontend sends JSON in requests, Express parses it into JavaScript objects, Mongoose validates it, and MongoDB stores it as BSON. Responses follow the reverse path. JSON ensures both environments agree on data structure.

### Refactoring & Reusability

A key refactor was extracting a reusable `TripCardComponent`. Instead of rendering trips inline, the parent now uses a simple `*ngFor`, while the card handles its own structure, styling, and logic via `@Input()`.

This centralization improves maintainability: updates to layout or behavior propagate everywhere. For example, login-gated UI logic lives within the component and uses `AuthenticationService`, ensuring consistent behavior across the app.

Authentication was also refactored into a service layer. `AuthenticationService` manages token storage and login state (`saveToken`, `getToken`, `isLoggedIn`, `logout`). A `JwtInterceptor` automatically attaches the `Authorization` header to outgoing requests, removing duplication and enforcing consistency at the HTTP layer.

---

## Testing

### Endpoints, Methods, and Security

Trips endpoints:

* `GET /api/trips` — list all (public)
* `GET /api/trips/:tripCode` — read one (public)
* `POST /api/trips` — create (JWT required)
* `PUT /api/trips/:tripCode` — update (JWT required)
* `DELETE /api/trips/:tripCode` — delete

Auth endpoints:

* `POST /api/register` — create user, returns JWT
* `POST /api/login` — authenticate, returns JWT

Read operations are public; write operations are protected by `authenticateJWT` middleware. It extracts the Bearer token, verifies it with `jwt.verify()` and the server’s `JWT_SECRET`, and either allows the request or returns a 401.

Backend testing was done with Postman. I verified responses, token validity via jwt.io, and correct enforcement of protected routes. Requests without tokens—or with tampered tokens—returned 401 as expected.

Frontend testing used the browser’s Network tab. I observed request/response cycles, confirmed token handling via the interceptor, and validated UI behavior tied to authentication state. Login showed admin controls; logout removed them and cleared the token.

Authentication adds complexity: testing must cover valid, missing, expired, and malformed tokens. Token expiration (1 hour) also introduces time-based edge cases.

---

## Reflection

### Impact on Professional Goals

I entered CS-465 with a cybersecurity focus but limited understanding of application internals. This course closed that gap.

I now understand request handling, validation flow, JWT signing/verification, CORS, and how frontend and backend systems interact. I also understand the cryptographic foundations of authentication: salted hashes, PBKDF2, and why plaintext passwords are never stored.

These skills directly support roles in SOC analysis, vulnerability management, and GRC. I can now analyze systems at a deeper level, identify risks, and communicate effectively with developers.

There are still gaps: RxJS is not yet intuitive, Angular change detection needs refinement, and type safety could be improved. I also identified a security oversight—the DELETE endpoint should be protected by JWT.

What I gained is the ability to build and reason about a full-stack system, including its security posture. Understanding each layer—from frontend interaction to database storage—makes complex systems manageable and analyzable.

---

## Running the Project

### Prerequisites

* Node.js (LTS)
* MongoDB (local or Atlas)
* Angular CLI

### Environment

Create a `.env` file in the project root with:


```
JWT_SECRET=your_secret_here
```

### Backend + customer site

```bash
npm install
npm start
```

Server runs on `http://localhost:3000`.

### Admin SPA

```bash
cd app_admin
npm install
ng serve
```

Admin app runs on `http://localhost:4200` and talks to the API at `http://localhost:3000/api`.

---

**Repository:** [github.com/mspan75/CS-465](https://github.com/mspan75/CS-465)
