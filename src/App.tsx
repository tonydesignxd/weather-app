import React from 'react'
// Antd
import 'antd/dist/antd.css'
import { message } from 'antd'
// MobX
import { Provider } from 'mobx-react'
import weatherStore from './stores/weatherStore'
// Components
import { AppWrapper } from './styles/StyledComponents'
import WeatherModuleDefault from './components/WeatherModuleDefault'
// Axios
import axios from 'axios'

const stores = {
  weatherStore,
}

axios.interceptors.response.use(
  response => response,
  error => {
    message.config({ maxCount: 1 })
    void message.error(error?.response?.data?.message || 'Unknown error')
  },
)

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
