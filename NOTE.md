### Step-by-Step Guide to Form Implementation

This project uses a modern, robust stack for handling forms in a Next.js application, including:

*   **`react-hook-form`**: For efficient and scalable form state management.
*   **`zod`**: For schema-based validation.
*   **Next.js Server Actions**: For secure and seamless data submission to the server.
*   **`react-toastify`**: For user-friendly notifications.

Here’s how to implement a new form following the existing pattern:

---

#### **Step 1: Define the Validation Schema**

All validation schemas are centralized in `src/lib/formValidationSchema.ts`.

1.  **Create a `zod` schema**: Define the shape and validation rules for your form data.
2.  **Infer a TypeScript type**: Create a type from the schema for type safety throughout your components.

**Example (`LessonForm`)**:

```typescript
// src/lib/formValidationSchema.ts
import { z } from 'zod';

// ... other schemas

export const lessonSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Lesson name must be at least 3 characters.'),
  // Add other fields like 'subjectId', 'classId', etc.
});

export type LessonInputs = z.infer<typeof lessonSchema>;
```

---

#### **Step 2: Create the Server Actions**

Server actions handle the logic for creating and updating data. They are located in `src/lib/actions.ts`.

1.  **Create `create` and `update` functions**: These functions will receive the form data and interact with the database (Prisma).
2.  **Use `'use server'`**: This directive is required at the top of the file.
3.  **Return a state object**: The functions must return an object with `success`, `error`, and `message` properties to be used by the `useFormState` hook.
4.  **Revalidate Path**: Call `revalidatePath` from `next/cache` to refresh the data on the relevant page after a successful operation.

**Example (`createLesson`)**:

```typescript
// src/lib/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from './prisma';
import { lessonSchema } from './formValidationSchema';

export async function createLesson(prevState: any, formData: any) {
  const validatedFields = lessonSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: true,
      message: 'Validation failed.',
    };
  }

  try {
    await prisma.lesson.create({
      data: validatedFields.data,
    });

    revalidatePath('/list/lessons'); // Or the appropriate path
    return { success: true, message: 'Lesson created successfully.' };
  } catch (err) {
    return { success: false, error: true, message: 'Failed to create lesson.' };
  }
}

// Create a similar 'updateLesson' function
```

---

#### **Step 3: Build the Form Component**

Form components reside in `src/components/forms/`.

1.  **Create the component file**: e.g., `src/components/forms/LessonForm.tsx`.
2.  **Use `useForm`**: Initialize `react-hook-form` with the `zodResolver` to connect your schema.
3.  **Use `useFormState`**: Hook into the server action you created.
4.  **Handle Submission**: Create an `onSubmit` function that calls the `formAction` from `useFormState`.
5.  **Handle Side Effects**: Use an `useEffect` hook to watch for changes in the submission `state` and trigger notifications, close modals, and refresh the page.
6.  **Structure the JSX**: Use the reusable `InputField` component for text inputs and standard HTML elements for selects or other controls. Pass the `register` function and `errors` object to each field.

**Example (`LessonForm.tsx`)**:

```tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { createLesson, updateLesson } from '@/lib/actions';
import { LessonInputs, lessonSchema } from '@/lib/formValidationSchema';
import InputField from '../InputField';

const LessonForm = ({ setOpen, type, data }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonInputs>({
    resolver: zodResolver(lessonSchema),
    defaultValues: data || {},
  });

  const router = useRouter();
  const [state, formAction] = useFormState(
    type === 'create' ? createLesson : updateLesson,
    { success: false, error: false, message: '' }
  );

  const onSubmit = handleSubmit((formData) => {
    formAction(formData);
  });

  useEffect(() => {
    if (state.success) {
      toast.success(`Lesson ${type}d successfully!`);
      setOpen(false);
      router.refresh();
    } else if (state.error) {
      toast.error(state.message);
    }
  }, [state, router, setOpen, type]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type === 'create' ? 'Create a new lesson' : 'Update lesson'}</h1>
      {data?.id && <InputField name="id" register={register} hidden />}
      <InputField label="Name" name="name" register={register} error={errors.name} />
      {/* Add other fields for subject, class, etc. */}
      <button className="rounded-md bg-blue-400 p-2 text-white">
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default LessonForm;
```

---

#### **Step 4: Integrate the Form into a Page**

Finally, use the form component within a page (e.g., `src/app/(dashboard)/list/lessons/page.tsx`).

1.  **Manage State**: Use `useState` to control the visibility of the form modal.
2.  **Fetch Data**: If the form is for updating, fetch the existing data for the item.
3.  **Render the Modal**: Conditionally render the `FormModal` and pass the form component, its props, and the state handlers to it.

This structured approach ensures that all forms in the application are consistent, maintainable, and provide a great user experience.


### Authentication & Authorization Guide

This project uses **Clerk** for comprehensive user authentication and role-based access control.

---

#### **Step 1: Clerk Project Setup**

Authentication is managed via a Clerk project. The key credentials are set in the environment variables:

*   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your public-facing Clerk key.
*   `CLERK_SECRET_KEY`: Your secret Clerk key for backend communication.

These are loaded from a `.env.local` file, which should be created by copying `.env.example`.

---

#### **Step 2: Clerk Provider**

The entire application is wrapped in the `<ClerkProvider>` in `src/app/layout.tsx`. This provides the active session and user context to all components.

```tsx
// src/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

---

#### **Step 3: Sign-In Page**

Clerk provides a pre-built UI for handling the sign-in and sign-up flows.

*   The route `src/app/[[...sign-in]]/page.tsx` uses a catch-all route to render the Clerk `<SignIn />` component.
*   This component handles all aspects of authentication, including email/password, social logins, and multi-factor authentication, as configured in your Clerk dashboard.

---

#### **Step 4: Middleware for Protection and Roles**

The core of the authorization logic is in `src/middleware.ts`.

1.  **Clerk Middleware**: The `clerkMiddleware` function from `@clerk/nextjs/server` is used to protect routes and manage sessions.
2.  **Route Matching**: The `createRouteMatcher` utility is used to match incoming requests against a list of protected routes.
3.  **Role-Based Access**:
    *   The `routeAccessMap` object in `src/lib/settings.ts` defines which user roles are allowed to access specific routes. The roles (`admin`, `teacher`, `student`, `parent`) are stored in the user's session claims metadata.
    *   The middleware extracts the user's role from `auth().sessionClaims`.
    *   If a user tries to access a route they are not authorized for, they are redirected to their default dashboard (e.g., a student trying to access `/admin` is sent to `/student`).

**Example (`src/middleware.ts`)**:

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { routeAccessMap } from './lib/settings';

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role: string })?.role;

  // ... logic to check role against routeAccessMap ...
});
```

---

#### **Step 5: Managing User Roles**

User roles are not managed within this codebase but are set in the **Clerk Dashboard**.

*   To assign a role to a user, go to your Clerk project, navigate to the "Users" section, and edit the user's "Public Metadata".
*   The metadata should be a JSON object with a `role` key:
    ```json
    {
      "role": "admin"
    }
    ```

This setup provides a secure and flexible way to manage authentication and authorization, separating concerns effectively between the application code and the Clerk service.