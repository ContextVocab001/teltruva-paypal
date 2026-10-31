# Teltruva

Teltruva is an AI-powered multilingual consumer issue resolution application built with NVIDIA Nemotron 3.5 Lightning through Nebius Token Factory.

Teltruva helps users organize billing errors, unexpected charges, cancellation problems, and other consumer issues in their own language, then prepare a clear and respectful inquiry in the recipient's language.

## Live Demo

https://teltruva-paypal.vercel.app

## The Problem

A language barrier can turn a solvable service issue into financial loss.

Translation alone is often insufficient. A user must still determine:

- Which transaction details matter
- What evidence supports the inquiry
- Which information is missing
- How to explain the issue clearly
- What resolution to request
- How to locate an official contact route

Teltruva supports this complete workflow while keeping the user in control.

## What Teltruva Does

Teltruva allows a user to:

- Describe a consumer issue naturally in the user's preferred language
- Upload receipts, billing records, and other supporting documents
- Extract relevant transaction details from the evidence
- Separate source-confirmed facts from user-provided statements
- Identify essential missing information without inventing details
- Review the organized case before translation
- Generate a clear inquiry in the recipient's language
- Compare and approve the translation before proceeding
- Copy the completed inquiry for use in an official web form, email, or chat
- Search for possible official contact routes while requiring user verification
- Review a one-time case-support fee before AI processing begins
- Pay in PayPal Sandbox with a PayPal test account or sandbox payment card
- See step-by-step status while documents and case details are being processed
- Retry AI case organization without another payment during the same browser session

Nothing is translated, approved, or sent without the user's review.

## User Workflow

1. The user describes the issue in the user's own language.
2. The user uploads supporting documents.
3. Teltruva shows the one-time case-support price and included services.
4. The user completes a PayPal Sandbox payment using a test PayPal account or sandbox card.
5. After server-side payment capture succeeds, Teltruva starts OCR and AI case organization.
6. A processing overlay shows the current stage while the case is prepared.
7. The user reviews source-confirmed facts, personal statements, and the requested outcome.
8. Teltruva prepares a recipient-ready inquiry.
9. The user compares and approves the translated version.
10. The user copies the completed inquiry and verifies an official contact route.
11. The user submits the inquiry through an available channel.

## PayPal Sandbox Integration

Teltruva uses PayPal Sandbox to demonstrate a one-time payment flow before paid AI processing begins.

The current case-support product is configured as:

- One initial inquiry message
- Two follow-up responses
- One pre-send revision per message
- Unlimited access to saved documents
- No subscription or automatic renewal
- Sandbox price: USD 9.99

The payment flow is separated into server-side and browser-side responsibilities:

```text
Browser payment UI
    -> Teltruva PayPal client API
    -> Vercel serverless PayPal endpoints
    -> PayPal Sandbox Orders API
```

Server-side endpoints:

```text
/api/paypal/config
/api/paypal/create-order
/api/paypal/capture-order
```

The server defines the authoritative price, creates the PayPal order, and captures the approved payment. The PayPal client secret is never exposed to the browser.

After capture succeeds, Teltruva starts document reading and AI case organization. If AI organization fails, the payment result is retained in `sessionStorage` for the current browser tab so the user can retry the AI step without being charged again.

This browser-session payment state is temporary for the hackathon prototype. A production version should store payment entitlements against a persistent Teltruva Case ID in a database.

## NVIDIA Nemotron Integration

Teltruva uses NVIDIA Nemotron 3.5 Lightning through Nebius Token Factory.

Nemotron is used to:

- Understand multilingual consumer issues
- Follow detailed case-analysis instructions
- Distinguish evidence-based facts from user-provided statements
- Identify essential missing information
- Preserve the user's intended outcome
- Return structured JSON for the application interface
- Generate clear, recipient-ready inquiries

We selected the Lightning variant because Teltruva requires responsive inference in an interactive web workflow. The model provided a useful balance of multilingual understanding, instruction following, structured output, and response speed.

## Prompt Engineering and Structured Output

Teltruva uses Nemotron without fine-tuning.

The prompt engineering approach includes:

- A defined role and case-analysis structure
- Explicit separation of source-confirmed facts and user statements
- Instructions not to invent missing information
- Structured JSON output requirements
- Explicit definitions for required fields
- Application-level validation before displaying results
- Extended thinking disabled for this workflow to help return a complete structured response within the output limit

