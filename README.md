# Travlr Getaways — CS-465 Full Stack Development I

**Michael Spaniolo**
**Southern New Hampshire University — CS-465**
**Instructor: Kaan Esendemir**

A full stack MEAN application built across the semester: a customer-facing Express site with Handlebars templates, a RESTful API backed by MongoDB, and an Angular single-page application for administrative CRUD. JWT authentication with salted, hashed passwords protects the write endpoints.

**Stack:** MongoDB · Express · Angular · Node.js
**Auth:** Passport.js (local strategy) · JSON Web Tokens · PBKDF2 / SHA-512 password hashing

---

## Architecture

### Comparing the frontends: Express HTML, JavaScript, and the SPA

This project has two frontends living in the same repository, and they render content in fundamentally different ways.

The customer-facing side in `/app_server` is a traditional **server-rendered website** built with Express and Handlebars. When a customer hits `/travel`, the Express controller queries MongoDB through the `/api/trips` endpoint, passes the returned data into a Handlebars template, and ships a complete HTML page to the browser. The browser's job is small — display what it was given. Each navigation is a fresh round trip and a full page reload. This is simple, SEO-friendly, and works even if JavaScript is disabled, which is appropriate for a public marketing site.

The admin side in `/app_admin` is an **Angular single-page application**. The server sends one nearly-empty HTML shell plus a JavaScript bundle, and from that point on the browser is in charge. Angular builds the UI in the DOM itself and only contacts the server when it needs to read or write data through the API. Navigation between the trip listing, add-trip, and edit-trip views happens in place — the URL changes, components swap, but no full page reload occurs. Form validation runs instantly in the browser because it doesn't wait on a server round trip. The application feels more like a desktop program than a website, which is the right fit for staff who spend most of their day performing data-management tasks.

The two frontends share a backend but consume data in completely different ways. Express talks directly to Mongoose models inside the same Node process. Angular knows nothing about the database — it only knows how to speak JSON to the API. That clean separation is what makes the API layer extensible: the same endpoints could feed a mobile app later without touching the server logic.

### Why NoSQL / MongoDB?

Trip records in this application are essentially self-contained documents — `code`, `name`, `length`, `start`, `resort`, `perPerson`, `image`, `description` — that don't need to be joined against other tables to be useful. A document store fits that shape naturally. MongoDB lets each trip live as a single BSON document, and Mongoose gives us a schema layer on top so we still get field validation and type coercion without giving up the flexibility of a schemaless engine.

The other reason is JavaScript end-to-end. Mongoose returns plain JavaScript objects. Express sends them out as JSON. Angular consumes them as TypeScript interfaces. There is no impedance mismatch between rows-and-columns and objects-and-arrays — the data travels in the same shape from database to browser. MongoDB also scales horizontally, which means additional servers can be added later as the user base grows, without redesigning the schema.

---

## Functionality

### JavaScript vs JSON

This is a distinction that confused me early and is worth being precise about. **JavaScript is a programming language** — it has functions, loops, classes, closures, and an execution context. **JSON (JavaScript Object Notation) is a data format** — a text-based specification derived from JavaScript's object literal syntax, but stripped of everything that isn't data. JSON has no functions, no comments, and strict rules about quoted keys and allowed value types.

The practical consequence is that JSON is the common language between the Angular frontend and the Express backend. When the admin SPA wants to add a trip, it serializes a TypeScript object into a JSON string and sends it in the HTTP request body. Express parses that JSON back into a JavaScript object on the server, Mongoose validates it against the Trip schema, and MongoDB stores it as BSON (a binary-encoded superset of JSON). On the way back out, the reverse happens. JSON is the neutral wire format that lets two separate JavaScript runtimes — one in the browser, one in Node — agree on what a "trip" is.

### Refactoring and reusable components

The clearest refactor in the project was extracting the `TripCardComponent`. Early on, the trip-listing view rendered each trip inline in the template. Once I pulled the card out into its own component with an `@Input() trip: any` binding, the parent listing shrank to a single `*ngFor` loop, and the card could be reused anywhere a trip needed to be displayed. One component, one template, one stylesheet — consumed in multiple places.

The benefit is not just less code. It is that a bug fix or a style change happens in one file and propagates everywhere the component is used. A show/hide rule for the "Edit" button, for instance, lives inside the card itself and consults the `AuthenticationService` — so every card in the app automatically respects the same login-gated behavior without the parent having to know or care.

I also refactored authentication into a dedicated service layer. The login component originally mixed HTTP calls with token storage; I moved those concerns into the `AuthenticationService`, which now owns `saveToken`, `getToken`, `logout`, and `isLoggedIn`. Components across the app — the navbar, the trip card, the login form — all consult the same service, so there is one source of truth about whether an admin is authenticated. Alongside that, the `JwtInterceptor` (in `utils/jwt-interceptor.ts`) sits in the middle of every outgoing HTTP request and attaches the `Authorization: Bearer <token>` header automatically. Individual service methods don't have to remember to attach the token — the interceptor does it once, for everything. This is the reusability principle operating at the request layer instead of the UI layer.

---

## Testing

### Methods, endpoints, and security

