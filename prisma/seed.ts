import { Day, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Starting seed...')

    // Clear existing data (in reverse order of dependencies)
    await prisma.result.deleteMany()
    await prisma.attendance.deleteMany()
    await prisma.assignment.deleteMany()
    await prisma.exam.deleteMany()
    await prisma.lesson.deleteMany()
    await prisma.announcement.deleteMany()
    await prisma.event.deleteMany()
    await prisma.student.deleteMany()
    await prisma.class.deleteMany()
    await prisma.teacher.deleteMany()
    await prisma.parent.deleteMany()
    await prisma.subject.deleteMany()
    await prisma.grade.deleteMany()
    await prisma.admin.deleteMany()

    // 1. Create Admins
    console.log('Creating admins...')
    const admins = await Promise.all(
        Array.from({ length: 15 }, (_, i) =>
            prisma.admin.create({
                data: {
                    id: `admin_${i + 1}`,
                    username: `admin${i + 1}`,
                },
            })
        )
    )

    // 2. Create Grades
    console.log('Creating grades...')
    const grades = await Promise.all(
        Array.from({ length: 15 }, (_, i) =>
            prisma.grade.create({
                data: {
                    level: i + 1,
                },
            })
        )
    )

    // 3. Create Subjects
    console.log('Creating subjects...')
    const subjects = [
        'Mathematics',
        'English',
        'Science',
        'History',
        'Geography',
        'Physics',
        'Chemistry',
        'Biology',
        'Computer Science',
        'Art',
        'Music',
        'Physical Education',
        'Literature',
        'Economics',
        'Psychology',
    ]
    const subjectRecords = await Promise.all(
        subjects.map((name, i) =>
            prisma.subject.create({
                data: {
                    name,
                },
            })
        )
    )

    // 4. Create Teachers
    console.log('Creating teachers...')
    const teachers = await Promise.all(
        Array.from({ length: 15 }, (_, i) =>
            prisma.teacher.create({
                data: {
                    id: `teacher_${i + 1}`,
                    username: `teacher${i + 1}`,
                    name: `Teacher${i + 1}`,
                    surname: `Surname${i + 1}`,
                    email: `teacher${i + 1}@school.com`,
                    phone: `555-${1000 + i}`,
                    address: `${i + 1} Teacher Street, City`,
                    bloodType: [
                        'A+',
                        'A-',
                        'B+',
                        'B-',
                        'AB+',
                        'AB-',
                        'O+',
                        'O-',
                    ][i % 8],
                    sex: i % 2 === 0 ? 'MALE' : 'FEMALE',
                },
            })
        )
    )

    // Connect teachers to subjects
    console.log('Connecting teachers to subjects...')
    await Promise.all(
        teachers.map((teacher, i) =>
            prisma.teacher.update({
                where: { id: teacher.id },
                data: {
                    subjects: {
                        connect: [
                            {
                                id: subjectRecords[i % subjectRecords.length]
                                    .id,
                            },
                        ],
                    },
                },
            })
        )
    )

    // 5. Create Classes
    console.log('Creating classes...')
    const classes = await Promise.all(
        Array.from({ length: 15 }, (_, i) =>
            prisma.class.create({
                data: {
                    name: `Class-${i + 1}`,
                    capacity: 25 + (i % 10),
                    supervisorId: teachers[i % teachers.length].id,
                    gradeId: grades[i % grades.length].id,
                },
            })
        )
    )

    // 6. Create Parents
    console.log('Creating parents...')
    const parents = await Promise.all(
        Array.from({ length: 15 }, (_, i) =>
            prisma.parent.create({
                data: {
                    id: `parent_${i + 1}`,
                    username: `parent${i + 1}`,
                    name: `Parent${i + 1}`,
                    surname: `ParentSurname${i + 1}`,
                    email: `parent${i + 1}@email.com`,
                    phone: `555-${2000 + i}`,
                    address: `${i + 1} Parent Avenue, City`,
                },
            })
        )
    )

    // 7. Create Students
    console.log('Creating students...')
    const students = await Promise.all(
        Array.from({ length: 15 }, (_, i) =>
            prisma.student.create({
                data: {
                    id: `student_${i + 1}`,
                    username: `student${i + 1}`,
                    name: `Student${i + 1}`,
                    surname: `StudentSurname${i + 1}`,
                    email: `student${i + 1}@school.com`,
                    phone: `555-${3000 + i}`,
                    address: `${i + 1} Student Road, City`,
                    bloodType: [
                        'A+',
                        'A-',
                        'B+',
                        'B-',
                        'AB+',
                        'AB-',
                        'O+',
                        'O-',
                    ][i % 8],
                    sex: i % 2 === 0 ? 'MALE' : 'FEMALE',
                    birthday: new Date(2005 + (i % 10), i % 12, (i % 28) + 1),
                    parentId: parents[i % parents.length].id,
                    classId: classes[i % classes.length].id,
                    gradeId: grades[i % grades.length].id,
                },
            })
        )
    )

    // 8. Create Lessons
    console.log('Creating lessons...')
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']
    const lessons = await Promise.all(
        Array.from({ length: 15 }, (_, i) =>
            prisma.lesson.create({
                data: {
                    name: `${subjectRecords[i % subjectRecords.length].name} Lesson ${i + 1}`,
                    day: Day[
                        Object.keys(Day)[
                            Math.floor(Math.random() * Object.keys(Day).length)
                        ] as keyof typeof Day
                    ],
                    startTime: new Date(2024, 0, 1, 8 + (i % 8), 0, 0),
                    endTime: new Date(2024, 0, 1, 9 + (i % 8), 0, 0),
                    subjectId: subjectRecords[i % subjectRecords.length].id,
                    classId: classes[i % classes.length].id,
                    teacherId: teachers[i % teachers.length].id,
                },
            })
        )
    )

    // 9. Create Exams
    console.log('Creating exams...')
    const exams = await Promise.all(
        Array.from({ length: 15 }, (_, i) =>
            prisma.exam.create({
                data: {
                    title: `Exam ${i + 1}`,
                    startTime: new Date(
                        2024,
                        2 + (i % 6),
                        1 + (i % 28),
                        9,
                        0,
                        0
                    ),
                    endTime: new Date(
                        2024,
                        2 + (i % 6),
                        1 + (i % 28),
                        11,
                        0,
                        0
                    ),
                    lessonId: lessons[i % lessons.length].id,
                },
            })
        )
    )

    // 10. Create Assignments
    console.log('Creating assignments...')
    const assignments = await Promise.all(
        Array.from({ length: 15 }, (_, i) =>
            prisma.assignment.create({
                data: {
                    title: `Assignment ${i + 1}`,
                    startDate: new Date(2024, 1 + (i % 6), 1 + (i % 28)),
                    dueDate: new Date(2024, 1 + (i % 6), 8 + (i % 28)),
                    lessonId: lessons[i % lessons.length].id,
                },
            })
        )
    )

    // 11. Create Results
    console.log('Creating results...')
    const results = await Promise.all(
        Array.from({ length: 15 }, (_, i) =>
            prisma.result.create({
                data: {
                    score: 60 + (i % 40), // Scores between 60-99
                    examId: i < 8 ? exams[i % exams.length].id : null,
                    assignmentId:
                        i >= 8 ? assignments[i % assignments.length].id : null,
                    studentId: students[i % students.length].id,
                },
            })
        )
    )

    // 12. Create Attendances
    console.log('Creating attendances...')
    const attendances = await Promise.all(
        Array.from({ length: 15 }, (_, i) =>
            prisma.attendance.create({
                data: {
                    date: new Date(2024, 1 + (i % 6), 1 + (i % 28)),
                    present: i % 4 !== 0, // 75% attendance rate
                    studentId: students[i % students.length].id,
                    lessonId: lessons[i % lessons.length].id,
                },
            })
        )
    )

    // 13. Create Events
    console.log('Creating events...')
    const events = await Promise.all(
        Array.from({ length: 15 }, (_, i) =>
            prisma.event.create({
                data: {
                    title: `Event ${i + 1}`,
                    description: `This is the description for event ${i + 1}`,
                    startTime: new Date(
                        2024,
                        3 + (i % 6),
                        1 + (i % 28),
                        10,
                        0,
                        0
                    ),
                    endTime: new Date(
                        2024,
                        3 + (i % 6),
                        1 + (i % 28),
                        12,
                        0,
                        0
                    ),
                    classId: i < 10 ? classes[i % classes.length].id : null,
                },
            })
        )
    )

    // 14. Create Announcements
    console.log('Creating announcements...')
    const announcements = await Promise.all(
        Array.from({ length: 15 }, (_, i) =>
            prisma.announcement.create({
                data: {
                    title: `Announcement ${i + 1}`,
                    description: `This is the description for announcement ${i + 1}`,
                    date: new Date(2024, 1 + (i % 6), 1 + (i % 28)),
                    classId: i < 12 ? classes[i % classes.length].id : null,
                },
            })
        )
    )

    console.log('Seed completed successfully!')
    console.log(`Created:
  - ${admins.length} admins
  - ${grades.length} grades
  - ${subjectRecords.length} subjects
  - ${teachers.length} teachers
  - ${classes.length} classes
  - ${parents.length} parents
  - ${students.length} students
  - ${lessons.length} lessons
  - ${exams.length} exams
  - ${assignments.length} assignments
  - ${results.length} results
  - ${attendances.length} attendances
  - ${events.length} events
  - ${announcements.length} announcements`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
