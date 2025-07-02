'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { CldUploadWidget } from 'next-cloudinary'
import React, { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { toast } from 'react-toastify'

import { createTeacher, updateTeacher } from '@/lib/actions'
import { TeacherInputs, teacherSchema } from '@/lib/formValidationSchema'

import InputField from '../InputField'

const animatedComponents = makeAnimated()

const TecherForm = ({
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
    const defaultTeacher = {
        ...data,
        subjects: data?.subjects?.map((subject: any) => String(subject.id)),
    }
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<TeacherInputs>({
        resolver: zodResolver(teacherSchema),
        defaultValues: defaultTeacher,
    })
    const [img, setImg] = useState<any>('')
    const [subjectOptions, setSubjectOptions] = useState<any>([])

    const router = useRouter()

    const [state, formAction] = useFormState(
        type === 'create' ? createTeacher : updateTeacher,
        { success: false, error: false, message: '' }
    )

    const onSubmit = handleSubmit((data) => {
        formAction({ ...data, img: img?.secure_url })
    })

    useEffect(() => {
        if (state.success) {
            setOpen(false)
            toast.success(
                `Teacher has been ${type === 'create' ? 'created' : 'updated'} successfully!`
            )
            router.refresh()
        }
    }, [state, setOpen, router, type])

    useEffect(() => {
        if (relatedData?.subjects) {
            const formattedSubjects = relatedData?.subjects.map(
                (subject: any) => ({
                    value: subject.id,
                    label: subject.name,
                })
            )
            setSubjectOptions(formattedSubjects)
        }
    }, [relatedData])

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === 'create' ? 'Create a new teacher' : 'Update teacher'}
            </h1>
            <p>{errors.subjects?.message?.toString()}</p>

            {state.error && (
                <p className="text-red-500">
                    {state.message || 'Something went wrong'}
                </p>
            )}
            <span className="text-xs font-medium text-gray-400">
                Authentication Information
            </span>
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
                    label="Username"
                    name="username"
                    defaultValue={data?.username}
                    register={register}
                    error={errors?.username}
                />
                <InputField
                    label="Password"
                    name="password"
                    type="password"
                    defaultValue={data?.password}
                    register={register}
                    error={errors?.password}
                />
                <InputField
                    label="Name"
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors?.name}
                />
                <InputField
                    label="Surname"
                    name="surname"
                    defaultValue={data?.surname}
                    register={register}
                    error={errors?.surname}
                />
                <InputField
                    label="Email"
                    name="email"
                    defaultValue={data?.email}
                    register={register}
                    error={errors?.email}
                />
                <InputField
                    label="Phone"
                    name="phone"
                    defaultValue={data?.phone}
                    register={register}
                    error={errors?.phone}
                />
            </div>
            <span className="text-xs font-medium text-gray-400">
                Personal Information
            </span>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                <InputField
                    label="Address"
                    name="address"
                    defaultValue={data?.address}
                    register={register}
                    error={errors.address}
                />
                <InputField
                    label="Blood Type"
                    name="bloodType"
                    defaultValue={data?.bloodType}
                    register={register}
                    error={errors.bloodType}
                />
                <div className="flex w-full flex-col gap-2">
                    <label className="text-xs text-gray-500">Sex</label>
                    <select
                        className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
                        {...register('sex')}
                        defaultValue={data?.sex}
                    >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                    </select>
                    {errors.sex?.message && (
                        <p className="text-xs text-red-400">
                            {errors.sex.message.toString()}
                        </p>
                    )}
                </div>
                <InputField
                    label="Birthday"
                    name="birthday"
                    defaultValue={data?.birthday?.toISOString().split('T')[0]}
                    register={register}
                    error={errors.birthday}
                    type="date"
                />
                <div className="flex w-full flex-col gap-2">
                    <label className="text-xs text-gray-500">Subjects</label>
                    <Controller
                        name="subjects"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                isMulti
                                options={subjectOptions}
                                components={animatedComponents}
                                value={subjectOptions.filter(
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

                    {errors.subjects?.message && (
                        <p className="text-xs text-red-400">
                            {errors.subjects.message.toString()}
                        </p>
                    )}
                </div>

                <div className="flex w-full flex-col items-center justify-center">
                    <label className="opacity-0">Upload Image</label>
                    <CldUploadWidget
                        uploadPreset="school"
                        onSuccess={(result, { widget }) => {
                            setImg(result?.info)
                            widget.close()
                        }}
                    >
                        {({ open }) => {
                            return (
                                <div
                                    onClick={() => open()}
                                    className="flex cursor-pointer items-center gap-2 text-xs text-gray-500"
                                >
                                    <Image
                                        src="/upload.png"
                                        alt=""
                                        width={28}
                                        height={28}
                                    />
                                    <span>Upload a photo</span>
                                </div>
                            )
                        }}
                    </CldUploadWidget>
                </div>
            </div>
            <button className="rounded-md bg-blue-400 p-2 text-white">
                {type === 'create' ? 'Create' : 'Update'}
            </button>
        </form>
    )
}

export default TecherForm
