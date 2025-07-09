'use server'
import { errorHandling } from '@/lib/errorHandling'
import { SubjectInputs } from '@/lib/formValidationSchema'
import { prisma } from '@/lib/prisma'
import { role } from '@/lib/utils'
import { CurrentState } from '@/type'

export const createSubject = async (
    currentState: CurrentState,
    data: SubjectInputs
): Promise<CurrentState> => {
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to create a subject.',
            }
        }
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
        return { success: true, error: false }
    } catch (error) {
        return errorHandling(error)
    }
}

export const updateSubject = async (
    currentState: CurrentState,
    data: SubjectInputs
): Promise<CurrentState> => {
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to update a subject.',
            }
        }
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
    } catch (error) {
        return errorHandling(error)
    }
}

export const deleteSubject = async (id: number): Promise<CurrentState> => {
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to delete a subject.',
            }
        }
        const existingSubject = await prisma.subject.findUnique({
            where: { id },
        })
        if (!existingSubject) {
            return {
                success: false,
                error: true,
                message: 'Subject not found.',
            }
        }
        await prisma.subject.delete({
            where: {
                id,
            },
        })

        return { success: true, error: false }
    } catch (error) {
        return errorHandling(error)
    }
}
