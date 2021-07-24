import { Cancel } from '@material-ui/icons'
import React, { useState } from 'react'
import styles from './VideoPreviewModel.module.css'

const VideoPreviewModel = ({ course, model, setModel }) => {
  const [videoIndex, setVideoIndex] = useState(0)
  return (
    <div className={styles.container}>
      {console.log({ course })}
      <div className={styles.videoContainer}>
        <div>
          <h1>Course Preview</h1>
          <span onClick={() => setModel(!model)}>
            <Cancel />
          </span>
        </div>
        <video
          controls
          autoPlay
          src={
            course.lesson &&
            course.lesson[videoIndex] &&
            course.lesson[videoIndex].video &&
            course.lesson[videoIndex].video.Location
          }></video>

        {course.lesson &&
          course.lesson.map((c, i) => {
            return c.free_preview ? (
              <>
                <div
                  className={styles.videoPreviewTextImageContainer}
                  onClick={() => setVideoIndex(i)}>
                  <div className={styles.thumbNailImageContainer}>
                    <img
                      src={course.image && course.image.Location}
                      alt='image'
                    />
                  </div>
                  <div>
                    <p>{c.title}</p>
                  </div>
                </div>
              </>
            ) : (
              ''
            )
          })}
      </div>
    </div>
  )
}

export default VideoPreviewModel
