'use server'
import { errorHandling } from '@/lib/errorHandling'
import { LessonInputs } from '@/lib/formValidationSchema'
import { prisma } from '@/lib/prisma'
import { role } from '@/lib/utils'
import { CurrentState } from '@/type'

export const createLesson = async (
    currentState: CurrentState,
    data: LessonInputs
): Promise<{ success: boolean; error: boolean; message?: string }> => {
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to create a lesson.',
            }
        }
        await prisma.lesson.create({
            data: {
                name: data.name,
                day: data.day,
                startTime: data.startTime,
                endTime: data.endTime,
                subjectId: data.subject,
                classId: data.class,
                teacherId: data.teacher,
            },
        })
        return {
            success: true,
            error: false,
            message: 'Lesson created successfully!',
        }
    } catch (error) {
        return errorHandling(error)
    }
}

export const updateLesson = async (
    currentState: CurrentState,
    data: LessonInputs
): Promise<{ success: boolean; error: boolean; message?: string }> => {
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to update a lesson.',
            }
        }
        if (!data.id)
            return {
                success: false,
                error: true,
                message: 'Lesson ID is missing',
            }
        await prisma.lesson.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                day: data.day,
                startTime: data.startTime,
                endTime: data.endTime,
                subjectId: data.subject,
                classId: data.class,
                teacherId: data.teacher,
            },
        })
        return {
            success: true,
            error: false,
            message: 'Lesson created successfully!',
        }
    } catch (error) {
        return errorHandling(error)
    }
}

export const deleteLesson = async (
    id: number
): Promise<{ success: boolean; error: boolean; message?: string }> => {
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to delete a lesson.',
            }
        }
        const existingLesson = await prisma.lesson.findUnique({ where: { id } })
        if (!existingLesson) {
            return {
                success: false,
                error: true,
                message: 'Lesson not found.',
            }
        }
        await prisma.lesson.delete({
            where: {
                id,
            },
        })
        return {
            success: true,
            error: false,
            message: 'Lesson deleted successfully!',
        }
    } catch (error) {
        return errorHandling(error)
    }
}
