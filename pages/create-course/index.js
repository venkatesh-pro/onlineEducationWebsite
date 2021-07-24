import React, { useState } from 'react'
import styles from '../../styles/create-course.module.css'
import Resizer from 'react-image-file-resizer'
import axios from 'axios'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
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

const createCoursePage = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(99)
  const [paid, setPaid] = useState('paid')
  const [image, setImage] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [published, setPublished] = useState(false)
  const [preview, setPreview] = useState('')
  const freeMean = paid == 'paid' ? price : 0

  const router = useRouter()
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

      const { data } = await axios.post(
        `${NEXT_BACKEND_URL}/course`,
        {
          name,
          description,
          price,
          paid,
          price: freeMean,
          image,
          category,
          published,
        },
        config
      )
      toast('Succes Course Created ')
      router.push('/teacher-profile')
    } catch (error) {
      console.log(error)
      toast('Failed,Try Again')
    }
  }
  const priceListLoop = []
  for (let i = 99; i <= 1500; i = i + 100) {
    priceListLoop.push(i)
  }
  return (
    <motion.div
      className={styles.container}
      exit={{ opacity: 1 }}
      initial='initial'
      animate='animate'>
      <motion.div variants={fadeInUp}>
        <h1 className={styles.quotes}>Let's Create Course</h1>
      </motion.div>
      <div>
        <form className={styles.form}>
          <motion.div variants={fadeInUp}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type='text'
              placeholder='Name Of The Course'
            />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <textarea
              placeholder='Write What Is Course About'
              value={description}
              onChange={(e) => setDescription(e.target.value)}></textarea>
          </motion.div>
          <motion.div variants={fadeInUp} style={{ width: '100%' }}>
            <div className={styles.paidStyle}>
              <select value={paid} onChange={(e) => setPaid(e.target.value)}>
                <option value='paid'>Paid</option>
                <option value='free'>Free</option>
              </select>
              {paid === 'paid' ? (
                <span>
                  <select
                    onChange={(e) =>
                      setPrice(Number(e.target.value.split('₹')[1]))
                    }>
                    {priceListLoop.map((p) => {
                      return <option key={p}>₹{p}</option>
                    })}
                  </select>
                </span>
              ) : (
                ''
              )}
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <input
              type='text'
              placeholder='Category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className={styles.imageUploadLabelDiv}
            style={{ width: '100%' }}>
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
          </motion.div>
          <motion.div variants={fadeInUp} style={{ width: '100%' }}>
            <button
              disabled={loading}
              onClick={submitHandler}
              className={styles.submitButton}>
              Save & Continue
            </button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  )
}

export default createCoursePage
