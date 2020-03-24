import React from 'react'
import {Layout} from 'antd'

const {Footer} = Layout

function FooterComponent() {
  return (
    <Footer className="footer-component">
      <p style={{textAlign: 'center', margin: '0'}}>
        Created by&nbsp;
        <a href="https://brentoncozby.com" target="_blank" rel="noopener noreferrer">Brenton Cozby</a>&nbsp;
        &amp;&nbsp;
        <a href="https://www.linkedin.com/in/heidi-liedtke" target="_blank" rel="noopener noreferrer">Heidi Liedtke</a>.
      </p>
    </Footer>
  )
}

export default FooterComponent
