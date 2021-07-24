import React, { useContext, useState } from 'react'
import Link from 'next/link'
import styles from './Navbar.module.css'
import {
  PersonOutline,
  Settings,
  ExitToApp,
  PeopleOutline,
  MenuBook,
} from '@material-ui/icons'
import { Context } from '../../context/index'
import { useRouter } from 'next/router'

const Navbar = () => {
  const [profileImageClick, setProfileImageClick] = useState(false)
  const {
    state: { user },
    dispatch,
  } = useContext(Context)

  // router
  const router = useRouter()

  const logoutHandler = () => {
    setProfileImageClick(false)
    dispatch({ type: 'LOGOUT', payload: null })
    window.localStorage.clear('user')
    router.push('/login')
  }

  const profileImageClickHandler = () => {
    setProfileImageClick(!profileImageClick)
  }

  return (
    <div className={styles.navContainer}>
      <ul>
        <li>
          <Link href='/'>Logo</Link>
        </li>

        {user ? (
          <>
            {user.user &&
            user.user.role &&
            user.user.role.includes('Instructor') ? (
              <>
                <li style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '3px' }}>
                    <MenuBook />
                  </span>
                  <Link href='/create-course'>Create Course</Link>
                </li>
                <div>
                  <li style={{ display: 'flex', alignItems: 'center' }}>
                    <span>
                      <PersonOutline />
                    </span>
                    <Link href='/teacher-profile'>Teacher Profile</Link>
                  </li>
                </div>
              </>
            ) : (
              user.user &&
              user.user.role &&
              user.user.role.includes('Admin') && (
                <li style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '3px' }}>
                    <PeopleOutline />
                  </span>
                  <Link href='/become-teacher'>Become Teacher</Link>
                </li>
              )
            )}

            <li className={styles.profileImageContainerLi}>
              <div
                onClick={profileImageClickHandler}
                className={styles.profileImageContainer}>
                <img
                  src={
                    user.user && user.user.picture && user.user.picture.Location
                      ? user.user.picture.Location
                      : user.user && user.user.picture
                  }
                  alt={user && user.name}
                />
              </div>

              {profileImageClick && (
                <div className={styles.dropdownContainer}>
                  <li>
                    <span>
                      <PersonOutline />
                    </span>
                    <Link href='/user-profile'>Profile</Link>
                  </li>
                  <li>
                    {user.user &&
                    user.user.role &&
                    user.user.role.includes('Instructor') ? (
                      <>
                        <span>
                          <Settings />
                        </span>
                        <Link href='/teacher-profile/revenue'>Revenue</Link>
                      </>
                    ) : (
                      <>
                        <span>
                          <Settings />
                        </span>
                        Setting
                      </>
                    )}
                  </li>
                  <li onClick={logoutHandler}>
                    <span>
                      <ExitToApp />
                    </span>
                    Log Out
                  </li>
                </div>
              )}
            </li>
          </>
        ) : (
          <>
            <li style={{ marginRight: '20px' }}>
              <Link href='/register'>Register</Link>
            </li>
            <li>
              <Link href='/login'>Login</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  )
}

export default Navbar
