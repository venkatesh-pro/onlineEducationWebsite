import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { NEXT_BACKEND_URL } from '../config'
import Layout from '../component/Layout/Layout'

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

const homePage = ({ courses }) => {
  return (
    <Layout>
      <motion.div
        className={styles.container}
        exit={{ opacity: 1 }}
        initial='initial'
        animate='animate'>
        <div className={styles.titleContainer}>
          <h2>New Courses</h2>
        </div>
        <div className={styles.courseContainer}>
          {courses &&
            courses.map((c) => {
              return (
                <motion.div variants={fadeInUp}>
                  <div className={styles.imageContainer}>
                    <Link href={`course/${c.slug}`}>
                      <img src={c.image.Location} alt='image' />
                    </Link>
                  </div>
                  <div className={styles.infoContainer}>
                    <h1>
                      <Link href={`course/${c.slug}`}>{c.name}</Link>
                    </h1>
                    <p>by {c.instructor && c.instructor.name}</p>
                    <p>{c.category}</p>
                    <p>{c.price === 0 ? 'Free' : `₹ ${c.price}`} </p>
                  </div>
                </motion.div>
              )
            })}
        </div>
      </motion.div>
    </Layout>
  )
}

export async function getServerSideProps() {
  const { data } = await axios.get(`${NEXT_BACKEND_URL}/course`)

  return {
    props: {
      courses: data,
    },
  }
}
export default homePage
