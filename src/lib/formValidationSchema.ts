import { z } from 'zod'

export const subjectSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(1, { message: 'Subject name is required!' }),
    teachers: z.array(z.string()),
})

export type SubjectInputs = z.infer<typeof subjectSchema>

export const classSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(1, { message: 'Class name is required!' }),
    capacity: z.coerce.number({ message: 'Capacity is required!' }),
    supervisorId: z.string().optional(),
    gradeId: z.coerce.number({ message: 'Grade is required!' }),
})

export type ClassInputs = z.infer<typeof classSchema>

export const teacherSchema = z.object({
    id: z.string().optional(),
    username: z
        .string()
        .min(3, { message: 'Username must be at least 3 characters long!' })
        .max(20, { message: 'Username must be at most 20 characters long!' }),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long!' })
        .optional()
        .or(z.literal('')),
    name: z.string().min(1, { message: 'Name is required!' }),
    surname: z.string().min(1, { message: 'Surname is required!' }),
    email: z
        .string()
        .email({ message: 'Invalid email address!' })
        .optional()
        .or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().min(1, { message: 'Address is required!' }),
    bloodType: z.string().min(1, { message: 'Blood Type is required!' }),
    sex: z.enum(['MALE', 'FEMALE'], { message: 'Sex is required!' }),
    birthday: z.coerce.date({ message: 'Birthday is required!' }),
    img: z.string().optional(),
    subjects: z.array(z.string()).optional(),
})

export type TeacherInputs = z.infer<typeof teacherSchema>
