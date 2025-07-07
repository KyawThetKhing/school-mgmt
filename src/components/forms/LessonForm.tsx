'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { useFormState } from 'react-dom'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import Select from 'react-select'
import { toast } from 'react-toastify'

import { createLesson, updateLesson } from '@/lib/actions'
import { WEEK_DAYS } from '@/lib/constant'
import { LessonInputs, lessonSchema } from '@/lib/formValidationSchema'

import InputField from '../InputField'

const LessonForm = ({
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
    const router = useRouter()
    const lessonData = {
        ...data,
        subject: data?.subject?.id,
        class: data?.class?.id,
        teacher: String(data?.teacher?.id),
        startTime:
            data?.startTime &&
            new Date(data.startTime).toISOString().slice(0, 16),
        endTime:
            data?.endTime && new Date(data.endTime).toISOString().slice(0, 16),
    }
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<LessonInputs>({
        resolver: zodResolver(lessonSchema),
        defaultValues: lessonData,
    })
    const [subjectOptions, setSubjectOptions] = useState<any[]>([])
    const [classOptions, setClassOptions] = useState<any[]>([])
    const [teacherOptions, setTeacherOptions] = useState<any[]>([])

    const [state, formAction] = useFormState(
        type === 'create' ? createLesson : updateLesson,
        {
            success: false,
            error: false,
            message: '',
        }
    )

    const onSubmit: SubmitHandler<any> = (data) => {
        formAction(data)
    }
    useEffect(() => {
        if (relatedData) {
            setSubjectOptions(
                relatedData.subjects.map((subject: any) => ({
                    value: subject.id,
                    label: subject.name,
                }))
            )
            setClassOptions(
                relatedData.classes.map((classItem: any) => ({
                    value: classItem.id,
                    label: classItem.name,
                }))
            )
            setTeacherOptions(
                relatedData.teachers.map((teacher: any) => ({
                    value: teacher.id,
                    label: teacher.name + ' ' + teacher.surname,
                }))
            )
        }
    }, [relatedData])

    useEffect(() => {
        if (state.success) {
            setOpen(false)
            toast.success(
                `Lesson has been ${type === 'create' ? 'created' : 'updated'} successfully!`
            )
            router.refresh()
        }
    }, [state, setOpen, router, type])

    useEffect(() => {}, [errors])

    return (
        <form
            className="flex flex-col gap-8 p-4"
            onSubmit={handleSubmit(onSubmit)}
        >
            <h1 className="text-xl font-semibold">
                {type === 'create' ? 'Create' : 'Update'} Lesson
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
                    error={errors.id}
                    hidden
                />
                <InputField
                    label="Name"
                    name="name"
                    register={register}
                    error={errors.name}
                    inputProps={{ placeholder: 'Enter lesson name' }}
                />
                <div>
                    <label className="text-xs text-gray-500">Day</label>
                    <Controller
                        name="day"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={WEEK_DAYS}
                                value={WEEK_DAYS.find(
                                    (day: any) => day.value === field.value
                                )}
                                onChange={(e: any) => {
                                    field.onChange(String(e.value))
                                }}
                            />
                        )}
                    />
                    {errors.day && (
                        <p className="text-xs text-red-400">
                            {errors.day.message}
                        </p>
                    )}
                </div>

                <InputField
                    label="Start Time"
                    name="startTime"
                    register={register}
                    type="datetime-local"
                    error={errors.startTime}
                />
                <InputField
                    label="End Time"
                    name="endTime"
                    register={register}
                    type="datetime-local"
                    error={errors.endTime}
                />
                <div>
                    <label className="text-xs text-gray-500">Subject</label>
                    <Controller
                        name="subject"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={subjectOptions}
                                value={subjectOptions.find(
                                    (subject: any) =>
                                        subject.value === field.value
                                )}
                                onChange={(e) => {
                                    field.onChange(String(e.value))
                                }}
                            />
                        )}
                    />
                    {errors.subject && (
                        <p className="text-xs text-red-400">
                            {errors.subject.message}
                        </p>
                    )}
                </div>
                <div>
                    <label className="text-xs text-gray-500">Class</label>
                    <Controller
                        name="class"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={classOptions}
                                value={classOptions.find(
                                    (classItem: any) =>
                                        classItem.value === field.value
                                )}
                                onChange={(e) => {
                                    field.onChange(String(e.value))
                                }}
                            />
                        )}
                    />
                    {errors.class && (
                        <p className="text-xs text-red-400">
                            {errors.class.message}
                        </p>
                    )}
                </div>
                <div>
                    <label className="text-xs text-gray-500">Teacher</label>
                    <Controller
                        name="teacher"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={teacherOptions}
                                value={teacherOptions.find(
                                    (teacher: any) =>
                                        teacher.value === field.value
                                )}
                                onChange={(e) => {
                                    field.onChange(String(e.value))
                                }}
                            />
                        )}
                    />
                    {errors.teacher && (
                        <p className="text-xs text-red-400">
                            {errors.teacher.message}
                        </p>
                    )}
                </div>
            </div>
            <button
                type="submit"
                className="w-full rounded-md bg-blue-500 p-2 text-white"
            >
                {type === 'create' ? 'Create' : 'Update'}
            </button>
        </form>
    )
}

export default LessonForm
