import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Settings } from '@material-ui/icons'
import { NEXT_BACKEND_URL } from '../../../config'
import styles from '../../../styles/admin-revenue.module.css'

const teacherRevenuePage = () => {
  const [balance, setBalance] = useState({ pending: [] })

  useEffect(() => {
    sendBalanceRequest()
  }, [])

  const sendBalanceRequest = async () => {
    const token = window.localStorage.getItem('user')
      ? JSON.parse(window.localStorage.getItem('user'))
      : ''

    const config = {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    }
    const { data } = await axios.get(
      `${NEXT_BACKEND_URL}/teacher/balance`,
      config
    )

    setBalance(data)
  }

  const handlePayoutSettings = async () => {
    // const token = window.localStorage.getItem('user')
    //   ? JSON.parse(window.localStorage.getItem('user'))
    //   : ''
    // const config = {
    //   headers: {
    //     Authorization: `Bearer ${token.token}`,
    //   },
    // }
    // const { data } = await axios.get(
    //   `http://localhost:5000/api/teacher/payout-settings`,
    //   config
    // )
    // window.location.href = data
  }
  return (
    <div className={styles.container}>
      <div >
        <h1>
          Pending Balance Rs
          {balance.pending[0] && balance.pending[0].amount / 100}
        </h1>
        <h1>
          All Payment Details{' '}
          <Settings
            onClick={handlePayoutSettings}
            style={{ fontSize: '26px' }}
          />
        </h1>
      </div>
    </div>
  )
}

export default teacherRevenuePage
