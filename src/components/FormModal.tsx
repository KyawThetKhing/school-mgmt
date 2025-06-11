'use client'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import {
    deleteClass,
    deleteStudent,
    deleteSubject,
    deleteTeacher,
} from '@/lib/actions'
import { FormContainerProps } from './FormContainer'

const TeacherForm = dynamic(() => import('./forms/TeacherForm'), {
    loading: () => <div>Loading...</div>,
})
const StudentForm = dynamic(() => import('./forms/StudentForm'), {
    loading: () => <div>Loading...</div>,
})
const SubjectForm = dynamic(() => import('./forms/SubjectForm'), {
    loading: () => <div>Loading...</div>,
})

const ClassForm = dynamic(() => import('./forms/ClassForm'), {
    loading: () => <div>Loading...</div>,
})

const forms: {
    [key: string]: (
        setOpen: React.Dispatch<React.SetStateAction<boolean>>,
        type: 'create' | 'update',
        data?: any,
        relatedData?: any
    ) => JSX.Element
} = {
    subject: (setOpen, type, data, relatedData) => (
        <SubjectForm
            setOpen={setOpen}
            type={type}
            data={data}
            relatedData={relatedData}
        />
    ),
    teacher: (setOpen, type, data, relatedData) => (
        <TeacherForm
            setOpen={setOpen}
            type={type}
            data={data}
            relatedData={relatedData}
        />
    ),
    student: (setOpen, type, data, relatedData) => (
        <StudentForm
            setOpen={setOpen}
            type={type}
            data={data}
            relatedData={relatedData}
        />
    ),
    class: (setOpen, type, data, realatedData) => (
        <ClassForm
            setOpen={setOpen}
            type={type}
            data={data}
            relatedData={realatedData}
        />
    ),
}

const deleteActionMap = {
    subject: deleteSubject,
    teacher: deleteTeacher,
    student: deleteStudent,
    parent: deleteSubject,
    class: deleteClass,
    lesson: deleteSubject,
    exam: deleteSubject,
    assignment: deleteSubject,
    result: deleteSubject,
    attendance: deleteSubject,
    event: deleteSubject,
    announcement: deleteSubject,

    // teacher: deleteTeacher,
    // student: deleteStudent,
    // parent: deleteParent,
    // class: deleteClass,
    // lesson: deleteLesson,
    // exam: deleteExam,
    // assignment: deleteAssignment,
    // result: deleteResult,
    // attendance: deleteAttendance,
    // event: deleteEvent,
    // announcement: deleteAnnouncement,
}

const FormModal = ({
    table,
    type,
    data,
    id,
    relatedData,
}: FormContainerProps & { relatedData?: any }) => {
    const size = type === 'create' ? 'w-8 h-8' : 'w-7 h-7'
    const bgColor =
        type === 'create'
            ? 'bg-yellow'
            : type === 'update'
              ? 'bg-sky'
              : 'bg-purple'
    const [open, setOpen] = useState(false)

    const Form = () => {
        const [state, formAction] = useFormState(deleteActionMap[table], {
            success: false,
            error: false,
        })

        const router = useRouter()

        useEffect(() => {
            if (state.success) {
                toast(
                    `${table.charAt(0).toUpperCase() + table.slice(1)} has been deleted!`
                )
                setOpen(false)
                router.refresh()
            }
        }, [state, router])

        return type === 'delete' && id ? (
            <form action={formAction} className="flex flex-col gap-4 p-4">
                <input type="text | number" name="id" value={id} hidden />
                <span className="text-center font-medium">
                    All data will be lost. Are you sure you want to delete this
                    {table}?
                </span>
                <button className="w-max self-center rounded-md border-none bg-red-700 px-4 py-2 text-white">
                    Delete
                </button>
            </form>
        ) : type === 'create' || type === 'update' ? (
            forms[table](setOpen, type, data, relatedData)
        ) : null
    }
    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
            >
                <Image src={`/${type}.png`} alt="" width={16} height={16} />
            </button>
            {open && (
                <div className="absolute bottom-0 left-0 right-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50">
                    <div className="relative w-[90%] rounded-md bg-white p-4 md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
                        <div
                            className="absolute right-4 top-4 cursor-pointer"
                            onClick={() => setOpen(false)}
                        >
                            <Image
                                src="/close.png"
                                alt=""
                                width={20}
                                height={20}
                            />
                        </div>
                        <Form />
                    </div>
                </div>
            )}
        </>
    )
}

export default FormModal
