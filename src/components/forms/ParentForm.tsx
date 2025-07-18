'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { createParent, updateParent } from '@/lib/actions'
import { parentFormSchema, ParentInputs } from '@/lib/formValidationSchema'

import InputField from '../InputField'

const ParentForm = ({
    setOpen,
    type,
    data,
    relatedData,
}: {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    type: 'create' | 'update'
    data?: any
    relatedData?: any
}) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<ParentInputs>({
        resolver: zodResolver(parentFormSchema),
        defaultValues: data,
    })
    const router = useRouter()

    const [state, formAction] = useFormState(
        type === 'create' ? createParent : updateParent,
        {
            success: false,
            error: false,
            message: '',
        }
    )

    const onSubmit: SubmitHandler<ParentInputs> = (data) => {
        formAction(data)
    }

    useEffect(() => {
        if (state.success) {
            toast.success(
                `Parent ${type === 'create' ? 'created' : 'updated'} successfully`
            )
            setOpen(false)
            router.refresh()
        }
    }, [state, setOpen, type, router])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
            <h1 className="text-xl font-semibold">
                {type === 'create' ? 'Create a new parent' : 'Update parent'}
            </h1>
            {state.error && (
                <p className="text-red-500">
                    {state.message || 'Something went wrong'}
                </p>
            )}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                <InputField
                    label="Id"
                    name="id"
                    register={register}
                    error={errors?.id}
                    hidden
                />

                <InputField
                    label="Username"
                    name="username"
                    register={register}
                    error={errors?.username}
                />
                <InputField
                    label="Password"
                    name="password"
                    type="password"
                    register={register}
                    error={errors?.password}
                />
                <InputField
                    label="Name"
                    name="name"
                    register={register}
                    error={errors?.name}
                />
                <InputField
                    label="Surname"
                    name="surname"
                    register={register}
                    error={errors?.surname}
                />
                <InputField
                    label="Email"
                    name="email"
                    register={register}
                    error={errors?.email}
                />
                <InputField
                    label="Phone"
                    name="phone"
                    register={register}
                    error={errors?.phone}
                />
                <InputField
                    label="Address"
                    name="address"
                    register={register}
                    error={errors?.address}
                />
            </div>

            <button
                className="rounded-md bg-blue-400 p-2 text-white"
                type="submit"
            >
                {type === 'create' ? 'Create' : 'Update'}
            </button>
        </form>
    )
}

export default ParentForm
