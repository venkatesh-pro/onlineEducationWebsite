import React, { useState, useContext } from 'react'
import { PermIdentity, Lock, Email, Publish } from '@material-ui/icons'
import styles from '../../styles/register.module.css'
import Link from 'next/link'
import axios from 'axios'
import { toast } from 'react-toastify'
import Resizer from 'react-image-file-resizer'
import { Context } from '../../context/index'
import { useRouter } from 'next/router'
import { NEXT_BACKEND_URL } from '../../config'

const registerPage = () => {
  // state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [preview, setPreview] = useState('')
  const [uploadTitle, setUploadTitle] = useState('Upload Your Pic')
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState('')

  // router
  const router = useRouter()

  // reducer
  const { state, dispatch } = useContext(Context)
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
        toast.error(error.response)
      }
    })
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { data } = await axios.post(`${NEXT_BACKEND_URL}/register`, {
        name,
        email,
        password,
        picture: image,
      })
      dispatch({ type: 'LOGIN', payload: data })
      console.log(data)
      window.localStorage.setItem('user', JSON.stringify(data))
      setName('')
      setPassword('')
      setEmail('')
      setLoading(false)

      toast.success('success')
      router.push('/')
    } catch (error) {
      setLoading(false)
      toast(error.response)
      console.log(error)
    }
  }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.quotesContainer}>
          <h1 className={styles.quotes}>
            Hi, <span>Learn</span> and <span>Earn</span>
          </h1>
        </div>
        <div className={styles.imageContainerDiv}>
          <div className={styles.imageContainer}>
            <label className={styles.imageLabel}>
              {preview ? (
                <>
                  <img
                    width='100%'
                    height='100%'
                    style={{ borderRadius: '50%' }}
                    src={preview}
                    alt='img'
                  />
                </>
              ) : (
                <Publish />
              )}
              <input
                type='file'
                accept='image/*'
                hidden
                onChange={handleImage}
              />
            </label>
          </div>
          <span className={styles.imageUploadQuotes}>{uploadTitle}</span>
        </div>
        <div>
          <form className={styles.form} onSubmit={submitHandler}>
            <div className={styles.inputNameDiv}>
              <span className={styles.userIcon}>{<PermIdentity />}</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type='text'
                placeholder='Name'
              />
            </div>
            <div className={styles.inputEmailDiv}>
              <span className={styles.userIcon}>{<Email />}</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type='email'
                placeholder='Email'
              />
            </div>
            <div className={styles.inputPasswordDiv}>
              <span className={styles.userIcon}>{<Lock />}</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type='password'
                placeholder='Password'
              />
            </div>
            <div className={styles.buttonDiv}>
              <button disabled={loading} type='submit'>
                Sign Up
              </button>
            </div>
          </form>
        </div>
        <div className={styles.loginLinkContainer}>
          Already Have An Account, <Link href='/login'>Login</Link>
        </div>
      </div>
    </>
  )
}

export default registerPage
