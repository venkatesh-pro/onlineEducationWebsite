import axios from 'axios'
import React, { useContext, useEffect } from 'react'
import { Context } from '../../../context/index'
import LoadingComponent from '../../../component/Loading/Loading'
import { NEXT_BACKEND_URL } from '../../../config'

const callBackPage = () => {
  const {
    state: { user },
    dispatch,
  } = useContext(Context)

  useEffect(() => {
    const getAccountStatus = async () => {
      const token = window.localStorage.getItem('user')
        ? JSON.parse(window.localStorage.getItem('user'))
        : ''

      const config = {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      }
      try {
        const { data } = await axios.get(
          `${NEXT_BACKEND_URL}/get-account-status`,
          config
        )

        if (data) {
          dispatch({ type: 'LOGIN', payload: data })
        }
        window.localStorage.setItem('user', JSON.stringify(data))

        window.location.href = '/teacher-profile'
      } catch (error) {
        console.log(error)
      }
    }
    getAccountStatus()
  }, [user])
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: 'calc(100vh - 70px)',
      }}>
      <LoadingComponent />
    </div>
  )
}

export default callBackPage
