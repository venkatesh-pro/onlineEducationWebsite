import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import {
  Remove,
  Done,
  RemoveCircleOutline,
  CheckCircle,
  Toc,
  PlayCircleOutline,
} from '@material-ui/icons'
import styles from '../../../styles/user-profile-course.module.css'
import { NEXT_BACKEND_URL } from '../../../config'

const singleCoursePage = () => {
  const [course, setCourse] = useState([])
  const [clicked, setClicked] = useState(-1)
  const [completedLessons, setCompletedLessons] = useState([])
  const [collapsed, setCollapsed] = useState(false)
  const [isBool, setIsBool] = useState(false)

  const router = useRouter()

  const { slug } = router.query

  useEffect(() => {
    if (slug) loadCourse()
  }, [slug])

  useEffect(() => {
    if (course) loadCompletedLessons()
  }, [course])

  const loadCourse = async () => {
    const token = window.localStorage.getItem('user')
      ? JSON.parse(window.localStorage.getItem('user'))
      : ''

    const config = {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    }
    const { data } = await axios.get(
      `${NEXT_BACKEND_URL}/user/course/${slug}`,
      config
    )

    setCourse(data)
  }
  const loadCompletedLessons = async () => {
    const token = window.localStorage.getItem('user')
      ? JSON.parse(window.localStorage.getItem('user'))
      : ''

    const config = {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    }
    const { data } = await axios.post(
      `${NEXT_BACKEND_URL}/list-completed`,
      {
        courseId: course._id,
      },
      config
    )
    setCompletedLessons(data)
  }
  const handleMarkCompleted = async () => {
    const token = window.localStorage.getItem('user')
      ? JSON.parse(window.localStorage.getItem('user'))
      : ''

    const config = {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    }
    const { data } = await axios.post(
      `${NEXT_BACKEND_URL}/mark-completed`,
      {
        courseId: course._id,
        lessonId: course.lesson[clicked]._id,
      },
      config
    )
    toast('Success')

    setCompletedLessons([...completedLessons, course.lesson[clicked]._id])
  }
  const handleMarkInCompleted = async () => {
    const token = window.localStorage.getItem('user')
      ? JSON.parse(window.localStorage.getItem('user'))
      : ''

    const config = {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    }
    const { data } = await axios.post(
      `${NEXT_BACKEND_URL}/mark-incompleted`,
      {
        courseId: course._id,
        lessonId: course.lesson[clicked]._id,
      },
      config
    )
    toast('Success')
    const all = completedLessons
    console.log({ all })
    const index = all.indexOf(course.lesson[clicked]._id)

    if (index > -1) {
      all.splice(index, 1)
      console.log({ all })
      setCompletedLessons(all)
      setIsBool(!isBool)
    }
    console.log(index)
  }
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <h3 onClick={() => setCollapsed(!collapsed)}>
          <Toc /> {!collapsed && `Lessons`}
        </h3>
        <ul>
          {course &&
            course.lesson &&
            course.lesson.map((l, i) => {
              return (
                <li onClick={() => setClicked(i)}>
                  <span className={styles.innerContainerSpan1}>{i + 1}</span>
                  {!collapsed && (
                    <>
                      <span className={styles.innerContainerSpan2}>
                        {l.title}
                      </span>
                      <span className={styles.innerContainerSpan3}>
                        {completedLessons.includes(l._id) ? (
                          <CheckCircle style={{ color: 'skyblue' }} />
                        ) : (
                          <RemoveCircleOutline style={{ color: 'red' }} />
                        )}
                      </span>
                    </>
                  )}
                </li>
              )
            })}
        </ul>
      </div>
      <div>
        <div className={styles.innerContainer2}>
          {clicked != -1 ? (
            <>
              <div className={styles.innerContainer2TitleContainer}>
                <b>{course.lesson[clicked] && course.lesson[clicked].title}</b>
                <div>
                  {completedLessons.includes(
                    course.lesson[clicked] && course.lesson[clicked]._id
                  ) ? (
                    <button onClick={handleMarkInCompleted}>
                      Mark As InComplete
                    </button>
                  ) : (
                    <button onClick={handleMarkCompleted}>
                      Mark As Complete
                    </button>
                  )}
                </div>
              </div>
              {course.lesson[clicked] && (
                <div className={styles.innerContainer2VideoContainer}>
                  <video
                    onEnded={() => handleMarkCompleted()}
                    controls
                    src={
                      course.lesson[clicked].video &&
                      course.lesson[clicked].video.Location
                    }></video>
                </div>
              )}
            </>
          ) : (
            <div className={styles.clickTheLessonTextContainer}>
              <p>
                <PlayCircleOutline /> Click any lesson to see
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default singleCoursePage
