'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const LoginPage = () => {
    const { isSignedIn, user, isLoaded } = useUser()
    const router = useRouter()

    useEffect(() => {
        const role = user?.publicMetadata.role
        if (role) {
            router.push(`/${role}`)
        }
    }, [user, router])

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-sky">
            <SignIn.Root>
                <SignIn.Step
                    name="start"
                    className="flex min-w-[90%] flex-col gap-2 rounded-md bg-white p-12 shadow-2xl md:min-w-[400px]"
                >
                    <h1 className="flex gap-2 text-xl font-semibold">
                        <Image src="/logo.png" alt="" width={20} height={20} />
                        School Mgmt
                    </h1>
                    <h2 className="text-lg font-semibold text-gray-400">
                        Sign in to your account
                    </h2>

                    <Clerk.GlobalError className="text-sm text-red-400" />
                    <Clerk.Field
                        name="identifier"
                        className="flex flex-col gap-2"
                    >
                        <Clerk.Label className="text-xs text-gray-500">
                            Email
                        </Clerk.Label>
                        <Clerk.Input
                            type="text"
                            className="rounded-md p-2 ring-1 ring-gray-300"
                        />
                        <Clerk.FieldError className="text-xs text-red-400" />
                    </Clerk.Field>
                    <Clerk.Field
                        name="password"
                        className="flex flex-col gap-2"
                    >
                        <Clerk.Label className="text-xs text-gray-500">
                            Password
                        </Clerk.Label>
                        <Clerk.Input
                            type="password"
                            className="rounded-md p-2 ring-1 ring-gray-300"
                        />
                        <Clerk.FieldError className="text-xs text-red-400" />
                    </Clerk.Field>
                    <SignIn.Action
                        submit
                        className="my-1 rounded-md bg-blue-500 p-2 text-sm text-white"
                    >
                        Sign in
                    </SignIn.Action>
                </SignIn.Step>
            </SignIn.Root>
        </div>
    )
}

export default LoginPage
