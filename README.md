# File Storage Service Backend

A cloud file storage and management backend built with **Node.js**, **Express 5**, **TypeScript**, **PostgreSQL**, **Prisma ORM**, and **AWS S3**. The service supports direct-to-S3 uploads via presigned POST URLs, nested folder hierarchies, recursive ZIP folder downloads, and granular user-to-user file and folder sharing with inherited permissions.

---

## Features

- **Authentication & Authorization**: User registration and login with `bcrypt` password hashing and stateless JWT authentication (`Bearer` tokens with 7-day expiry).
- **Direct-to-S3 Presigned Uploads**: Two-step upload flow (`init` -> client upload to S3 -> `complete`) using AWS S3 presigned POST policies (`@aws-sdk/s3-presigned-post`) with enforced MIME type and file size constraints (`application/pdf`, `image/jpeg`, `image/png` up to 20 MB), followed by `HeadObjectCommand` verification.
- **Presigned File Downloads**: Generates time-limited (5-minute) S3 GET signed URLs for file owners and authorized shared users.
- **Nested Folder Hierarchies**: Create, rename, move, and soft-delete nested folders with cycle-detection checks (`checkForCycle`) to prevent circular parent-child references and PostgreSQL recursive CTEs (`WITH RECURSIVE`) for cascading soft deletes.
- **Recursive Folder ZIP Downloads**: Streams entire folder trees directly from S3 into a ZIP archive (`archiver` + `@aws-sdk/lib-storage` multipart upload) up to a 200 MB limit and returns a presigned S3 download URL.
- **Granular & Inherited Sharing**: Share individual files or entire folders by recipient email, list items shared with the current user, and revoke access. Sharing a parent folder automatically grants read/download access to all nested subfolders and files via recursive ancestor traversal.
- **Request Validation & Error Handling**: Centralized Zod schema validation across `body`, `params`, and `query` targets alongside a global Express error handler with structured API responses.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Runtime & Language** | Node.js, TypeScript (`ESNext` / `NodeNext`) |
| **Web Framework** | Express 5 |
| **Database & ORM** | PostgreSQL, Prisma 7 (`@prisma/adapter-pg`) |
| **Object Storage** | AWS S3 (`@aws-sdk/client-s3`, `@aws-sdk/s3-presigned-post`, `@aws-sdk/s3-request-presigner`, `@aws-sdk/lib-storage`) |
| **Validation & Auth** | Zod v4, JSON Web Tokens (`jsonwebtoken`), `bcrypt` |
| **Archiving & Logging** | `archiver`, `morgan` |

---

## Project Structure

```text
├── prisma/
│   ├── migrations/              # PostgreSQL migration history
│   └── schema.prisma            # Database schema (User, Files, Folders, Shared_Files, Shared_Folders, File_Versions)
├── src/
│   ├── config/
│   │   ├── env.ts               # Environment variable exports
│   │   └── prisma.ts            # PrismaClient initialization with pg adapter
│   ├── middlewares/
│   │   ├── auth.middleware.ts   # JWT verification & req.userId injection
│   │   ├── error.middleware.ts  # Global ApiError & 500 error handler
│   │   └── validator.middleware.ts # Generic Zod request validator
│   ├── modules/
│   │   ├── auth/                # User registration & login
│   │   ├── files/               # Presigned upload/download, listing, moving, deletion
│   │   ├── folders/             # Folder CRUD, cycle-safe moves, recursive ZIP downloads
│   │   └── sharing/             # File & folder sharing, listing, and revocation
│   ├── routes/
│   │   └── index.ts             # Root /api router mounting all modules
│   ├── storage/
│   │   ├── s3.client.ts         # AWS S3Client configuration
│   │   └── s3.helpers.ts        # Presigned POST/GET URLs, S3 deletion, retryable GetObject
│   ├── types/
│   │   └── express.d.ts         # Express Request type augmentation (userId)
│   ├── utils/
│   │   ├── ApiError.ts          # Custom HTTP error class
│   │   ├── apiResponse.ts       # Standardized JSON response wrapper
│   │   ├── checkforCycle.ts     # Ancestor traversal to block cyclic folder moves
│   │   ├── helper.ts            # Target user lookup & recursive folder permission check
│   │   └── jwt.ts               # JWT signing & verification helpers
│   ├── app.ts                   # Express app setup
│   └── index.ts                 # HTTP server entrypoint
├── package.json
├── prisma.config.ts
└── tsconfig.json
