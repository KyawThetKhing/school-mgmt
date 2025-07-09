'use server'
import { clerkClient } from '@clerk/nextjs/server'

import { errorHandling } from '@/lib/errorHandling'
import { StudentInputs } from '@/lib/formValidationSchema'
import { prisma } from '@/lib/prisma'
import { isClerkUser, role } from '@/lib/utils'
import { CurrentState } from '@/type'

export const createStudent = async (
    currentState: CurrentState,
    data: StudentInputs
): Promise<{ success: boolean; error: boolean; message?: string }> => {
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to create a student.',
            }
        }
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
            return {
                success: false,
                error: true,
                message: 'Class capacity is full',
            }
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
        return errorHandling(error)
    }
}

export const updateStudent = async (
    currentState: CurrentState,
    data: StudentInputs
): Promise<{ success: boolean; error: boolean; message?: string }> => {
    if (role !== 'admin') {
        return {
            success: false,
            error: true,
            message: 'You are not authorized to update a student.',
        }
    }
    if (!data.id)
        return { success: false, error: true, message: 'Student ID is missing' }
    try {
        if (isClerkUser(data.id)) {
            await clerkClient().users.updateUser(data.id, {
                username: data.username,
                firstName: data.name,
                lastName: data.surname,
                ...(data.password && { password: data.password }),
                // emailAddress: data.email,
            })
        }
        await prisma.student.update({
            where: {
                id: data.id,
            },
            data: {
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
        return errorHandling(error)
    }
}

export const deleteStudent = async (
    id: string
): Promise<{ success: boolean; error: boolean; message?: string }> => {
    if (role !== 'admin') {
        return {
            success: false,
            error: true,
            message: 'You are not authorized to delete a student.',
        }
    }
    try {
        const existingStudent = await prisma.student.findUnique({
            where: { id },
        })
        if (!existingStudent) {
            return {
                success: false,
                error: true,
                message: 'Student not found.',
            }
        }
        if (isClerkUser(id)) {
            await clerkClient().users.deleteUser(id)
        }

        await prisma.student.delete({
            where: {
                id: id,
            },
        })

        return { success: true, error: false }
    } catch (error) {
        return errorHandling(error)
    }
}
