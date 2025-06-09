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
