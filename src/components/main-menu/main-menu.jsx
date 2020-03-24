import React, {useState} from 'react'
import {Drawer, Button, Menu} from 'antd'
import {Link} from 'react-router-dom'
import {UnorderedListOutlined} from '@ant-design/icons'
import './main-menu.less'

function MainMenu() {
  const [isMenuVisible, setIsMenuVisible] = useState(false)

  const openMenu = () => {
    setIsMenuVisible(true)
  }

  const onClose = () => {
    setIsMenuVisible(false)
  }

  return (
    <div className="main-menu-component">
      <UnorderedListOutlined style={{color: '#fff'}} onClick={openMenu}/>
      <Drawer
        visible={isMenuVisible}
        onClose={onClose}
        className="main-menu-drawer-component"
      >
        <Menu mode="inline">
          <Menu.Item>
            <Link to="contribute">
              Contribute
            </Link>
          </Menu.Item>
        </Menu>
      </Drawer>
    </div>
  )
}

export default MainMenu
