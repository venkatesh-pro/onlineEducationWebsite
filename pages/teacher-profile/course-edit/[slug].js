import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from '../../../styles/create-course.module.css'
import styles1 from '../../../styles/create-course-model.module.css'
import Resizer from 'react-image-file-resizer'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Delete } from '@material-ui/icons'
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

const singleCourseEditPage = () => {
  const [courseId, setCourseId] = useState('')
  const [instructorId, setInstructorId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(99)
  const [paid, setPaid] = useState('paid')
  const [image, setImage] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [published, setPublished] = useState(false)
  const [preview, setPreview] = useState('')
  const [lesson, setLesson] = useState([])
  const freeMean = paid == 'paid' ? price : 0
  // model state
  const [visibility, setVisibility] = useState(false)
  const [current, setCurrent] = useState({})
  const router = useRouter()
  const { slug } = router.query
  // toggle
  const [toggle, setToggle] = useState(false)

  useEffect(() => {
    loadCourseForEdit()
  }, [router.query])
  const loadCourseForEdit = async () => {
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
      console.log({ data })
      setCourseId(data._id)
      setInstructorId(data.instructor)
      setName(data.name)
      setDescription(data.description)
      setPrice(data.price)
      setPaid(data.paid)
      setCategory(data.category)
      setImage(data.image)
      setPreview(data.image && data.image.Location)
      setLesson(data.lesson)

      console.log({ data })
    } catch (error) {
      console.log(error)
    }
  }

  const handleImage = (e) => {
    const files = e.target.files[0]

    setPreview(window.URL.createObjectURL(files))

    // resize image
    Resizer.imageFileResizer(
      e.target.files[0],
      720,
      500,
      'JPEG',
      100,
      0,
      async (uri) => {
        try {
          setLoading(true)

          let { data } = await axios.post(
            `${NEXT_BACKEND_URL}/user/image-upload`,
            {
              image: uri,
            }
          )
          setImage(data)
          setLoading(false)
        } catch (error) {
          console.log(error)
          setLoading(false)
          toast('Image Upload Failed,Try Again')
        }
      }
    )
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      const token = window.localStorage.getItem('user')
        ? JSON.parse(window.localStorage.getItem('user'))
        : ''
      const config = {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      }

      const { data } = await axios.put(
        `${NEXT_BACKEND_URL}/course/${router.query && router.query.slug}`,
        {
          name,
          description,
          price,
          paid,
          price: freeMean,
          image,
          category,
        },
        config
      )
      toast('Successfully Updated ')
    } catch (error) {
      console.log(error)
      toast('Failed,Try Again')
    }
  }
  const priceListLoop = []
  for (let i = 99; i <= 1500; i = i + 100) {
    priceListLoop.push(i)
  }

  const handleDrag = (e, index) => {
    e.dataTransfer.setData('itemIndex', index)
  }
  const handleDrop = async (e, index) => {
    const movingItemIndex = e.dataTransfer.getData('itemIndex')
    const targetItemIndex = index
    let allLessons = lesson

    let movingItem = allLessons[movingItemIndex]
    allLessons.splice(movingItemIndex, 1)
    allLessons.splice(targetItemIndex, 0, movingItem)
    setLesson([...allLessons])

    const token = window.localStorage.getItem('user')
      ? JSON.parse(window.localStorage.getItem('user'))
      : ''
    const config = {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    }

    const { data } = await axios.put(
      `${NEXT_BACKEND_URL}/course/${router.query && router.query.slug}`,
      {
        name,
        description,
        price,
        paid,
        price: freeMean,
        image,
        category,
        lesson,
      },
      config
    )
    toast('Lesson rearranged')
  }

  const handleDelete = async (i) => {
    const token = window.localStorage.getItem('user')
      ? JSON.parse(window.localStorage.getItem('user'))
      : ''
    const config = {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    }
    const answer = window.confirm('Are u sure to delete')
    if (!answer) return

    let allLessons = lesson

    const removed = allLessons.splice(i, 1)
    setLesson([...allLessons])

    const { data } = await axios.put(
      `${NEXT_BACKEND_URL}/course/edit/${slug}/${removed[0]._id}`,
      {},
      config
    )
    console.log({ data })
  }

  const handleVideo = async (e) => {
    try {
      const file = e.target.files[0]

      const videoData = new FormData()
      videoData.append('video', file)
      videoData.append('courseId', courseId)

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
      console.log({ data })
      setCurrent({ ...current, video: data })
      console.log({ current })
      setLoading(false)
      toast('Video Uploaded Success')
    } catch (error) {
      setLoading(false)
      console.log(error)
      toast('Video Upload Fail')
    }
  }

  const handleEditLesson = async () => {
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

      const { data } = await axios.put(
        `${NEXT_BACKEND_URL}/course/lesson/${slug}/${current._id}`,
        current,
        config
      )
      if (data.ok) {
        let arr = lesson
        const index = arr.findIndex((el) => el._id === current._id)

        arr[index] = current

        setLesson([...lesson, arr])
      }
      toast('Lesson updated')
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
      toast('Error')
    }
  }

  return (
    <motion.div
      exit={{ opacity: 1 }}
      initial='initial'
      animate='animate'
      className={styles.container}>
      <motion.div variants={fadeInUp}>
        <h1 className={styles.quotes}>Update Course</h1>
      </motion.div>
      <motion.div variants={fadeInUp}>
        <form className={styles.form}>
          <div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type='text'
              placeholder='Name Of The Course'
            />
          </div>
          <div>
            <textarea
              placeholder='Write What Is Course About'
              value={description}
              onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>

          <div style={{ width: '100%' }}>
            <div className={styles.paidStyle}>
              <select value={paid} onChange={(e) => setPaid(e.target.value)}>
                <option value='paid'>Paid</option>
                <option value='free'>Free</option>
              </select>
              {paid === 'paid' ? (
                <span>
                  <select
                    onChange={(e) => {
                      console.log(price)
                      setPrice(Number(e.target.value.split('₹')[1]))
                      console.log(price)
                    }}>
                    {priceListLoop.map((p) => {
                      return <option key={p}>₹{p}</option>
                    })}
                  </select>
                </span>
              ) : (
                ''
              )}
            </div>
          </div>

          <div>
            <input
              type='text'
              placeholder='Category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className={styles.imageUploadLabelDiv} style={{ width: '100%' }}>
            <label className={styles.imageUploadLabel}>
              Upload Image
              <input
                onChange={handleImage}
                type='file'
                accept='image/*'
                hidden
              />
            </label>
            {preview && (
              <span>
                <img
                  style={{ borderRadius: '50%' }}
                  src={preview}
                  alt='image'
                />
              </span>
            )}
          </div>
          <div style={{ width: '100%' }}>
            <button
              disabled={loading}
              onClick={submitHandler}
              className={styles.submitButton}>
              Save & Continue
            </button>
          </div>
        </form>
      </motion.div>
      <motion.div variants={fadeInUp} className={styles.lessonDivContainer}>
        {lesson &&
          lesson.map((c, i) => {
            return (
              <>
                <ul onDragOver={(e) => e.preventDefault()}>
                  <li
                    onClick={() => {
                      setCurrent(c)
                    }}
                    draggable
                    onDragStart={(e) => handleDrag(e, i)}
                    onDrop={(e) => handleDrop(e, i)}>
                    <div
                      className={styles.liSpanContainer}
                      onClick={() => {
                        setVisibility(true)
                      }}>
                      <span className={styles.lessonSpan1}>{i + 1}</span>
                      <span className={styles.lessonSpan2}>{c.title}</span>
                    </div>
                    <div className={styles.liSpanDeleteContainer}>
                      <Delete
                        onClick={() => {
                          handleDelete(i)
                        }}
                      />
                    </div>
                  </li>
                </ul>
              </>
            )
          })}
      </motion.div>
      {/* model */}
      {visibility && (
        <div className={styles1.modelComponentStyle}>
          <div className={styles1.container}>
            <div className={styles1.container1}>
              <p>+ Edit Lesson</p>
              <p
                className={styles1.cancelP}
                onClick={() => setVisibility(!visibility)}>
                X
              </p>
            </div>
            <div className={styles1.container2}>
              <form>
                <div>
                  <input
                    type='text'
                    placeholder='Title'
                    value={current.title}
                    onChange={(e) =>
                      setCurrent({ ...current, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <textarea
                    placeholder='Content'
                    value={current.content}
                    onChange={(e) =>
                      setCurrent({ ...current, content: e.target.value })
                    }></textarea>
                </div>
                {current.video && current.video.Location && (
                  <div className={styles1.videoContainer}>
                    <video controls src={current.video.Location}></video>
                  </div>
                )}

                <div className={styles1.labelContainer}>
                  <label>
                    Upload Video
                    <input
                      onChange={handleVideo}
                      type='file'
                      hidden
                      accept='video/*'
                    />
                  </label>
                </div>
                <div className={styles1.theme_switch_wrapper}>
                  <span>Free Preview</span>
                  <label htmlFor='' className={styles1.theme_switch}>
                    {/* Buggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg */}
                    <input
                      defaultChecked={current.free_preview}
                      onChange={(e) => {
                        setToggle(!current.free_preview)
                        setCurrent({ ...current, free_preview: toggle })
                      }}
                      type='checkbox'
                    />
                    {console.log(toggle)}
                    <div className={styles1.slider}></div>
                  </label>
                </div>

                <div className={styles1.buttonDiv}>
                  <button
                    disabled={loading}
                    onClick={(e) => {
                      e.preventDefault()
                      handleEditLesson()
                    }}>
                    save
                  </button>
                </div>
              </form>
            </div>
          </div>
          <pre>{JSON.stringify(current, null, 4)}</pre>
        </div>
      )}
    </motion.div>
  )
}

export default singleCourseEditPage
