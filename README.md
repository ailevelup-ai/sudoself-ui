# SudoSelf UI

A modern document management system with S3 integration for processing documents.

## Features

- Document upload with drag-and-drop support
- File validation and progress tracking
- S3 integration for document storage
- Document processing workflow
- Clean modern UI with Tailwind CSS
- Responsive design for all devices

## Technology Stack

- Next.js (React framework)
- TypeScript
- Tailwind CSS
- AWS S3 for document storage
- Radix UI components

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/ailevelup-ai/sudoself-ui.git
cd sudoself-ui
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example env file and fill in your values
cp .env.local.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## S3 Configuration

To use the S3 integration, you need to set up the following environment variables in your `.env.local` file:

```
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_bucket_name
```

Make sure your S3 bucket has the appropriate CORS configuration to allow uploads from your domain.

## Document Processing Workflow

The document processing workflow follows these steps:

1. User uploads document through UI
2. File is uploaded to S3
3. The system triggers the document processing workflow
4. The document status is tracked and updated in the UI

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
