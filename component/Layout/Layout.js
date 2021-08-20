import React from 'react'
import Head from 'next/head'
const Layout = ({ title, keyword, description, children }) => {
  return (
    <div>
      <Head>
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
