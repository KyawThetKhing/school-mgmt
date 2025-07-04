import { auth } from '@clerk/nextjs/server'

const { userId, sessionClaims } = await auth()
export const role = (sessionClaims?.metadata as { role?: string }).role
export const currentUserId = userId

export const isClerkUser = (userId: string) => {
    const prefix = userId.split('_')[0]
    return prefix === 'user'
}
