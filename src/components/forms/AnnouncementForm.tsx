'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { useFormState } from 'react-dom'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import Select from 'react-select'
import { toast } from 'react-toastify'

import { createAnnouncement, updateAnnouncement } from '@/lib/actions'
import {
    AnnouncementInputs,
    announcementSchema,
} from '@/lib/formValidationSchema'

import InputField from '../InputField'

const AnnouncementForm = ({
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
    const defaultAssignment = {
        ...data,
        date: data?.date && new Date(data.date).toISOString().slice(0, 16),
        classId: data?.classId ? data.classId : '',
    }
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<AnnouncementInputs>({
        resolver: zodResolver(announcementSchema),
        defaultValues: defaultAssignment,
    })
    const router = useRouter()
    const [classOptions, setClassOptions] = useState([])
    const [state, formAction] = useFormState(
        type === 'create' ? createAnnouncement : updateAnnouncement,
        {
            success: false,
            error: false,
            message: '',
        }
    )

    useEffect(() => {
        if (relatedData?.classes) {
            setClassOptions(
                relatedData.classes.map((lesson: any) => ({
                    value: lesson.id,
                    label: lesson.name,
                }))
            )
        }
    }, [relatedData])

    useEffect(() => {
        if (state?.success) {
            toast.success(
                type === 'create'
                    ? 'Announcement created successfully'
                    : 'Announcement updated successfully'
            )
            setOpen(false)
            router.refresh()
        }
    }, [state, setOpen, type, router])

    const onSubmit: SubmitHandler<AnnouncementInputs> = (data) =>
        formAction(data)

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
            <h3 className="text-2xl font-semibold">
                {type === 'create' ? 'Create' : 'Update'} Assignment
            </h3>
            {state.error && (
                <span className="text-red-500">
                    {state.message || 'Something went wrong'}
                </span>
            )}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                <InputField label="Id" name="id" register={register} hidden />
                <InputField
                    label="Title"
                    name="title"
                    register={register}
                    error={errors.title}
                />
                <InputField
                    label="Description"
                    name="description"
                    register={register}
                    error={errors.description}
                />
                <InputField
                    label="Date"
                    name="date"
                    register={register}
                    type="datetime-local"
                    error={errors.date}
                />
                <div className="flex w-full flex-col gap-2">
                    <label className="text-xs text-gray-500">Lesson</label>
                    <Controller
                        name="classId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={classOptions}
                                value={classOptions.find(
                                    (lesson: any) =>
                                        lesson.value === field.value
                                )}
                                onChange={(e: any) => {
                                    const selectedClass = e.value
                                    field.onChange(selectedClass)
                                }}
                            />
                        )}
                    />
                    {errors.classId && (
                        <p className="text-xs text-red-400">
                            {errors.classId.message}
                        </p>
                    )}
                </div>
            </div>
            <button
                type="submit"
                className="w-full rounded-md bg-blue-400 p-2 text-white"
            >
                {type === 'create' ? 'Create' : 'Update'}
            </button>
        </form>
    )
}

export default AnnouncementForm
