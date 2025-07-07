import { currentUser } from '@clerk/nextjs/server'

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
    const user = await currentUser()
    const role = (user?.publicMetadata as { role: string })?.role

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
            case 'exam':
                const examLessons = await prisma.lesson.findMany({
                    where: {
                        ...(role === 'teacher' ? { teacherId: user?.id! } : {}),
                    },
                    select: { id: true, name: true, teacher: true },
                })

                relatedData = { lessons: examLessons }
                break
            case 'lesson':
                const lessonClasses = await prisma.class.findMany({
                    select: { id: true, name: true },
                })
                const lessonTeachers = await prisma.teacher.findMany({
                    select: { id: true, name: true, surname: true },
                })
                const lessonSubjects = await prisma.subject.findMany({
                    select: { id: true, name: true },
                })
                relatedData = {
                    classes: lessonClasses,
                    teachers: lessonTeachers,
                    subjects: lessonSubjects,
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
