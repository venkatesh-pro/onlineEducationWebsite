import React, { useState, useContext } from 'react'
import LoadingComponent from '../../component/Loading/Loading'
import style from '../../styles/become-teacher.module.css'
import axios from 'axios'
import { NEXT_BACKEND_URL } from '../../config'
import { Context } from '../../context/index'

const becomeTeacherPage = () => {
  const [loading, setLoading] = useState(false)
  const {
    state: { user },
  } = useContext(Context)
  const becomeTeacherHandler = async () => {
    setLoading(true)
    const token = window.localStorage.getItem('user')
      ? JSON.parse(window.localStorage.getItem('user'))
      : ''

    const config = {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    }
    const { data } = await axios.get(
      `${NEXT_BACKEND_URL}/become-teacher`,
      config
    )

    window.location.href = data
    console.log({ data })
    setLoading(false)
  }

  return (
    <>
      {console.log(user && user.user && user.user.role)}
      {user && user.user && user.user.role.includes('Admin') ? (
        <div className={style.container}>
          <h1>
            <span>"</span>Become Teacher<span>"</span>
          </h1>
          <div className={style.quotesContainer}>
            <p>
              Let Us Share Our <span>Knowledge </span>
              And
              <span> Earn</span>
            </p>
          </div>
          <div className={style.buttonContainer}>
            <button onClick={becomeTeacherHandler}>
              {loading ? <LoadingComponent /> : 'Become Teacher'}
            </button>
          </div>
        </div>
      ) : (
        <div className={style.container}>
          <h1>This Page Accessed By Only Admin</h1>
        </div>
      )}
    </>
  )
}

export default becomeTeacherPage
