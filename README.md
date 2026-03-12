# UiPath XAML Workflow Generator

A web app that uses natural language processing to convert plain-English descriptions into valid UiPath Studio XAML, eliminating the repetitive scaffolding work that slows down RPA development.

## Overview

RPA developers spend a significant amount of time manually dragging and arranging activities in UiPath Studio before any real logic is configured. This tool skips that step entirely: describe your automation steps in plain text, and get back a structured, pasteable XAML file ready to import into Visual Studio Code.

The generated XAML follows UiPath's activity nesting rules. UI interactions are wrapped in `NApplicationCard` scope containers, sequences are properly structured, and every `IdRef` is unique, so developers can paste it directly and focus on configuring selectors and runtime values instead of building structure from scratch.

## Demo

**Input:**
> "Log start, click the submit button, log done"

**Output:** A complete `.xaml` file with a `LogMessage`, a `NApplicationCard` containing an `NClick`, and a second `LogMessage`, all with proper namespace declarations, view state metadata, and correct nesting.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| AI | Google Gemini via LangChain (`@langchain/google-genai`) |
| API | Next.js Route Handlers (serverless) |

## How It Works

1. **User Input**:The user types a plain-English description of their automation steps into the text field and presses Enter.
2. **API Request**:The client sends the input to `/api/analyze` via a `POST` request.
3. **AI Generation**:The server passes the input to Gemini with a carefully engineered system prompt that constrains the model to a specific set of allowed UiPath activities (`LogMessage`, `NClick`, `NApplicationCard`, `Assign`, `Delay`, `If`, `Throw`). The model responds with a JSON object containing the XAML fragment.
4. **XAML Assembly**:The server wraps the AI-generated fragment in the correct UiPath `<Activity>` and `<Sequence>` boilerplate (with all required XML namespace declarations) before returning it.
5. **Display & Copy**:The assembled XAML is rendered in a syntax-highlighted code block with a one-click copy button. The user can paste it directly into UiPath Studio.

```
User Input (plain text)
        │
        ▼
  /api/analyze  (Next.js Route Handler)
        │
        ▼
  Gemini (via LangChain)
  + Constrained system prompt
        │
        ▼
  JSON { xaml: "..." }
        │
        ▼
  Wrap with Activity/Sequence boilerplate
        │
        ▼
  Rendered CodeBlock with copy button
```

## Supported UiPath Activities

The model is constrained to generate only these activity types to ensure output is always valid and importable:

- `LogMessage`:structured logging
- `NClick`:mouse click interactions (auto-wrapped in `NApplicationCard`)
- `NApplicationCard`:application/browser scope container
- `Assign`:variable assignment
- `Delay`:wait/sleep
- `If`:conditional branching
- `Throw`:exception handling (`BusinessRuleException` / `SystemException`)

## Getting Started

### Prerequisites

- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

### Installation

```bash
git clone https://github.com/your-username/workflowgenerator.git
cd workflowgenerator
npm install
```

### Environment Setup

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_api_key_here
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── page.js                  # Root page
│   ├── layout.js                # App layout
│   ├── components/
│   │   ├── TextInput.jsx        # Main input + state management
│   │   └── CodeBlock.jsx        # Syntax-highlighted output with copy button
│   └── api/
│       └── analyze/
│           └── route.js         # POST handler:calls Gemini, assembles XAML
└── utils/
    ├── prompts.js               # Gemini system prompt (activity rules + output format)
    └── BoilerPlate.js           # UiPath Activity/Sequence XML wrappers
```