These controls make the model output easier to review and integrate into the application.

## How Nebius Accelerated Development

Nebius Token Factory provides the runtime API access used to call NVIDIA Nemotron 3.5 Lightning.

Token Factory allowed us to integrate an NVIDIA open model without:

- Provisioning dedicated GPU instances
- Downloading and managing model weights
- Configuring a model server
- Operating inference infrastructure
- Building custom autoscaling infrastructure

Teltruva sends structured case information to Nemotron through a server-side API route. Nemotron returns structured JSON that the application uses to display confirmed facts, user-provided statements, missing information, and the requested outcome.

The frontend and server-side API routes are deployed on Vercel, while the AI case analysis is performed through Nebius Token Factory.

## Technology Stack

- NVIDIA Nemotron 3.5 Lightning
- Nebius Token Factory
- React
- TypeScript
- Vite
- Node.js
- Vercel
- PayPal Sandbox and PayPal Orders API
- OCR and document-processing workflows

## Project Structure

```text
teltruva/
|-- api/                 # Server-side API routes
|-- public/              # Static assets
|-- src/                 # React and TypeScript application
|-- index.html
|-- package.json
|-- package-lock.json
|-- tsconfig.json
|-- tsconfig.app.json
|-- tsconfig.node.json
`-- vite.config.ts
```

## Local Setup

### Prerequisites

Install the following:

- Node.js 18 or later
- npm
- A Nebius Token Factory API key

### Installation

Clone the repository:

```bash
git clone https://github.com/ContextVocab001/teltruva-paypal.git
cd teltruva-paypal
```

Install the dependencies:

```bash
npm install
```

### Environment Variables

Create a local `.env` file based on the environment-variable names referenced by the server-side API routes.

Configure the credentials used by the AI, document-processing, search, and PayPal Sandbox routes:

```env
NEBIUS_API_KEY=your_nebius_api_key
NVIDIA_API_KEY=your_nvidia_api_key
BRAVE_SEARCH_API_KEY=your_brave_search_api_key
PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_paypal_sandbox_client_secret
PAYPAL_ENV=sandbox
```

`PAYPAL_CLIENT_SECRET` must remain server-side. Do not place it in browser code or expose it through a `VITE_` environment variable.

Do not commit real API keys or PayPal credentials to GitHub. Environment files are excluded through `.gitignore`.

### Run the Application

Start the local development server:

```bash
npm run dev
```

Open the local URL shown in the terminal, typically:

```text
http://localhost:5173
```

## Deployment

The public demonstration is deployed on Vercel:

https://teltruva-paypal.vercel.app

Required credentials are configured as Vercel environment variables and are not stored in this repository.

## Security and User Control

Teltruva is designed around the following principles:

- Do not invent essential transaction details
- Clearly separate evidence from user-provided statements
- Require user review before translation
- Do not send messages automatically
- Do not automatically treat a search result as an official contact channel
- Require the user to verify the organization's official website or contact route
- Keep API credentials and the PayPal client secret in server-side environment variables
- Start paid AI processing only after server-side PayPal capture succeeds
- Preserve paid status for retry within the current browser session

## Current Limitations

- Document extraction quality depends on the source file
- Search results for contact routes require user verification
- Model output is validated, but users should review all information
- Teltruva does not automatically submit an inquiry
- The current demonstration focuses on a representative consumer billing scenario
- PayPal integration currently uses Sandbox only; no real money is charged
- Paid status is temporarily stored in `sessionStorage` and is not shared across tabs, browsers, or devices
- A persistent Teltruva Case ID and database-backed payment entitlement are not yet implemented

## Future Development

Planned improvements include:

- Support for additional receipt and billing formats
- Additional languages and regional communication styles
- Improved official-contact-route discovery
- Persistent Teltruva Case IDs linked to PayPal order and capture records
- Database-backed payment entitlements and two included follow-up responses
- Follow-up message support with additional-payment rules after the included allowance
- Firebase Authentication with Google and email sign-in
- Privacy-focused case management
- Broader testing with real cross-border customer-service scenarios

## License

This project is licensed under the Apache License 2.0. See the LICENSE file for details.
