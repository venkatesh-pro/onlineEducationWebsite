import React from 'react'
import styles from './Model.module.css'

const ModelComponent = ({
  title,
  loading,
  handleAddLesson,
  setTitle,
  content,
  setContent,
  handleVideo,
  isModel,
  setIsModel,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.container1}>
        <p>+ Add Lesson</p>
        <p className={styles.cancelP} onClick={() => setIsModel(!isModel)}>
          X
        </p>
      </div>
      <div className={styles.container2}>
        <form>
          <div>
            <input
              type='text'
              placeholder='Title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <textarea
              placeholder='Content'
              value={content}
              onChange={(e) => setContent(e.target.value)}></textarea>
          </div>
          <div>
            <label>
              Upload Video
              <input
                type='file'
                hidden
                accept='video/*'
                onChange={handleVideo}
              />
            </label>
          </div>
          <div className={styles.buttonDiv}>
            <button
              disabled={loading}
              onClick={(e) => {
                e.preventDefault()
                handleAddLesson()
              }}>
              save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModelComponent
