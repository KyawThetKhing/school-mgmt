import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

// local imports
import { createExam, updateExam } from '@/lib/actions'
import { examSchema, ExamInputs } from '@/lib/formValidationSchema'

import InputField from '../InputField'


const ExamForm = ({
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
        formState: { errors },
    } = useForm<ExamInputs>({
        resolver: zodResolver(examSchema),
    })

    const [state, formAction] = useFormState(
        type === 'create' ? createExam : updateExam,
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
        if (state.success) {
            toast.success(
                `Exam ${type === 'create' ? 'created' : 'updated'} successfully`
            )
            setOpen(false)
            router.refresh()
        }
    }, [state, type, router, setOpen])

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === 'create' ? 'Create a new exam' : 'Update exam'}
            </h1>
            {state.error && (
                <p className="text-red-500">
                    {state.message || 'Something went wrong'}
                </p>
            )}

            <div className="flex flex-wrap justify-between gap-4">
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
                    label="Start Date"
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
                    label="End Date"
                    name="endTime"
                    defaultValue={
                        data?.endTime &&
                        new Date(data.endTime).toISOString().slice(0, 16)
                    }
                    register={register}
                    error={errors?.endTime}
                    type="datetime-local"
                />
                <div className="flex w-full flex-col gap-2 md:w-1/4">
                    <label className="text-xs text-gray-500">Sex</label>
                    <select
                        className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
                        {...register('lessonId')}
                        defaultValue={data?.lessonId}
                    >
                        {relatedData.lessons.map(
                            (lesson: {
                                id: number
                                name: string
                                teacher: any
                            }) => (
                                <option key={lesson.id} value={lesson.id}>
                                    {lesson.name +
                                        ' - ' +
                                        lesson?.teacher?.name}
                                </option>
                            )
                        )}
                    </select>
                    {errors.lessonId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.lessonId.message.toString()}
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

export default ExamForm
