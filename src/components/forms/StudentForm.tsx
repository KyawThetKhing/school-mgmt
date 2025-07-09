'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { CldUploadWidget } from 'next-cloudinary'
import { useState } from 'react'
import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { createStudent, updateStudent } from '@/lib/actions'
import { StudentInputs, studentSchema } from '@/lib/formValidationSchema'

import InputField from '../InputField'

const StudentForm = ({
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
    } = useForm<StudentInputs>({
        resolver: zodResolver(studentSchema),
    })
    const router = useRouter()
    const [img, setImg] = useState<any>(null)
    const [state, formAction] = useFormState(
        type === 'create' ? createStudent : updateStudent,
        {
            success: false,
            error: false,
            message: '',
        }
    )
    const onSubmit = handleSubmit((data) => {
        const payload = {
            ...data,
            img: img?.info?.secure_url || data.img,
        }
        formAction(payload)
    })

    useEffect(() => {
        if (state.success) {
            toast(
                `${type === 'create' ? 'Created' : 'Updated'} student successfully!`
            )
            setOpen(false)
            router.refresh()
        }
    }, [state, router, setOpen, type])

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === 'create' ? 'Create a new student' : 'Update student'}
            </h1>
            {state.error && (
                <p className="text-red-500">
                    {state.message || 'Something went wrong'}
                </p>
            )}
            <span className="text-xs font-medium text-gray-400">
                Authentication Information
            </span>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {data?.id && (
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
                    label="Email"
                    name="email"
                    defaultValue={data?.email}
                    register={register}
                    error={errors?.email}
                />
                <InputField
                    label="Password"
                    name="password"
                    type="password"
                    defaultValue={data?.password}
                    register={register}
                    error={errors?.password}
                />
            </div>
            <span className="text-xs font-medium text-gray-400">
                Personal Information
            </span>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                <InputField
                    label="Name"
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors.name}
                />
                <InputField
                    label="Surname"
                    name="surname"
                    defaultValue={data?.surname}
                    register={register}
                    error={errors.surname}
                />
                <InputField
                    label="Phone"
                    name="phone"
                    defaultValue={data?.phone}
                    register={register}
                    error={errors.phone}
                />
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
                <InputField
                    label="Birthday"
                    name="birthday"
                    defaultValue={data?.birthday.toISOString().split('T')[0]}
                    register={register}
                    error={errors.birthday}
                    type="date"
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
                <div className="flex w-full flex-col gap-2">
                    <label className="text-xs text-gray-500">Parent</label>
                    <select
                        className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
                        {...register('parentId')}
                        defaultValue={data?.parentId}
                    >
                        {relatedData?.parents?.map(
                            (parent: {
                                id: string
                                name: string
                                surname: string
                            }) => (
                                <option key={parent.id} value={parent.id}>
                                    {parent.name} {parent.surname}
                                </option>
                            )
                        )}
                    </select>
                    {errors.parentId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.parentId.message.toString()}
                        </p>
                    )}
                </div>
                <div className="flex w-full flex-col gap-2">
                    <label className="text-xs text-gray-500">Class</label>
                    <select
                        className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
                        {...register('classId')}
                        defaultValue={data?.classId}
                    >
                        {relatedData?.classes?.map((classItem: any) => (
                            <option key={classItem.id} value={classItem.id}>
                                ({classItem.name} -{' '}
                                {classItem._count.students +
                                    '/' +
                                    classItem.capacity}{' '}
                                Capacity)
                            </option>
                        ))}
                    </select>
                    {errors.classId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.classId.message.toString()}
                        </p>
                    )}
                </div>
                <div className="flex w-full flex-col gap-2">
                    <label className="text-xs text-gray-500">Grade</label>
                    <select
                        className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
                        {...register('gradeId')}
                        defaultValue={data?.gradeId}
                    >
                        {relatedData?.grades?.map(
                            (grade: { id: string; level: string }) => (
                                <option key={grade.id} value={grade.id}>
                                    {grade.level}
                                </option>
                            )
                        )}
                    </select>
                    {errors.gradeId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.gradeId.message.toString()}
                        </p>
                    )}
                </div>
                <div className="flex w-full flex-col items-center gap-2">
                    <label className="opacity-0">Upload Image</label>
                    <CldUploadWidget
                        uploadPreset="school"
                        onSuccess={(result) => {
                            setImg(result)
                        }}
                    >
                        {({ open }) => {
                            return (
                                <label
                                    className="flex cursor-pointer items-center gap-2 text-xs text-gray-500"
                                    onClick={() => open()}
                                >
                                    <Image
                                        src="/upload.png"
                                        alt=""
                                        width={28}
                                        height={28}
                                    />
                                    <span>Upload a photo</span>
                                </label>
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

export default StudentForm
