# Dev School Management Dashboard

### The project follows a YouTube tutorial by Lama Dev (https://www.youtube.com/@LamaDev) and includes additional features and best practices.

## Core Technologies:

- Framework: Next.js (https://nextjs.org/) (a React framework)
- Language: TypeScript (https://www.typescriptlang.org/)
- Styling: Tailwind CSS (https://tailwindcss.com/)
- Database ORM: Prisma (https://www.prisma.io/)
- Authentication: Clerk (https://clerk.com/)

Key Features:

- User Roles: The application appears to support different user roles like admin, teacher, student, and parent, each with their own dashboard view.
- School Management: It provides functionalities to manage:
    - Students
    - Teachers
    - Parents
    - Classes & Subjects
    - Lessons & Assignments
    - Exams & Results
    - Announcements & Events
- Data Visualization: It uses Recharts for charts and React Big Calendar for calendars to display data.
- Forms: It uses react-hook-form and zod for building and validating forms.
- Image Uploads: It uses next-cloudinary for handling image uploads.

Project Structure:

- The project follows the Next.js App Router structure (src/app).
- Database schema is defined in prisma/schema.prisma.
- Reusable UI components are located in src/components.
- Server-side logic, database queries, and utility functions are in src/lib.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js](https://nextjs.org/learn)

## Database

## Database Schema

- [ER Diagram](prisma/database.png)

## TODO

- To add UI for empty [*]
- To replace select with custom Open [*]
- To add CRUD func for the rest
    - Parent [*]
    - Lesson [*]
    - Assignment [*]
    - result
    - Event
    - Announcement
- To refactor code
- To add loading (skeleton) [*]
- To add active class for menu
- To change blood type as select
