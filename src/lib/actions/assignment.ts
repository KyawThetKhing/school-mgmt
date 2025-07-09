'use server'
import { errorHandling } from '@/lib/errorHandling'
import { AssignmentInputs } from '@/lib/formValidationSchema'
import { prisma } from '@/lib/prisma'
import { role } from '@/lib/utils'
import { CurrentState } from '@/type'

export const createAssignment = async (
    currentState: CurrentState,
    data: AssignmentInputs
): Promise<{ success: boolean; error: boolean; message?: string }> => {
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to create an assignment.',
            }
        }
        await prisma.assignment.create({
            data: {
                title: data.title,
                startDate: data.startDate,
                dueDate: data.dueDate,
                lessonId: data.lessonId,
            },
        })
        return {
            success: true,
            error: false,
            message: 'Assignment created successfully!',
        }
    } catch (error) {
        return errorHandling(error)
    }
}

export const updateAssignment = async (
    currentState: CurrentState,
    data: AssignmentInputs
): Promise<{ success: boolean; error: boolean; message?: string }> => {
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to update an assignment.',
            }
        }
        if (!data.id)
            return {
                success: false,
                error: true,
                message: 'Assignment ID is missing',
            }
        await prisma.assignment.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                startDate: data.startDate,
                dueDate: data.dueDate,
                lessonId: data.lessonId,
            },
        })
        return {
            success: true,
            error: false,
            message: 'Assignment updated successfully!',
        }
    } catch (error) {
        return errorHandling(error)
    }
}

export const deleteAssignment = async (
    id: number
): Promise<{ success: boolean; error: boolean; message?: string }> => {
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to delete an assignment.',
            }
        }
        const existingAssignment = await prisma.assignment.findUnique({
            where: { id },
        })
        if (!existingAssignment) {
            return {
                success: false,
                error: true,
                message: 'Assignment not found.',
            }
        }
        await prisma.assignment.delete({
            where: {
                id,
            },
        })
        return {
            success: true,
            error: false,
            message: 'Assignment deleted successfully!',
        }
    } catch (error) {
        return errorHandling(error)
    }
}
