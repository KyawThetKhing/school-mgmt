import { prisma } from '@/lib/prisma'
import FormModal from './FormModal'

export type FormContainerProps = {
    table:
        | 'teacher'
        | 'student'
        | 'parent'
        | 'subject'
        | 'class'
        | 'lesson'
        | 'exam'
        | 'assignment'
        | 'result'
        | 'attendance'
        | 'event'
        | 'announcement'
    type: 'create' | 'update' | 'delete'
    data?: any
    id?: number | string
}
const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
    let relatedData = {}

    if (type !== 'delete') {
        switch (table) {
            case 'subject':
                const subjectTeachers = await prisma.teacher.findMany({
                    select: { id: true, name: true, surname: true },
                })
                relatedData = { teachers: subjectTeachers }
                break
            case 'class':
                const [classGrades, classTeachers] = await prisma.$transaction([
                    prisma.grade.findMany(),
                    prisma.teacher.findMany({
                        select: { id: true, name: true, surname: true },
                    }),
                ])
                relatedData = { grades: classGrades, teachers: classTeachers }

                break
            case 'teacher':
                const teacherSubjects = await prisma.subject.findMany({
                    select: { id: true, name: true },
                })
                relatedData = { subjects: teacherSubjects }
                break
            case 'student':
                const [studentParents, studentClasses, studentGrades] =
                    await prisma.$transaction([
                        prisma.parent.findMany({
                            select: {
                                id: true,
                                name: true,
                                surname: true,
                            },
                        }),
                        prisma.class.findMany({
                            include: { _count: { select: { students: true } } },
                        }),
                        prisma.grade.findMany({
                            select: {
                                id: true,
                                level: true,
                            },
                        }),
                    ])
                relatedData = {
                    parents: studentParents,
                    classes: studentClasses,
                    grades: studentGrades,
                }
                break
            default:
                break
        }
    }

    return (
        <div>
            <FormModal
                table={table}
                type={type}
                data={data}
                id={id}
                relatedData={relatedData}
            />
        </div>
    )
}

export default FormContainer