A REST API is defined by its endpoints and the HTTP methods you can use against them. In this project the trips resource supports:

- `GET /api/trips` — list all trips (public)
- `GET /api/trips/:tripCode` — read one trip (public)
- `POST /api/trips` — create a trip (**JWT required**)
- `PUT /api/trips/:tripCode` — update a trip (**JWT required**)
- `DELETE /api/trips/:tripCode` — delete a trip

Plus the authentication endpoints:

- `POST /api/register` — create a user account, returns a JWT
- `POST /api/login` — exchange credentials for a JWT

The distinction between safe methods (`GET`) and mutating methods (`POST`, `PUT`, `DELETE`) is where security enters the picture. Reading trips does not require authentication — customers need to see them. But creating or updating a trip absolutely does, and that is enforced by a middleware function (`authenticateJWT` in `app_api/routes/index.js`) that sits between the route and the controller on exactly those methods.

The middleware does three things: it pulls the `Authorization` header off the request, splits the `Bearer <token>` string, and calls `jwt.verify()` against the server's `JWT_SECRET`. If the signature is valid and the token has not expired, the request flows through to the controller. If anything fails, the request is rejected with a 401 before the controller ever sees it. This is the gatekeeper pattern in its clearest form.

Testing happened in two layers. The **backend** was tested with Postman before the Angular frontend was wired up. I confirmed that `GET /api/trips` returned a JSON array of trip documents with a 200 status. I registered a user via `POST /api/register`, copied the returned JWT into [jwt.io](https://jwt.io), and verified the payload contained the correct user information and that the signature validated against the `JWT_SECRET`. I then tested `POST` and `PUT` on `/api/trips` with and without the Bearer token to confirm that the middleware was actually gating those routes — requests without a valid token returned 401, and tampering with even a single character of the token broke the signature and failed verification.

The **frontend** was tested in the browser with the Network tab open at `localhost:4200`. Every HTTP request was directly observable — URL, method, headers, request body, response status. When the login form was submitted, I could see the POST to `/api/login` go out, the token come back, and then watch the `JwtInterceptor` automatically attach the `Authorization` header to every subsequent protected request. When an Edit Trip save succeeded, the response showed the updated document and the trip listing reflected the change immediately without a page reload. I also verified the login/logout flow visually: before logging in, the Add Trip and Edit Trip buttons were hidden by `*ngIf` directives bound to `AuthenticationService.isLoggedIn()`; after login they appeared; after logout the token was removed from `localStorage` and they disappeared again.

The security layer adds real testing complexity. You now have to test the happy path, the unauthenticated path, the expired-token path, and the malformed-token path. And because the token has a one-hour expiry, a long testing session has to account for the fact that a token that worked at the start may not work at the end. Those are the kinds of edge cases that only appear once authentication is live — and they are exactly the kinds of cases a SOC analyst or a vulnerability-management program needs to think about on the other side of the shipping line.

---

## Reflection

### How this course advanced my professional goals

I came into CS-465 with a cybersecurity orientation — SOC analysis, web fundamentals, DevSecOps, and security engineering work from TryHackMe — but with only a surface-level understanding of how web applications are actually built. That asymmetry was a problem. You cannot meaningfully defend a system you do not understand the internals of.

This course closed that gap. I now understand, from firsthand experience, what a controller does when a request arrives, where a Mongoose validation error is raised, how a JWT is signed and verified, why CORS exists and what it is actually protecting against, and how an Angular interceptor injects an `Authorization` header into outbound requests without the calling code having to think about it. I also understand the specific cryptographic moves that make the authentication system trustworthy: random 16-byte salts, PBKDF2 with SHA-512, password hashes that mean even a full database breach does not expose plaintext credentials.

The skills that move me toward SOC analyst, vulnerability management, and GRC roles are the concrete ones: reading and writing API code, reasoning about authentication and session management, understanding where input validation belongs, recognizing the XSS-vs-CSRF tradeoff implicit in where you store a token (I put mine in `localStorage`, and I can articulate what that means for my threat model), and debugging distributed behavior across a browser, a Node process, and a database at the same time. These are the skills that let a security professional have an informed conversation with developers about the system they are defending, rather than just reading the alerts the system produces.

I want to be honest about what I have not yet mastered. RxJS observables still feel like a dialect I am reading rather than writing fluently. My Angular change-detection intuition is rough. I know my `any` types should be proper interfaces in more places than they are, and that DELETE endpoint should also be behind `authenticateJWT` — a gap I noticed while writing this README. But I can now build a working MEAN application from an empty folder, and I can reason about its security posture while I do it. A year ago neither of those was true.

The broader thread I take from this course is that complex systems become understandable when you respect the layers. A request from an admin clicking "Save" travels from an Angular component through an HTTP service through a CORS-permitted route through a JWT-verifying middleware through a Mongoose model into MongoDB, and back. Name the layers, understand what each one owes the others, and the whole stops being mysterious. That is the habit of mind I plan to carry into every system I defend.

---

## Running the Project

### Prerequisites

- Node.js (LTS)
- MongoDB (local instance or Atlas connection string)
- Angular CLI

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
