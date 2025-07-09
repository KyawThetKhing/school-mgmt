'use server'
import { errorHandling } from '@/lib/errorHandling'
import { ResultInputs } from '@/lib/formValidationSchema'
import { prisma } from '@/lib/prisma'
import { role } from '@/lib/utils'
import { CurrentState } from '@/type'

export const createResult = async (
    currentState: CurrentState,
    data: ResultInputs
): Promise<{ success: boolean; error: boolean; message?: string }> => {
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to create a result.',
            }
        }
        await prisma.result.create({
            data: {
                score: data.score,
                examId: data.examId,
                studentId: data.studentId,
                assignmentId: data.assignmentId,
            },
        })
        return {
            success: true,
            error: false,
            message: 'Result created successfully!',
        }
    } catch (error) {
        return errorHandling(error)
    }
}

export const updateResult = async (
    currentState: CurrentState,
    data: ResultInputs
): Promise<{ success: boolean; error: boolean; message?: string }> => {
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to update a result.',
            }
        }
        if (!data.id)
            return {
                success: false,
                error: true,
                message: 'Result ID is missing',
            }
        await prisma.result.update({
            where: {
                id: data.id,
            },
            data: {
                score: data.score,
                examId: data.examId,
                studentId: data.studentId,
                assignmentId: data.assignmentId,
            },
        })
        return {
            success: true,
            error: false,
            message: 'Result updated successfully!',
        }
    } catch (error) {
        return errorHandling(error)
    }
}

export const deleteResult = async (
    id: number
): Promise<{ success: boolean; error: boolean; message?: string }> => {
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to delete a result.',
            }
        }
        const existingResult = await prisma.result.findUnique({ where: { id } })
        if (!existingResult) {
            return {
                success: false,
                error: true,
                message: 'Result not found.',
            }
        }
        await prisma.result.delete({
            where: {
                id,
            },
        })
        return {
            success: true,
            error: false,
            message: 'Result deleted successfully!',
        }
    } catch (error) {
        return errorHandling(error)
    }
}
