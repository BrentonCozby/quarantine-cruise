import React from 'react'
import {Layout, Button, Row, Col} from 'antd'
import BreadcrumbsComponent from 'components/breadcrumbs'

import './contribute.less'

const {Content} = Layout

function Contribute() {
  return (
    <Layout className="contribute-screen">
      <BreadcrumbsComponent/>
      <Content className="main">
        <h1>Contribute</h1>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Button type="primary" href="https://forms.gle/DifzCU1uMWzqpDA57" target="_blank" rel="noopener noreferrer">
              Submit a Scheduled Event
            </Button>
          </Col>
          <Col span={24}>
            <Button type="primary" href="https://forms.gle/ioLrkeLYFn3Rtj9S7" target="_blank" rel="noopener noreferrer">
              Submit a Resource or Activity
            </Button>
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}

export default Contribute
