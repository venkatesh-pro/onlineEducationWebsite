import React from 'react'
import Head from 'next/head'
const Layout = ({ title, keyword, description, children }) => {
  return (
    <div>
      <Head>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5892707750585096"
     crossorigin="anonymous"></script>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta name='keywords' content={keyword} />
      </Head>
      {children}
    </div>
  )
}
Layout.defaultProps = {
  title: 'Online Education',
  description: 'best online education platform in india,venkatesh',
  keyword: 'python,javascript, TamilNadu',
}
export default Layout
