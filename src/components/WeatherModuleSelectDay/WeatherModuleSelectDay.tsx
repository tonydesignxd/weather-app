import React, { ReactElement } from 'react'
import { ForecastItem, ForecastWrapper } from './WeatherModuleSelectDayStyled'
import { inject, observer } from 'mobx-react'
import { ForecastDetailModel, TemperatureModel } from '../../models/weather.model'
import moment from 'moment'
import { message } from 'antd'
import { toJS } from 'mobx'

const WeatherModuleSelectDay = (props?: any) => {

  const { weatherStore } = props
  const { dailyForecastData, locationName } = weatherStore

  const selectDay = (record: ForecastDetailModel): void => {
    console.log(toJS(record))
    message.info('Feature not implemented', 2)
      .then(() => message.info('API for getting forecast for specific day is not included in instruction'))
  }

  const renderForecastItem = (): ReactElement | null => {
    if (!dailyForecastData) return null
    return dailyForecastData.map((record: ForecastDetailModel) => (
      <ForecastItem key={record.dt} onClick={() => selectDay(record)}>
        <p className={'weekday'}>{moment.unix(record.dt).format('ddd DD')}</p>
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