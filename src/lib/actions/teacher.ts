'use server'
import { clerkClient } from '@clerk/nextjs/server'

import { errorHandling } from '@/lib/errorHandling'
import { TeacherInputs } from '@/lib/formValidationSchema'
import { prisma } from '@/lib/prisma'
import { role } from '@/lib/utils'
import { CurrentState } from '@/type'

export const createTeacher = async (
    currentState: CurrentState,
    data: TeacherInputs
): Promise<{ success: boolean; error: boolean; message?: string }> => {
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to create a teacher.',
            }
        }
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
        return errorHandling(error)
    }
}

export const updateTeacher = async (
    currentState: CurrentState,
    data: TeacherInputs
): Promise<{ success: boolean; error: boolean; message?: string }> => {
    if (!data.id)
        return { success: false, error: true, message: 'Teacher ID is missing' }
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to update a teacher.',
            }
        }
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
        return errorHandling(error)
    }
}

export const deleteTeacher = async (
    id: string
): Promise<{ success: boolean; error: boolean; message?: string }> => {
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to delete a teacher.',
            }
        }
        const existingTeacher = await prisma.teacher.findUnique({
            where: { id },
        })
        if (!existingTeacher) {
            return {
                success: false,
                error: true,
                message: 'Teacher not found.',
            }
        }
        await clerkClient.users.deleteUser(id)
        await prisma.teacher.delete({
            where: {
                id: id,
            },
        })

        return { success: true, error: false }
    } catch (error) {
        return errorHandling(error)
    }
}
