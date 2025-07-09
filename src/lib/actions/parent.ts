'use server'
import { clerkClient } from '@clerk/nextjs/server'

import { errorHandling } from '@/lib/errorHandling'
import { ParentInputs } from '@/lib/formValidationSchema'
import { prisma } from '@/lib/prisma'
import { role } from '@/lib/utils'
import { CurrentState } from '@/type'

export const createParent = async (
    currentState: CurrentState,
    data: ParentInputs
): Promise<{ success: boolean; error: boolean; message?: string }> => {
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to create a parent.',
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
                role: 'parent',
            },
        })

        //create user in prisma
        await prisma.parent.create({
            data: {
                id: user.id,
                username: rest.username,
                email: rest.email,
                name: rest.name,
                surname: rest.surname,
                phone: rest.phone,
                address: rest.address,
            },
        })
        return {
            success: true,
            error: false,
            message: 'Parent created successfully!',
        }
    } catch (error) {
        return errorHandling(error)
    }
}

export const updateParent = async (
    currentState: CurrentState,
    data: ParentInputs
): Promise<{ success: boolean; error: boolean; message?: string }> => {
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to update a parent.',
            }
        }
        if (!data.id)
            return {
                success: false,
                error: true,
                message: 'Parent ID is missing',
            }
        await clerkClient().users.updateUser(data.id, {
            username: data.username,
            firstName: data.name,
            lastName: data.surname,
            ...(data.password && { password: data.password }),
            // emailAddress: data.email,
        })
        await prisma.parent.update({
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
            },
        })
        return {
            success: true,
            error: false,
            message: 'Parent updated successfully!',
        }
    } catch (error) {
        return errorHandling(error)
    }
}

export const deleteParent = async (
    id: string
): Promise<{ success: boolean; error: boolean; message?: string }> => {
    try {
        if (role !== 'admin') {
            return {
                success: false,
                error: true,
                message: 'You are not authorized to delete a parent.',
            }
        }
        const existingParent = await prisma.parent.findUnique({ where: { id } })
        if (!existingParent) {
            return {
                success: false,
                error: true,
                message: 'Parent not found.',
            }
        }
        await clerkClient().users.deleteUser(id)
        await prisma.parent.delete({
            where: {
                id: id,
            },
        })

        return {
            success: true,
            error: false,
            message: 'Parent deleted successfully!',
        }
    } catch (error) {
        return errorHandling(error)
    }
}
