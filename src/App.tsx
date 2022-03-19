import React from 'react'
// Antd
import 'antd/dist/antd.css'
// MobX
import { Provider } from 'mobx-react'
import weatherStore from './stores/weatherStore'
// Components
import { AppWrapper } from './styles/StyledComponents'
import WeatherModuleDefault from './components/WeatherModuleDefault'

const stores = {
  weatherStore,
}

const App = () => {
  return (
    <Provider {...stores}>
      <AppWrapper>
        <WeatherModuleDefault />
      </AppWrapper>
    </Provider>
  )
}

export default App
