import React, { useState, useContext } from 'react'
import { Lock, Email } from '@material-ui/icons'
import styles from '../../styles/register.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Context } from '../../context/index'
import { NEXT_BACKEND_URL } from '../../config'

const loginPage = () => {
  // state
  const [email, setEmail] = useState('venkatesh@gmail.com')
  const [password, setPassword] = useState('1234')
  const [loading, setLoading] = useState(false)

  // reducer
  const { state, dispatch } = useContext(Context)

  // router
  const router = useRouter()

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { data } = await axios.post(`${NEXT_BACKEND_URL}/login`, {
        email,
        password,
      })
      dispatch({ type: 'LOGIN', payload: data })

      window.localStorage.setItem('user', JSON.stringify(data))
      setPassword('')
      setEmail('')
      setLoading(false)

      toast.success('Login Success')
      router.push('/')
    } catch (error) {
      setLoading(false)
      toast(error.response.data)
      console.log(error)
    }
  }
  return (
    <>
      <div className={styles.container}>
        <div
          className={styles.quotesContainer}
          className={styles.LoginQuotesContainer}>
          <h1 className={styles.quotes}>Login</h1>
        </div>
        <div>
          <form className={styles.form} onSubmit={submitHandler}>
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
                Login
              </button>
            </div>
          </form>
        </div>
        <div className={styles.loginLinkContainer}>
          Don't have an account? <Link href='/register'>Register</Link>
        </div>
      </div>
    </>
  )
}

export default loginPage
