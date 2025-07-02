import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { createClass, updateClass } from '@/lib/actions'
import { ClassInputs, classSchema } from '@/lib/formValidationSchema'


import InputField from '../InputField'

const ClassForm = ({
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
        formState: { errors },
    } = useForm<ClassInputs>({
        resolver: zodResolver(classSchema),
    })
    const router = useRouter()

    const [state, formAction] = useFormState(
        type === 'create' ? createClass : updateClass,
        {
            success: false,
            error: false,
            message: '',
        }
    )

    const onSubmit = handleSubmit((data) => {
        formAction(data)
    })

    useEffect(() => {
        if (state.success) {
            toast(
                type === 'create'
                    ? 'Class created successfully!'
                    : 'Class updated successfully!'
            )
            setOpen(false)
            router.refresh()
        }
    }, [state, setOpen, router, type])

    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <div>
                <h1 className="text-xl font-semibold">
                    {type === 'create' ? 'Create a new class' : 'Update class'}
                </h1>
            </div>
            {state.error && (
                <p className="text-red-500">
                    {state.message || 'Something went wrong'}
                </p>
            )}
            {/* Form */}
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="flex flex-wrap justify-between gap-4">
                    <InputField
                        label="Id"
                        name="id"
                        register={register}
                        defaultValue={data?.id}
                        error={errors.id}
                        hidden
                    />
                    <InputField
                        label="Class name"
                        type="text"
                        register={register}
                        name="name"
                        defaultValue={data?.name}
                        error={errors.name}
                    />
                    <InputField
                        label="Capacity"
                        type="number"
                        register={register}
                        name="capacity"
                        defaultValue={data?.capacity}
                        error={errors.capacity}
                    />
                    <div className="flex w-full flex-col gap-2 md:w-1/4">
                        <label className="text-xs text-gray-500">
                            Supervisor
                        </label>
                        <select
                            className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
                            {...register('supervisorId')}
                            defaultValue={data?.supervisorId}
                        >
                            {relatedData.teachers.map((teacher: any) => (
                                <option key={teacher.id} value={teacher.id}>
                                    {teacher.name + ' ' + teacher.surname}
                                </option>
                            ))}
                        </select>
                        {errors.supervisorId?.message && (
                            <p className="text-xs text-red-400">
                                {errors.supervisorId.message.toString()}
                            </p>
                        )}
                    </div>
                    <div className="flex w-full flex-col gap-2 md:w-1/4">
                        <label className="text-xs text-gray-500">Grade</label>
                        <select
                            className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
                            {...register('gradeId')}
                            defaultValue={data?.gradeId}
                        >
                            {relatedData.grades.map((grade: any) => (
                                <option key={grade.id} value={grade.id}>
                                    {grade.level}
                                </option>
                            ))}
                        </select>
                        {errors.gradeId?.message && (
                            <p className="text-xs text-red-400">
                                {errors.gradeId.message.toString()}
                            </p>
                        )}
                    </div>
                </div>

                {/* <InputField
                    label="Lessons"
                    type="text"
                    register={register}
                    name="lessons"
                    defaultValue={data?.lessons}
                    error={errors.lessons}
                /> */}
                <button
                    type="submit"
                    className="rounded-md bg-blue-400 p-2 text-white"
                >
                    {type === 'create' ? 'Create' : 'Update'}
                </button>
            </form>
        </div>
    )
}

export default ClassForm
