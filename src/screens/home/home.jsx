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
            <h1>Quarantine Cruise</h1>
            <p className="subtitle">Activities &amp; livestreaming events to help you stay busy during the Covid-19 quarantine</p>
          </Col>
          <Col span={6} style={{textAlign: 'right'}}>
            <img className="logo" src={Logo} alt="Quarantine Cruise"/>
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
