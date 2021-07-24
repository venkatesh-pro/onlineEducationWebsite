import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import Loading from '../../../component/Loading/Loading'
import { NEXT_BACKEND_URL } from '../../../config'

const stripeSuccessPage = () => {
  const router = useRouter()

  const { id } = router.query
  useEffect(() => {
    if (id) {
      successRequest()
    }
  }, [id])

  const successRequest = async () => {
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
        `${NEXT_BACKEND_URL}/stripe-success/${id}`,
        config
      )
      return router.push(`/user-profile/course/${data.course.slug}`)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <Loading />
    </div>
  )
}

export default stripeSuccessPage
