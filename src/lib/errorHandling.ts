'use server'
import { Prisma } from '@prisma/client'

export const errorHandling = (error: any) => {
    let message = 'An unexpected error occurred.'

    // Handle Clerk errors
    if (error?.errors && Array.isArray(error.errors)) {
        message = `Clerk error: ${error.errors[0].message}`
    }
    // Handle Prisma-specific errors
    else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            message =
                'Duplicate entry. A user with this username/email already exists.'
        } else {
            message = `Database error: ${error.message}`
        }
    }
    // Handle other known types
    else if (error instanceof Error) {
        message = error.message
    }

    return { success: false, error: true, message }
}
