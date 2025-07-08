import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import { toast } from 'react-toastify'

// local imports
import { createEvent, updateEvent } from '@/lib/actions'
import { EventInputs, eventSchema } from '@/lib/formValidationSchema'

import InputField from '../InputField'

const EventForm = ({
    setOpen,
    type,
    data,
    relatedData,
}: {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    type: 'create' | 'update'
    data: any
    relatedData?: any
}) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<EventInputs>({
        resolver: zodResolver(eventSchema),
    })

    const [classOptions, setClassOptions] = useState([])
    const [state, formAction] = useFormState(
        type === 'create' ? createEvent : updateEvent,
        {
            success: false,
            error: false,
            message: '',
        }
    )

    const router = useRouter()

    const onSubmit = handleSubmit((data) => {
        formAction(data)
    })

    useEffect(() => {
        if (relatedData) {
            const options = relatedData.classes.map((lesson: any) => ({
                value: lesson.id,
                label: lesson.name,
            }))
            setClassOptions(options)
        }
    }, [relatedData])

    useEffect(() => {
        if (state.success) {
            toast.success(
                `Event ${type === 'create' ? 'created' : 'updated'} successfully`
            )
            setOpen(false)
            router.refresh()
        }
    }, [state, type, router, setOpen])

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === 'create' ? 'Create a new event' : 'Update event'}
            </h1>
            {state.error && (
                <p className="text-red-500">
                    {state.message || 'Something went wrong'}
                </p>
            )}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {data && (
                    <InputField
                        label="Id"
                        name="id"
                        defaultValue={data?.id}
                        register={register}
                        error={errors?.id}
                        hidden
                    />
                )}

                <InputField
                    label="Title"
                    name="title"
                    defaultValue={data?.title}
                    register={register}
                    error={errors?.title}
                />
                <InputField
                    label="Description"
                    name="description"
                    defaultValue={data?.description}
                    register={register}
                    error={errors?.description}
                />
                <InputField
                    label="Start Time"
                    name="startTime"
                    defaultValue={
                        data?.startTime &&
                        new Date(data.startTime).toISOString().slice(0, 16)
                    }
                    register={register}
                    error={errors?.startTime}
                    type="datetime-local"
                />
                <InputField
                    label="End Time"
                    name="endTime"
                    defaultValue={
                        data?.endTime &&
                        new Date(data.endTime).toISOString().slice(0, 16)
                    }
                    register={register}
                    error={errors?.endTime}
                    type="datetime-local"
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
                                    const selectedLesson = e.value
                                    field.onChange(selectedLesson)
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
            <button className="rounded-md bg-blue-400 p-2 text-white">
                {type === 'create' ? 'Create' : 'Update'}
            </button>
        </form>
    )
}

export default EventForm
