import React from 'react'
import {Layout} from 'antd'

import './not-found.less'

const {Content} = Layout

function NotFound() {
  return (
    <Layout className="not-found-screen">
      <Content className="main">
        <h2>404 - Page not found</h2>
      </Content>
    </Layout>
  )
}

export default NotFound
