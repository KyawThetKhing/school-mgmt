'use server'
import { revalidatePath } from 'next/cache'
import {
    ClassInputs,
    ExamInputs,
    StudentInputs,
    SubjectInputs,
    TeacherInputs,
} from './formValidationSchema'
import { prisma } from './prisma'
import { clerkClient } from '@clerk/nextjs/server'
import { currentUserId, role } from './utils'

type CurrentState = { success: boolean; error: boolean }

export const createSubject = async (
    currentState: CurrentState,
    data: SubjectInputs
) => {
    try {
        await prisma.subject.create({
            data: {
                name: data.name,
                teachers: {
                    connect: data.teachers.map((teacherId) => ({
                        id: teacherId,
                    })),
                },
            },
        })
        // revalidatePath('/list/subjects')
        return { success: true, error: false }
    } catch (error) {
        return { success: false, error: true }
    }
}

export const updateSubject = async (
    currentState: CurrentState,
    data: SubjectInputs
) => {
    try {
        await prisma.subject.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                teachers: {
                    set: data.teachers.map((teacherId) => ({
                        id: teacherId,
                    })),
                },
            },
        })
        return { success: true, error: false }
    } catch {
        return { success: false, error: true }
    }
}

export const deleteSubject = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get('id') as string
    try {
        await prisma.subject.delete({
            where: {
                id: parseInt(id),
            },
        })

        // revalidatePath("/list/subjects");
        return { success: true, error: false }
    } catch (err) {
        console.log(err)
        return { success: false, error: true }
    }
}

export const createClass = async (
    currentState: CurrentState,
    data: ClassInputs
) => {
    try {
        await prisma.class.create({
            data: {
                name: data.name,
                capacity: data.capacity,
                supervisorId: data.supervisorId,
                gradeId: data.gradeId,
            },
        })
        return { success: true, error: false }
    } catch {
        return { success: false, error: true }
    }
}

export const updateClass = async (
    currentState: CurrentState,
    data: ClassInputs
) => {
    try {
        await prisma.class.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                capacity: data.capacity,
                supervisorId: data.supervisorId,
                gradeId: data.gradeId,
            },
        })
        return { success: true, error: false }
    } catch {
        return { success: false, error: true }
    }
}

export const deleteClass = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get('id') as string
    try {
        await prisma.class.delete({
            where: {
                id: parseInt(id),
            },
        })

        // revalidatePath("/list/subjects");
        return { success: true, error: false }
    } catch (err) {
        console.log(err)
        return { success: false, error: true }
    }
}

export const createTeacher = async (
    currentState: CurrentState,
    data: TeacherInputs
) => {
    try {
        //create user in clerk
        const user = await clerkClient().users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
            emailAddress: [data.email || ''],
            publicMetadata: {
                role: 'teacher',
            },
        })

        //create user in prisma
        await prisma.teacher.create({
            data: {
                id: user.id,
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                address: data.address,
                img: data.img,
                bloodType: data.bloodType,
                sex: data.sex,
                birthday: data.birthday,
                subjects: {
                    connect: data.subjects?.map((subjectId: string) => ({
                        id: parseInt(subjectId),
                    })),
                },
            },
        })
        return { success: true, error: false }
    } catch (error) {
        return { success: false, error: true }
    }
}

export const updateTeacher = async (
    currentState: CurrentState,
    data: TeacherInputs
) => {
    if (!data.id) return { success: false, error: true }
    try {
        const user = await clerkClient().users.updateUser(data.id, {
            username: data.username,
            firstName: data.name,
            lastName: data.surname,
            ...(data.password && { password: data.password }),
            // emailAddress: data.email,
        })

        await prisma.teacher.update({
            where: {
                id: data.id,
            },
            data: {
                ...(data.password && { password: data.password }),
                id: user.id,
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                address: data.address,
                img: data.img,
                bloodType: data.bloodType,
                sex: data.sex,
                birthday: data.birthday,
                subjects: {
                    set: data.subjects?.map((subjectId) => ({
                        id: parseInt(subjectId),
                    })),
                },
            },
        })
        return { success: true, error: false }
    } catch (error) {
        return { success: false, error: true }
    }
}

