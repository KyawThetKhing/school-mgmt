'use server'
import { errorHandling } from '@/lib/errorHandling'
import { AnnouncementInputs } from '@/lib/formValidationSchema'
import { prisma } from '@/lib/prisma'
import { role } from '@/lib/utils'
import { CurrentState } from '@/type'

export const createAnnouncement = async (
    currentState: CurrentState,
    data: AnnouncementInputs
): Promise<{ success: boolean; error: boolean; message?: string }> => {
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to create an announcement.',
            }
        }
        await prisma.announcement.create({
            data: {
                title: data.title,
                description: data.description,
                date: data.date,
                classId: data.classId || null,
            },
        })
        return {
            success: true,
            error: false,
            message: 'Announcement created successfully!',
        }
    } catch (error) {
        return errorHandling(error)
    }
}

export const updateAnnouncement = async (
    currentState: CurrentState,
    data: AnnouncementInputs
): Promise<{ success: boolean; error: boolean; message?: string }> => {
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to update an announcement.',
            }
        }
        if (!data.id)
            return {
                success: false,
                error: true,
                message: 'Announcement ID is missing',
            }
        await prisma.announcement.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                description: data.description,
                date: data.date,
                classId: data.classId || null,
            },
        })
        return {
            success: true,
            error: false,
            message: 'Announcement updated successfully!',
        }
    } catch (error) {
        return errorHandling(error)
    }
}

export const deleteAnnouncement = async (
    id: number
): Promise<{ success: boolean; error: boolean; message?: string }> => {
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to delete an announcement.',
            }
        }
        const existingAnnouncement = await prisma.announcement.findUnique({
            where: { id },
        })
        if (!existingAnnouncement) {
            return {
                success: false,
                error: true,
                message: 'Announcement not found.',
            }
        }
        await prisma.announcement.delete({
            where: {
                id,
            },
        })
        return {
            success: true,
            error: false,
            message: 'Announcement deleted successfully!',
        }
    } catch (error) {
        return errorHandling(error)
    }
}
