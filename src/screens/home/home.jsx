import React from 'react'
import {Layout, Row, Col} from 'antd'
import Media from 'react-media'
import MainMenu from 'components/main-menu'
import Logo from 'images/quarantine-cruise-logo.png'
import './home.less'
import EventList from 'components/event-list'

const {Content} = Layout

function Home() {
  return (
    <Layout className="home-screen screen">
      <header>
        <Media query="(max-width: 991px)" render={() => <MainMenu/>}/>
        <Row align="middle">
          <Col span={18}>
            <h1>Quaratine Cruise</h1>
            <p className="subtitle">Activities &amp; Livestreaming Events</p>
          </Col>
          <Col span={6} style={{textAlign: 'right'}}>
            <img className="logo" src={Logo} alt="Quaratine Cruise"/>
          </Col>
        </Row>
      </header>
      <Content className="main">
        <EventList/>
      </Content>
    </Layout>
  )
}

export default Home
