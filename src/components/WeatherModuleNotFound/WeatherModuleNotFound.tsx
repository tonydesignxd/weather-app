import React from 'react'
import { Empty } from 'antd'

const WeatherModuleNotFound = () => {
  return (
    <Empty
      description={'We could not find weather information for the location above'}
    />
  )
}

export default WeatherModuleNotFound