'use server'
import { errorHandling } from '@/lib/errorHandling'
import { ExamInputs } from '@/lib/formValidationSchema'
import { prisma } from '@/lib/prisma'
import { currentUserId, role } from '@/lib/utils'
import { CurrentState } from '@/type'

export const createExam = async (
    currentState: CurrentState,
    data: ExamInputs
): Promise<{ success: boolean; error: boolean; message?: string }> => {
    try {
        if (role === 'teacher') {
            const teacherLesson = await prisma.lesson.findFirst({
                where: {
                    teacherId: currentUserId!,
                    id: data.lessonId,
                },
            })

            if (!teacherLesson)
                return {
                    success: false,
                    error: true,
                    message:
                        'You are not authorized to create an exam for this lesson',
                }
        }

        await prisma.exam.create({
            data: {
                title: data.title,
                lessonId: data.lessonId,
                startTime: data.startTime,
                endTime: data.endTime,
            },
        })
        return { success: true, error: false }
    } catch (error) {
        return errorHandling(error)
    }
}

export const updateExam = async (
    currentState: CurrentState,
    data: ExamInputs
): Promise<{ success: boolean; error: boolean; message?: string }> => {
    try {
        if (role === 'teacher') {
            const teacherLesson = await prisma.lesson.findFirst({
                where: {
                    teacherId: currentUserId!,
                    id: data.lessonId,
                },
            })

            if (!teacherLesson)
                return {
                    success: false,
                    error: true,
                    message: 'You are not authorized to update this exam',
                }
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
    } catch (error) {
        return errorHandling(error)
    }
}

export const deleteExam = async (
    id: number
): Promise<{ success: boolean; error: boolean; message?: string }> => {
    try {
        const existingExam = await prisma.exam.findUnique({ where: { id } })
        if (!existingExam) {
            return {
                success: false,
                error: true,
                message: 'Exam not found.',
            }
        }
        await prisma.exam.delete({
            where: {
                id,
                ...(role === 'teacher'
                    ? { lesson: { teacherId: currentUserId! } }
                    : {}),
            },
        })

        return { success: true, error: false }
    } catch (error) {
        return errorHandling(error)
    }
}
