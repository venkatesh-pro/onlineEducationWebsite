import React, { useEffect, useState, useContext } from 'react'
import styles from '../../styles/singleCourse.module.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { PlayCircleOutline } from '@material-ui/icons'
import VideoPreviewModel from '../../component/Model/VideoPreviewModel'
import { Context } from '../../context/index'
import { loadStripe } from '@stripe/stripe-js'
import { motion } from 'framer-motion'
import { NEXT_BACKEND_URL } from '../../config'
import Layout from '../../component/Layout/Layout'

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

const stagger = {
  animate: {
    tramsition: {
      staggerChildren: 0.1,
    },
  },
}
const singleCourse = ({ course }) => {
  // const [course, setCourse] = useState('')
  const [model, setModel] = useState(false)
  const [enrolled, setEnrolled] = useState({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const {
    state: { user },
    dispatch,
  } = useContext(Context)

  // useEffect(() => {
  //   loadCourse()
  // }, [slug])

  useEffect(() => {
    if (course) {
      checkEnrollment()
    }
  }, [course])

  // enrollement
  const checkEnrollment = async () => {
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
        `${NEXT_BACKEND_URL}/check-enrollment/${course && course._id}`,
        config
      )
      console.log({ data })
      setEnrolled(data)
      console.log(enrolled)
    } catch (error) {
      console.log(error)
    }
  }

  const handleFreeEnrollment = async () => {
    try {
      const token = window.localStorage.getItem('user')
        ? JSON.parse(window.localStorage.getItem('user'))
        : ''

      const config = {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      }

      if (!user) {
        return router.push('/login')
      }
      if (enrolled.status) {
        return router.push(`/user-profile/course/${enrolled.course.slug}`)
      }
      const { data } = await axios.post(
        `${NEXT_BACKEND_URL}/free-enrollment/${course && course._id}`,
        {},
        config
      )
      setEnrolled(data)
      console.log({ enrolled })
      toast('Successfully Enrolled')
      router.push(`/user-profile/course/${enrolled.course.slug}`)
    } catch (error) {
      toast('Error')
      console.log('Enrollment Failed', error)
    }
  }

  const handlePaidEnrollment = async () => {
    if (!user) {
      return router.push('/login')
    }
    const token = window.localStorage.getItem('user')
      ? JSON.parse(window.localStorage.getItem('user'))
      : ''

    const config = {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    }
    if (enrolled.status) {
      return router.push(`/user-profile/course/${enrolled.course.slug}`)
    }
    setLoading(true)
    const { data } = await axios.post(
      `${NEXT_BACKEND_URL}/paid-enrollment/${course && course._id}`,
      {},
      config
    )

    const stripe = await loadStripe(
      'pk_test_51ImBnxSCantt08qFkZ74WM4p5caOmUp14aLcvKtnKolsPTanLTpeMx9NEQXqAcWe2f0qpeSoJ7w3ldJjYYbUPiXv00RkycQ0Y2'
    )

    stripe.redirectToCheckout({ sessionId: data })
    setLoading(false)
  }
  return (
    <Layout title={`${course && course.name}`}>
      <motion.div exit={{ opacity: 0 }} initial='initail' animate='animate'>
        {course && (
          <div className={styles.container}>
            <div className={styles.firstDivInContainer}>
              <div className={styles.topInfoContainer}>
                <div>
                  <motion.h1
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}>
                    {course.name}
                  </motion.h1>
                  <motion.p
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className={styles.descriptionP}>
                    {course.description}
                  </motion.p>
                  <motion.p
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}>
                    {course.category}
                  </motion.p>
                  <motion.p
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}>
                    created by {course.instructor && course.instructor.name}
                  </motion.p>
                  <motion.p
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}>
                    Last Updated{' '}
                    {new Date(course.createdAt).toLocaleDateString()}
                  </motion.p>
                  <motion.h2
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}>
                    {course.paid}
                  </motion.h2>
                </div>
                <motion.div
                  initial={{ x: 70, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={styles.thumbnailContainer}>
                  <div onClick={() => setModel(!model)}>
                    <img
                      src={course.image && course.image.Location}
                      alt='image'></img>
                    <span>
                      <PlayCircleOutline style={{ width: '100%' }} />
                    </span>
                  </div>
                  <div>
                    <button
                      className={styles.enrolleButton}
                      onClick={
                        course.paid === 'paid'
                          ? handlePaidEnrollment
                          : handleFreeEnrollment
                      }>
                      {!loading ? (
                        user ? (
                          enrolled && enrolled.status ? (
                            'Go to Coures'
                          ) : (
                            'Buy Now'
                          )
                        ) : (
                          'Login to Enroll'
                        )
                      ) : (
                        <span>
                          <div></div>
                        </span>
                      )}
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
            <div className={styles.lessonDivContainer}>
              <h2>{course.lesson && course.lesson.length} Lessons</h2>

              {course.lesson &&
                course.lesson.map((l, i) => {
                  return (
                    <>
                      <ul>
                        <li>
                          <span className={styles.lessonSpan1}>{i + 1}</span>
                          <span className={styles.lessonSpan2}>{l.title}</span>
                        </li>
                      </ul>
                    </>
                  )
                })}
            </div>
            {model && (
              <div className={styles.modelComponentStyle}>
                <VideoPreviewModel
                  course={course}
                  model={model}
                  setModel={setModel}
                />
              </div>
            )}
          </div>
        )}
      </motion.div>
    </Layout>
  )
}

export async function getServerSideProps({ query }) {
  const { data } = await axios.get(
    `${NEXT_BACKEND_URL}/courseNotLogin/${query.slug}`
  )

  return {
    props: {
      course: data,
    },
  }
}
export default singleCourse
