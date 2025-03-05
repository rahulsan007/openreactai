# OpenReactAI

OpenReactAI is an open-source alternative to [v0.dev](https://v0.dev), enabling developers to generate and preview code effortlessly using AI. It supports text-to-code generation, screenshot-to-code conversion, and real-time code previews with Sandpack by CodeSandbox.

## Features

- **Text to Code**: Generate frontend code from text prompts.
- **Screenshot to Code**: Convert UI screenshots into functional components.
- **Live Code Preview**: View generated code in real-time using [Sandpack](https://sandpack.codesandbox.io/).

## Getting Started

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or later)
- [PostgreSQL](https://www.postgresql.org/) (for database support)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/rahulsan007/openreactai.git
   cd openreactai
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables by creating a `.env` file in the project root and configuring the required values:
   ```env
   LM_BASE_URL=<your_openrouter_api_url>
   LLM_API_KEY=<your_openrouter_api_key>
   SITE_URL=http://localhost:3000
   DATABASE_URL=<your_supabase_postgres_url>
   DIRECT_URL=<your_supabase_direct_url>
   CF_ACCOUNT_ID=<your_cloudflare_account_id>
   CF_ACCESS_KEY_ID=<your_cloudflare_access_key_id>
   CF_SECRET_ACCESS_KEY=<your_cloudflare_secret_access_key>
   CF_BUCKET_NAME=openreactai
   CF_R2_ENDPOINT=<your_cloudflare_r2_endpoint>
   CF_R2_PUBLIC_URL=<your_cloudflare_r2_public_url>
   ```

4. Start the development server:
   ```sh
   npm run dev
   ```

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: Next.js, Express.js
- **Database**: PostgreSQL (Supabase)
- **Storage**: Cloudflare R2
- **AI Model**: OpenRouter API


## Thanks
Special thanks to OpenRouter for free credits