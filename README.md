<img width="4032" height="614" alt="image" src="https://github.com/user-attachments/assets/62b23a5f-12c7-40c0-88d9-299009ceaee6" /># Teltruva

Teltruva is an AI-powered multilingual consumer issue resolution application built with NVIDIA Nemotron 3.5 Lightning through Nebius Token Factory.

Teltruva helps users organize billing errors, unexpected charges, cancellation problems, and other consumer issues in their own language, then prepare a clear and respectful inquiry in the recipient's language.

## Live Demo

https://teltruva-phi.vercel.app

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

Nothing is translated, approved, or sent without the user's review.

## User Workflow

1. The user describes the issue in the user's own language.
2. The user uploads supporting documents.
3. Teltruva extracts and organizes relevant information.
4. The user reviews source-confirmed facts, personal statements, and the requested outcome.
5. Teltruva prepares a recipient-ready inquiry.
6. The user compares and approves the translated version.
7. The user copies the completed inquiry and verifies an official contact route.
8. The user submits the inquiry through an available channel.

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
git clone https://github.com/ContextVocab001/teltruva.git
cd teltruva
```

Install the dependencies:

```bash
npm install
```

### Environment Variables

Create a local `.env` file based on the environment-variable names referenced by the server-side API routes.

At minimum, configure the Nebius credential used by the project:

```env
NEBIUS_API_KEY=your_nebius_api_key
```

If the document-processing route in your local version references a separate NVIDIA credential, also configure:

```env
NVIDIA_API_KEY=your_nvidia_api_key
```

Do not commit real API keys to GitHub. Environment files are excluded through `.gitignore`.

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

https://teltruva-phi.vercel.app

Required credentials are configured as Vercel environment variables and are not stored in this repository.

## Security and User Control

Teltruva is designed around the following principles:

- Do not invent essential transaction details
- Clearly separate evidence from user-provided statements
- Require user review before translation
- Do not send messages automatically
- Do not automatically treat a search result as an official contact channel
- Require the user to verify the organization's official website or contact route
- Keep API credentials in server-side environment variables

## Current Limitations

- Document extraction quality depends on the source file
- Search results for contact routes require user verification
- Model output is validated, but users should review all information
- Teltruva does not automatically submit an inquiry
- The current demonstration focuses on a representative consumer billing scenario

## Future Development

Planned improvements include:

- Support for additional receipt and billing formats
- Additional languages and regional communication styles
- Improved official-contact-route discovery
- Follow-up message support
- Privacy-focused case management
- Broader testing with real cross-border customer-service scenarios

## License

This project is licensed under the Apache License 2.0. See the LICENSE file for details.
