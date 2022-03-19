import React from 'react'
import { TemperatureToggle, WeatherModuleFarenheitWrapped } from './WeatherModuleFarenheitStyled'
import { inject, observer } from 'mobx-react'
import { GlobalUnit } from '../../models/weather.model'

const WeatherModuleFarenheit = (props?: any) => {

  const { weatherStore } = props
  const { globalUnit } = weatherStore

  const changeUnit = (unit: GlobalUnit): void => {
    if (globalUnit === unit) return
    weatherStore.changeGlobalUnit(unit)
  }

  return (
    <WeatherModuleFarenheitWrapped>
      <TemperatureToggle onClick={() => changeUnit('metric')}>C</TemperatureToggle>
      <span style={{ margin: '0 5px' }}>/</span>
      <TemperatureToggle onClick={() => changeUnit('imperial')}>F</TemperatureToggle>
    </WeatherModuleFarenheitWrapped>
  )
}

export default inject('weatherStore')(observer(WeatherModuleFarenheit))