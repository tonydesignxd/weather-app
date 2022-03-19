import React, { ReactElement, useEffect } from 'react'
import { ForecastItem, ForecastWrapper } from './WeatherModuleSelectDayStyled'
import { inject, observer } from 'mobx-react'
import { ForecastDetailModel, TemperatureModel } from '../../models/weather.model'
import moment from 'moment'
import { AxiosError } from 'axios'
import { toJS } from 'mobx'

const WeatherModuleSelectDay = (props?: any) => {

  const { weatherStore } = props
  const { dailyForecast, locationName } = weatherStore

  const selectDay = (record: ForecastDetailModel): void => {
    const { dt } = record
    weatherStore.getCoordinatesByLocationName(locationName, dt)
      .catch((error: AxiosError) => {
        console.error(error)
      })
  }

  const renderForecastItem = (): ReactElement | null => {
    if (!dailyForecast) return null
    return dailyForecast.map((record: ForecastDetailModel) => (
      <ForecastItem key={record.dt} onClick={() => selectDay(record)}>
        <p className={'weekday'}>{moment.unix(record.dt).format('ddd')}</p>
        <img src={weatherStore.getWeatherStatusIconURL(record.weather[0].icon)} alt='' />
        <p className={'temperature high'}>{(record.temp as TemperatureModel).max.toFixed(0)}</p>
        <p className={'temperature low'}>{(record.temp as TemperatureModel).min.toFixed(0)}</p>
      </ForecastItem>
    ))
  }

  return (
    <ForecastWrapper>
      {renderForecastItem()}
    </ForecastWrapper>
  )
}

export default inject('weatherStore')(observer(WeatherModuleSelectDay))