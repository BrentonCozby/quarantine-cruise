import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {Layout} from 'antd'
import {setTwoToneColor} from '@ant-design/icons'
import 'css/App.less'

import NavComponent from 'components/nav'
import FooterComponent from 'components/footer'

import HomeScreen from 'screens/home'
import ContributeScreen from 'screens/contribute'
import NotFoundScreen from 'screens/not-found'

setTwoToneColor('#13c2c2')

function App() {
  return (
    <Layout className="App">
      <BrowserRouter>
        <div className="layout-without-footer">

          <NavComponent/>

          <Switch>
            <Route path="/" exact component={HomeScreen}/>
            <Route path="/index.html" exact component={HomeScreen}/>
            <Route path="/contribute" component={ContributeScreen}/>
            <Route component={NotFoundScreen}/>
          </Switch>

        </div>
        <FooterComponent/>
      </BrowserRouter>
    </Layout>
  );
}

export default App