export const deleteTeacher = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get('id') as string
    await clerkClient.users.deleteUser(id)
    try {
        await prisma.teacher.delete({
            where: {
                id: id,
            },
        })

        // revalidatePath("/list/subjects");
        return { success: true, error: false }
    } catch (err) {
        console.log(err)
        return { success: false, error: true }
    }
}

export const createStudent = async (
    currentState: CurrentState,
    data: StudentInputs
) => {
    try {
        const classItem = await prisma.class.findUnique({
            where: {
                id: parseInt(data.classId),
            },
            include: {
                _count: {
                    select: { students: true },
                },
            },
        })

        if (classItem && classItem?._count.students === classItem?.capacity) {
            return { success: false, error: true }
        }

        const { password, ...rest } = data
        //create user in clerk
        const user = await clerkClient().users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
            emailAddress: [data.email || ''],
            publicMetadata: {
                role: 'student',
            },
        })

        //create user in prisma
        await prisma.student.create({
            data: {
                id: user.id,
                username: data.username,
                email: data.email,
                name: data.name,
                surname: data.surname,
                phone: data.phone,
                address: data.address,
                bloodType: data.bloodType,
                birthday: data.birthday,
                sex: data.sex,
                parentId: data.parentId,
                classId: parseInt(data.classId),
                gradeId: parseInt(data.gradeId),
                img: data.img,
            },
        })
        return { success: true, error: false }
    } catch (error) {
        return { success: false, error: true }
    }
}

export const updateStudent = async (
    currentState: CurrentState,
    data: StudentInputs
) => {
    if (!data.id) return { success: false, error: true }
    try {
        const user = await clerkClient().users.updateUser(data.id, {
            username: data.username,
            firstName: data.name,
            lastName: data.surname,
            ...(data.password && { password: data.password }),
            // emailAddress: data.email,
        })

        await prisma.student.update({
            where: {
                id: data.id,
            },
            data: {
                id: user.id,
                username: data.username,
                email: data.email,
                name: data.name,
                surname: data.surname,
                phone: data.phone,
                address: data.address,
                bloodType: data.bloodType,
                birthday: data.birthday,
                sex: data.sex,
                parentId: data.parentId,
                classId: parseInt(data.classId),
                gradeId: parseInt(data.gradeId),
                img: data.img,
            },
        })
        return { success: true, error: false }
    } catch {
        return { success: false, error: true }
    }
}

export const deleteStudent = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get('id') as string
    await clerkClient.users.deleteUser(id)
    try {
        await prisma.student.delete({
            where: {
                id: id,
            },
        })

        // revalidatePath("/list/subjects");
        return { success: true, error: false }
    } catch (err) {
        console.log(err)
        return { success: false, error: true }
    }
}

export const createExam = async (
    currentState: CurrentState,
    data: ExamInputs
) => {
    try {
        if (role === 'teacher') {
            const teacherLesson = await prisma.lesson.findFirst({
                where: {
                    teacherId: currentUserId!,
                    id: data.lessonId,
                },
            })

            if (!teacherLesson) return { success: false, error: true }
        }

        await prisma.exam.create({
            data: {
                title: data.title,
                lessonId: data.lessonId,
                startTime: data.startTime,
                endTime: data.endTime,
            },
        })
        // revalidatePath('/list/subjects')
        return { success: true, error: false }
    } catch (error) {
        return { success: false, error: true }
    }
}

export const updateExam = async (
    currentState: CurrentState,
    data: ExamInputs
) => {
    try {
        if (role === 'teacher') {
            const teacherLesson = await prisma.lesson.findFirst({
                where: {
                    teacherId: currentUserId!,
                    id: data.lessonId,
                },
            })

            if (!teacherLesson) return { success: false, error: true }
        }

        await prisma.exam.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                lessonId: data.lessonId,
                startTime: data.startTime,
                endTime: data.endTime,
            },
        })
        return { success: true, error: false }
    } catch {
        return { success: false, error: true }
    }
}

export const deleteExam = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get('id') as string
    try {
        await prisma.exam.delete({
            where: {
                id: parseInt(id),
                ...(role === 'teacher'
                    ? { lesson: { teacherId: currentUserId! } }
                    : {}),
            },
        })

        // revalidatePath("/list/subjects");
        return { success: true, error: false }
    } catch (err) {
        console.log(err)
        return { success: false, error: true }
    }
}
