import React from 'react'
import {Breadcrumb} from 'antd'
import {withRouter, Link} from 'react-router-dom'

const breadcrumbNameMap = {
  '/anytime': 'Anytime',
  '/live-schedule': 'Live Schedule',
  '/contribute': 'Contribute'
}

function Breadcrumbs({
  location
}) {
  const pathSnippets = location.pathname.split('/').filter(i => i)

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbNameMap[url]}</Link>
      </Breadcrumb.Item>
    )
  })

  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/">Home</Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems)

  return (
    <Breadcrumb style={{margin: '16px 0'}}>
      {breadcrumbItems}
    </Breadcrumb>
  )
}

export default withRouter(Breadcrumbs)
