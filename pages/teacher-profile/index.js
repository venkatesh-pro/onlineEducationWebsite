import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import styles from '../../styles/teacher-profile.module.css'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { NEXT_BACKEND_URL } from '../../config'

const easing = [0.6, -0.05, 0.01, 0.99]
const fadeInUp = {
  initial: {
    y: 10,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easing,
    },
  },
}

const teacherProfilePage = () => {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    getTeacherCourses()
  }, [])

  const getTeacherCourses = async () => {
    try {
      const token = window.localStorage.getItem('user')
        ? JSON.parse(window.localStorage.getItem('user'))
        : ''

      const config = {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      }
      const { data } = await axios.get(
        `${NEXT_BACKEND_URL}/current-teacher-course`,
        config
      )

      setCourses(data)
    } catch (error) {
      toast('error')
    }
  }
  return (
    <motion.div
      exit={{ opacity: 1 }}
      initial='initial'
      animate='animate'
      className={styles.container}>
      <motion.div variants={fadeInUp}>
        <h1 className={styles.teacherProfileText}>Teacher Profile</h1>
      </motion.div>
      <div>
        {courses.length > 0 ? (
          courses.map((course) => {
            return (
              <motion.div
                variants={fadeInUp}
                className={styles.courseMainContainer}>
                <motion.div
                  variants={fadeInUp}
                  className={styles.courseContainer}>
                  <div className={styles.imageContainer}>
                    <img src={course.image.Location} alt='image' />
                  </div>
                  <div className={styles.courseInfoContainer}>
                    <div>
                      <h1>
                        <Link
                          href={`/teacher-profile/course-view/${course.slug}`}>
                          {course.name}
                        </Link>
                      </h1>
                    </div>
                    <div>
                      <p>{course.lesson.length} Lessons</p>
                    </div>
                    <div>
                      <p>
                        {course.lesson && course.lesson.length > 5
                          ? 'Your course is ready to be published, please publish'
                          : 'At least 5 lessons are required to publish a course'}
                      </p>
                    </div>
                  </div>
                </motion.div>
                <div className={styles.labelContainer}>
                  <label title={course.published ? 'Live' : 'Not in Live'}>
                    {course.published ? 'Live' : 'Not in Live'}
                  </label>
                </div>
              </motion.div>
            )
          })
        ) : (
          <div className={styles.empltyH1Container}>
            <h1>
              Please Create A <span> Course </span>
              And
              <span> Earn</span>
            </h1>
            <h3>
              <Link href='/create-course'>Create Course</Link>
            </h3>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default teacherProfilePage
