'use server'
import { errorHandling } from '@/lib/errorHandling'
import { ClassInputs } from '@/lib/formValidationSchema'
import { prisma } from '@/lib/prisma'
import { role } from '@/lib/utils'
import { CurrentState } from '@/type'

export const createClass = async (
    currentState: CurrentState,
    data: ClassInputs
): Promise<CurrentState> => {
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to create a class.',
            }
        }
        await prisma.class.create({
            data: {
                name: data.name,
                capacity: data.capacity,
                supervisorId: data.supervisorId,
                gradeId: data.gradeId,
            },
        })
        return { success: true, error: false }
    } catch (error) {
        return errorHandling(error)
    }
}

export const updateClass = async (
    currentState: CurrentState,
    data: ClassInputs
): Promise<CurrentState> => {
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to update a class.',
            }
        }
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
    } catch (error) {
        return errorHandling(error)
    }
}

export const deleteClass = async (id: number): Promise<CurrentState> => {
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to delete a class.',
            }
        }
        const existingClass = await prisma.class.findUnique({ where: { id } })
        if (!existingClass) {
            return {
                success: false,
                error: true,
                message: 'Class not found.',
            }
        }
        await prisma.class.delete({
            where: {
                id,
            },
        })

        return { success: true, error: false }
    } catch (error) {
        return errorHandling(error)
    }
}
