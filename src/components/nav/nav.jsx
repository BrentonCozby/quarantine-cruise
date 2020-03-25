import React from 'react'
import {Layout, Menu} from 'antd'
import {Link, withRouter, useLocation} from 'react-router-dom'
import Logo from 'images/quarantine-cruise-logo.png'

import './nav.less'

const {Header} = Layout

const menuItems = [
  {
    key: 'contribute',
    label: 'Contribute'
  }
]

function Nav() {
  const location = useLocation()
  const pathSnippets = location.pathname.split('/').filter(i => i)

  if (location.pathname === '/' || location.pathname === '/index.html') {
    return null
  }

  const selectedKeys = menuItems.filter(item => {
    return pathSnippets.includes(item.key)
  }).map(item => item.key)

  return (
    <Header className="nav-component">
      <Link className="logo-and-title" to="/">
        <div className="logo-container">
          <img className="logo" src={Logo} alt="Quarantine Cruise logo" />
        </div>
        <h2 className="app-title">Quarantine Cruise</h2>
      </Link>
      <Menu
        className="menu"
        theme="dark"
        mode="horizontal"
        selectedKeys={selectedKeys}
      >
        <Menu.Item key="contribute">
          <Link to="/contribute">Contribute</Link>
        </Menu.Item>
      </Menu>
    </Header>
  )
}

export default withRouter(Nav)
