import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormState } from 'react-dom'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

// local imports
import InputField from '../InputField'

import { subjectSchema, SubjectInputs } from '@/lib/formValidationSchema'
import { createSubject, updateSubject } from '@/lib/actions'

const SubjectForm = ({
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
    } = useForm<SubjectInputs>({
        resolver: zodResolver(subjectSchema),
    })

    const [state, formAction] = useFormState(
        type === 'create' ? createSubject : updateSubject,
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
                `Subject ${type === 'create' ? 'created' : 'updated'} successfully`
            )
            setOpen(false)
            router.refresh()
        }
    }, [state, type, router, setOpen])

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === 'create' ? 'Create a new subject' : 'Update subject'}
            </h1>

            {state.error && (
                <p className="text-red-500">
                    {state.message || 'Something went wrong'}
                </p>
            )}

            <div className="flex flex-wrap justify-between gap-4">
                <InputField
                    label="Subject Name"
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors?.name}
                />
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
                <div className="flex w-full flex-col gap-2 md:w-1/4">
                    <label className="text-xs text-gray-500">Sex</label>
                    <select
                        className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
                        {...register('teachers')}
                        defaultValue={data?.teachers}
                        multiple
                    >
                        {relatedData.teachers.map((teacher: any) => (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.name + ' ' + teacher.surname}
                            </option>
                        ))}
                    </select>
                    {errors.teachers?.message && (
                        <p className="text-xs text-red-400">
                            {errors.teachers.message.toString()}
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

export default SubjectForm
