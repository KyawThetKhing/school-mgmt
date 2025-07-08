'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { useFormState } from 'react-dom'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import Select from 'react-select'
import { toast } from 'react-toastify'

import { createAssignment, updateAssignment } from '@/lib/actions'
import { AssignmentInputs, assignmentSchema } from '@/lib/formValidationSchema'

import InputField from '../InputField'

const AssignmentForm = ({
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
        startDate:
            data?.startDate &&
            new Date(data.startDate).toISOString().slice(0, 16),
        dueDate:
            data?.dueDate && new Date(data.dueDate).toISOString().slice(0, 16),
        lessonId: data?.lessonId ? data.lessonId : '',
    }
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<AssignmentInputs>({
        resolver: zodResolver(assignmentSchema),
        defaultValues: defaultAssignment,
    })
    const router = useRouter()
    const [lessonOptions, setLessonOptions] = useState([])
    const [state, formAction] = useFormState(
        type === 'create' ? createAssignment : updateAssignment,
        {
            success: false,
            error: false,
            message: '',
        }
    )

    useEffect(() => {
        if (relatedData?.lessons) {
            setLessonOptions(
                relatedData.lessons.map((lesson: any) => ({
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
                    ? 'Assignment created successfully'
                    : 'Assignment updated successfully'
            )
            setOpen(false)
            router.refresh()
        }
    }, [state, setOpen, type, router])

    const onSubmit: SubmitHandler<AssignmentInputs> = (data) => formAction(data)

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
                <InputField
                    label="Title"
                    name="title"
                    register={register}
                    error={errors.title}
                />
                <InputField
                    label="Start Date"
                    name="startDate"
                    register={register}
                    type="datetime-local"
                    error={errors.startDate}
                />
                <InputField
                    label="Due Date"
                    name="dueDate"
                    register={register}
                    type="datetime-local"
                    error={errors.dueDate}
                />
                <div className="flex w-full flex-col gap-2">
                    <label className="text-xs text-gray-500">Lesson</label>
                    <Controller
                        name="lessonId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={lessonOptions}
                                value={lessonOptions.find(
                                    (lesson: any) =>
                                        lesson.value === field.value
                                )}
                                onChange={(e: any) => {
                                    const selectedLesson = e.value
                                    field.onChange(selectedLesson)
                                }}
                            />
                        )}
                    />
                    {errors.lessonId && (
                        <p className="text-xs text-red-400">
                            {errors.lessonId.message}
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

export default AssignmentForm
