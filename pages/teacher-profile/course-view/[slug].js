import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import styles from '../../../styles/course-view-slug.module.css'
import ModelComponent from '../../../component/Model/Model'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { NEXT_BACKEND_URL } from '../../../config'


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

const singleCourseViewPage = () => {
  // state
  const [course, setCourse] = useState({})
  const [isModel, setIsModel] = useState(false)
  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [video, setVideo] = useState({})

  // router
  const router = useRouter()
  const { slug } = router.query
  useEffect(() => {
    loadCourse()
  }, [slug])
  const loadCourse = async () => {
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
        `${NEXT_BACKEND_URL}/course/${router.query && router.query.slug}`,
        config
      )
      setCourse(data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleVideo = async (e) => {
    try {
      const file = e.target.files[0]

      const videoData = new FormData()
      videoData.append('video', file)

      const token = window.localStorage.getItem('user')
        ? JSON.parse(window.localStorage.getItem('user'))
        : ''

      const config = {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      }
      setLoading(true)
      const { data } = await axios.post(
        `${NEXT_BACKEND_URL}/course/video-upload`,
        videoData,
        config
      )

      setVideo(data)
      setLoading(false)
      toast('Video Uploaded Success')
    } catch (error) {
      console.log(error)
      toast('Video Upload Fail')
    }
  }
  const handleAddLesson = async () => {
    try {
      const token = window.localStorage.getItem('user')
        ? JSON.parse(window.localStorage.getItem('user'))
        : ''

      const config = {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      }
      setLoading(true)
      console.log(course.instructor)
      const { data } = await axios.post(
        `${NEXT_BACKEND_URL}/course/lesson/${slug}/${course.instructor}`,
        {
          title,
          content,
          video,
        },
        config
      )
      setCourse(data)
      setIsModel(false)
      setLoading(false)
      setTitle('')
      setContent('')
      setVideo('')
      toast('Success')
    } catch (error) {
      setLoading(false)
      console.log(error)
      toast('Error')
    }
  }

  const handlePublish = async (courseId) => {
    try {
      const token = window.localStorage.getItem('user')
        ? JSON.parse(window.localStorage.getItem('user'))
        : ''

      const config = {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      }
      let answer = window.confirm('Can i publish this course')
      if (!answer) return

      const { data } = await axios.put(
        `${NEXT_BACKEND_URL}/course/publish/${courseId}`,
        {},
        config
      )
      setCourse(data)
      toast('Your Course is in live')
    } catch (error) {
      toast('Error,try again')
      console.log(error)
    }
  }
  const handleUnPublish = async (courseId) => {
    try {
      const token = window.localStorage.getItem('user')
        ? JSON.parse(window.localStorage.getItem('user'))
        : ''

      const config = {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      }
      let answer = window.confirm('Can i publish this course')
      if (!answer) return

      const { data } = await axios.put(
        `${NEXT_BACKEND_URL}/course/unpublish/${courseId}`,
        {},
        config
      )
      setCourse(data)
      toast('Your Course is not in live')
    } catch (error) {
      toast('Error,try again')
      console.log(error)
    }
  }
  return course ? (
    <motion.div
      exit={{ opacity: 1 }}
      initial='initial'
      animate='animate'
      className={isModel ? styles.isModelTrueStyleBg : styles.container}>
      <motion.article variants={fadeInUp} className={styles.container1}>
        <div className={styles.topContainer}>
          <div className={styles.imageContainer}>
            <img src={course.image && course.image.Location} alt='image' />
          </div>
          <div>
            <h1>{course.name}</h1>
            <p>{course.lesson && course.lesson.length} Lessons</p>
            <p>{course.category}</p>
          </div>
        </div>
        <div>
          <Link href={`/teacher-profile/course-edit/${slug}`}>
            <label title='Edit'>Edit</label>
          </Link>
          {course.lesson && course.lesson.length < 5 ? (
            <label>Add More than 5 lesson to publish</label>
          ) : course.published ? (
            <label onClick={() => handleUnPublish(course._id)}>
              UnPublish from World
            </label>
          ) : (
            <label onClick={() => handlePublish(course._id)}>
              Publish to World
            </label>
          )}
        </div>
      </motion.article>
      <hr />
      <motion.article variants={fadeInUp} className={styles.container2}>
        <p>Description : {course.description}</p>
        <button onClick={() => setIsModel(!isModel)}>Add Lesson</button>
      </motion.article>
      <motion.article variants={fadeInUp} className={styles.lessonDivContainer}>
        <h2>{course.lesson && course.lesson.length} Lessons</h2>

        <div>
          {course.lesson &&
            course.lesson.map((c, i) => {
              return (
                <>
                  <ul>
                    <li>
                      <span className={styles.lessonSpan1}>{i + 1}</span>
                      <span className={styles.lessonSpan2}>{c.title}</span>
                    </li>
                  </ul>
                </>
              )
            })}
        </div>
      </motion.article>

      {isModel && (
        <div className={styles.modelComponentStyle}>
          <ModelComponent
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
            video={video}
            setVideo={setVideo}
            isModel={isModel}
            handleVideo={handleVideo}
            setIsModel={setIsModel}
            loading={loading}
            handleAddLesson={handleAddLesson}
          />
        </div>
      )}
    </motion.div>
  ) : (
    ''
  )
}

export default singleCourseViewPage
