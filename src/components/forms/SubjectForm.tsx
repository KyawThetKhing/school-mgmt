'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import { toast } from 'react-toastify'

// local imports

import { createSubject, updateSubject } from '@/lib/actions'
import { subjectSchema, SubjectInputs } from '@/lib/formValidationSchema'

import InputField from '../InputField'

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
    const defaultSubject = {
        ...data,
        teachers: data?.teachers?.map((teacher: any) => String(teacher.id)),
    }
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<SubjectInputs>({
        resolver: zodResolver(subjectSchema),
        defaultValues: defaultSubject,
    })

    const [state, formAction] = useFormState(
        type === 'create' ? createSubject : updateSubject,
        {
            success: false,
            error: false,
            message: '',
        }
    )
    const [teacherOptions, setTeacherOptions] = useState([])

    const router = useRouter()

    const onSubmit = handleSubmit((data) => {
        formAction(data)
    })

    useEffect(() => {
        if (relatedData) {
            const options = relatedData.teachers.map((teacher: any) => ({
                value: String(teacher.id),
                label: teacher.name + ' ' + teacher.surname,
            }))
            setTeacherOptions(options)
        }
    }, [relatedData])

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

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div>
                    <InputField
                        label="Subject Name"
                        name="name"
                        defaultValue={data?.name}
                        register={register}
                        error={errors?.name}
                    />
                </div>
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
                <div>
                    <label className="text-xs text-gray-500">Teachers</label>
                    <Controller
                        name="teachers"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={teacherOptions}
                                isMulti
                                closeMenuOnSelect={false}
                                isSearchable
                                value={teacherOptions.filter(
                                    (option: {
                                        value: string
                                        label: string
                                    }) =>
                                        field.value?.includes(
                                            String(option.value)
                                        )
                                )}
                                onChange={(val) => {
                                    const selectedValues =
                                        val?.map((v: any) => String(v.value)) ||
                                        []
                                    field.onChange(selectedValues)
                                }}
                            />
                        )}
                    />
                    {/* <select
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
                    </select> */}
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
