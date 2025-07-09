'use server'
import { errorHandling } from '@/lib/errorHandling'
import { EventInputs } from '@/lib/formValidationSchema'
import { prisma } from '@/lib/prisma'
import { role } from '@/lib/utils'
import { CurrentState } from '@/type'

export const createEvent = async (
    currentState: CurrentState,
    data: EventInputs
): Promise<{ success: boolean; error: boolean; message?: string }> => {
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to create an event.',
            }
        }
        await prisma.event.create({
            data: {
                title: data.title,
                description: data.description,
                startTime: data.startTime,
                endTime: data.endTime,
                classId: data.classId,
            },
        })
        return {
            success: true,
            error: false,
            message: 'Event created successfully!',
        }
    } catch (error) {
        return errorHandling(error)
    }
}

export const updateEvent = async (
    currentState: CurrentState,
    data: EventInputs
): Promise<{ success: boolean; error: boolean; message?: string }> => {
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to update an event.',
            }
        }
        if (!data.id)
            return {
                success: false,
                error: true,
                message: 'Event ID is missing',
            }
        await prisma.event.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                description: data.description,
                startTime: data.startTime,
                endTime: data.endTime,
                classId: data.classId,
            },
        })
        return {
            success: true,
            error: false,
            message: 'Event updated successfully!',
        }
    } catch (error) {
        return errorHandling(error)
    }
}

export const deleteEvent = async (
    id: number
): Promise<{ success: boolean; error: boolean; message?: string }> => {
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to delete an event.',
            }
        }
        const existingEvent = await prisma.event.findUnique({ where: { id } })
        if (!existingEvent) {
            return {
                success: false,
                error: true,
                message: 'Event not found.',
            }
        }
        await prisma.event.delete({
            where: {
                id,
            },
        })
        return {
            success: true,
            error: false,
            message: 'Event deleted successfully!',
        }
    } catch (error) {
        return errorHandling(error)
    }
}
