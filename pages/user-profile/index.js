import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import Link from 'next/link'
import styles from '../../styles/user-profile.module.css'
import { PlayCircleFilled, Publish } from '@material-ui/icons'
import { Context } from '../../context/index'
import { toast } from 'react-toastify'
import Resizer from 'react-image-file-resizer'
import { NEXT_BACKEND_URL } from '../../config'

const userProfilePage = () => {
  const [courses, setCourses] = useState([])
  const [preview, setPreview] = useState('')
  const [uploadTitle, setUploadTitle] = useState('Change Image')
  const [image, setImage] = useState({})
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState()
  const {
    state: { user },
    dispatch,
  } = useContext(Context)
  useEffect(() => {
    loadCourse()
  }, [])
  useEffect(() => {
    setPreview(
      user && user.user && user.user.picture && user.user.picture.Location
    )
    setName(user && user.user && user.user.name)
  }, [user])
  const loadCourse = async () => {
    const token = window.localStorage.getItem('user')
      ? JSON.parse(window.localStorage.getItem('user'))
      : ''

    const config = {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    }
    const { data } = await axios.get(`${NEXT_BACKEND_URL}/user-courses`, config)

    setCourses(data)
  }

  const handleImage = (e) => {
    const files = e.target.files[0]
    setPreview(window.URL.createObjectURL(files))
    setUploadTitle(files.name.substring(0, 15))

    Resizer.imageFileResizer(files, 720, 500, 'JPEG', 100, 0, async (uri) => {
      try {
        setLoading(true)
        const { data } = await axios.post(
          `${NEXT_BACKEND_URL}/user/image-upload`,
          {
            image: uri,
          }
        )

        setImage(data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        toast.error('Please Check You Internet')
      }
    })
  }
  const handleSave = async (e) => {
    try {
      e.preventDefault()

      const token = window.localStorage.getItem('user')
        ? JSON.parse(window.localStorage.getItem('user'))
        : ''

      const config = {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      }
      const { data } = await axios.post(
        `${NEXT_BACKEND_URL}/user/updateUserProfile`,
        {
          picture: image,
          name,
        },
        config
      )
      dispatch({ type: 'LOGIN', payload: data })
      toast('Updated Sucess')
      setPreview(data.user && data.user.picture && data.user.picture.Location)
      window.localStorage.setItem('user', JSON.stringify(data))
    } catch (error) {}
  }
  return (
    <>
      <div className={styles.container}>
        <section className={styles.section1Container}>
          <h2>User Profile</h2>
          <form onSubmit={handleSave}>
            <div>
              <input
                type='text'
                placeholder='Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className={styles.imageUploadContainer}>
              <label className={styles.imageLabel}>
                Choose Image
                <input
                  type='file'
                  accept='image/*'
                  hidden
                  onChange={handleImage}
                />
              </label>
              <span className={styles.previewContainer}>
                {preview ? <img src={preview} alt='img' /> : ''}
              </span>
            </div>
            <button disabled={loading}>Save</button>
          </form>
        </section>
        <section className={styles.section2Container}>
          {courses &&
            courses.map((c) => {
              return (
                <>
                  <div className={styles.infoContainer}>
                    <div className={styles.imageContainer}>
                      <img src={c.image.Location} alt='image' />
                    </div>
                    <div className={styles.infoContainerInfo}>
                      <Link href={`/user-profile/course/${c.slug}`}>
                        <h1>{c.name}</h1>
                      </Link>
                      <p>{c.lesson && c.lesson.length} Lessons</p>
                      <p>By {c.instructor.name}</p>
                    </div>
                    <div className={styles.playIconDiv}>
                      <Link href={`/user-profile/course/${c.slug}`}>
                        <PlayCircleFilled />
                      </Link>
                    </div>
                  </div>
                </>
              )
            })}
        </section>
      </div>
    </>
  )
}

export default userProfilePage
