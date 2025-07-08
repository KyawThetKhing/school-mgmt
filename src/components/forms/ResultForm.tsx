'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import { toast } from 'react-toastify'

// local imports
import { createResult, updateResult } from '@/lib/actions'
import { resultSchema, ResultInputs } from '@/lib/formValidationSchema'

import InputField from '../InputField'

const ResultForm = ({
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
        control,
    } = useForm<ResultInputs>({
        resolver: zodResolver(resultSchema),
        defaultValues: data,
    })

    const [examOptions, setExamOptions] = useState([])
    const [assignmentOptions, setAssignmentOptions] = useState([])
    const [studentOptions, setStudentOptions] = useState([])
    const [state, formAction] = useFormState(
        type === 'create' ? createResult : updateResult,
        {
            success: false,
            error: false,
            message: '',
        }
    )

    const router = useRouter()

    const onSubmit = handleSubmit((data) => formAction(data))

    useEffect(() => {
        if (relatedData?.exams) {
            setExamOptions(
                relatedData.exams.map((exam: any) => ({
                    value: exam.id,
                    label: exam.title,
                }))
            )
        }
        if (relatedData?.assignments) {
            setAssignmentOptions(
                relatedData.assignments.map((assignment: any) => ({
                    value: assignment.id,
                    label: assignment.title,
                }))
            )
        }
        if (relatedData?.students) {
            setStudentOptions(
                relatedData.students.map((student: any) => ({
                    value: student.id,
                    label: `${student.name} ${student.surname}`,
                }))
            )
        }
    }, [relatedData])

    useEffect(() => {
        if (state.success) {
            toast.success(
                `Result ${type === 'create' ? 'created' : 'updated'} successfully`
            )
            setOpen(false)
            router.refresh()
        }
    }, [state, type, router, setOpen])

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === 'create' ? 'Create a new result' : 'Update result'}
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
                        register={register}
                        error={errors?.id}
                        hidden
                    />
                )}

                <InputField
                    label="Score"
                    name="score"
                    register={register}
                    error={errors?.score}
                />

                <div className="flex w-full flex-col gap-2">
                    <label className="text-xs text-gray-500">Exam</label>
                    <Controller
                        name="examId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={examOptions}
                                value={examOptions.find(
                                    (exam: any) => exam.value === field.value
                                )}
                                onChange={(e: any) => {
                                    const selectedExam = e.value
                                    field.onChange(selectedExam)
                                }}
                            />
                        )}
                    />
                    {errors.examId && (
                        <p className="text-xs text-red-400">
                            {errors.examId.message}
                        </p>
                    )}
                </div>

                <div className="flex w-full flex-col gap-2">
                    <label className="text-xs text-gray-500">Assignment</label>
                    <Controller
                        name="assignmentId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={assignmentOptions}
                                value={assignmentOptions.find(
                                    (assignment: any) =>
                                        assignment.value === field.value
                                )}
                                onChange={(e: any) => {
                                    const selectedAssignment = e.value
                                    field.onChange(selectedAssignment)
                                }}
                            />
                        )}
                    />
                    {errors.assignmentId && (
                        <p className="text-xs text-red-400">
                            {errors.assignmentId.message}
                        </p>
                    )}
                </div>

                <div className="flex w-full flex-col gap-2">
                    <label className="text-xs text-gray-500">Student</label>
                    <Controller
                        name="studentId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={studentOptions}
                                value={studentOptions.find(
                                    (student: any) =>
                                        student.value === field.value
                                )}
                                onChange={(e: any) => {
                                    const selectedStudent = e.value
                                    field.onChange(selectedStudent)
                                }}
                            />
                        )}
                    />
                    {errors.studentId && (
                        <p className="text-xs text-red-400">
                            {errors.studentId.message}
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

export default ResultForm
