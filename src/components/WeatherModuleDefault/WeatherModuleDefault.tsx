import React, { KeyboardEvent, ReactElement, useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import { LocationInput, ModuleWrapper, WeatherInfoWrapper } from './WeatherModuleDefaultStyled'
import WeatherModuleNotFound from '../WeatherModuleNotFound'
import WeatherModuleFarenheit from '../WeatherModuleFarenheit'
import WeatherModuleSelectDay from '../WeatherModuleSelectDay'
import moment from 'moment'
import { AxiosError } from 'axios'

const WeatherModuleDefault = (props?: any) => {
  const { weatherStore } = props
  const {
    coordinatesByLocationName,
    airPollutionInfo,
    weatherSummary,
    currentTemperature,
    currentWindSpeed,
    currentHumidity,
    forecastData,
  } = weatherStore

  const [searchTouched, setSearchTouched] = useState<boolean>(false)

  const handleSearchLocation = (event: KeyboardEvent<HTMLInputElement>) => {
    const locationName = (event.target as HTMLInputElement).value
    weatherStore.getCoordinatesByLocationName(locationName)
      // Omit the param type because unused
      .then((_: any) => setSearchTouched(true),
      )
      .catch((error: AxiosError) => console.error(error))
  }

  const displayLocation = (): string => {
    if (coordinatesByLocationName.length === 0) return ''
    const { name, country } = coordinatesByLocationName[0]
    return `${name}, ${country}`
  }

  const displayTime = (): string => {
    const currentMoment = moment()
    const dayOfWeek = currentMoment.format('dddd')
    const hour = currentMoment.format('hhA')
    return `${dayOfWeek} ${hour}`
  }

  const renderWeatherIcon = (): ReactElement | null => {
    const currentWeather = forecastData?.current?.weather
    if (currentWeather && currentWeather.length !== 0) {
      return (
        <img
          src={weatherStore.getWeatherStatusIconURL(currentWeather[0].icon)}
          alt=''
        />
      )
    }
    return null
  }

  useEffect(() => {
    return () => {
      weatherStore.clearCoordinatesData()
      weatherStore.clearForecastData()
      weatherStore.clearLocationName()
    }
  }, [])

  return (
    <>
      <ModuleWrapper>
        <LocationInput
          allowClear={true}
          onPressEnter={handleSearchLocation}
          placeholder={'Input your location here'} />
      </ModuleWrapper>
      {
        searchTouched
        && coordinatesByLocationName.length === 0
        && (
          <ModuleWrapper>
            <WeatherModuleNotFound />
          </ModuleWrapper>
        )
      }
      {
        coordinatesByLocationName.length !== 0
        && (
          <ModuleWrapper>
            <WeatherInfoWrapper>
              <div className='row'>
                <p className={'location'}>{displayLocation()}</p>
                <time className={'datetime'}>{displayTime()} - {weatherSummary}</time>
              </div>
              <div className='row flex'>
                <div className='temperature-info'>
                  {renderWeatherIcon()}
                  <strong>
                    {currentTemperature && currentTemperature.toFixed(0)}
                  </strong>
                  <WeatherModuleFarenheit />
                </div>
                <div className='weather-info'>
                  <span>Humidity: {currentHumidity}%</span>
                  <span>Wind: {currentWindSpeed}</span>
                  <span>Air Quality: {airPollutionInfo}</span>
                </div>
              </div>
            </WeatherInfoWrapper>
            <WeatherModuleSelectDay />
          </ModuleWrapper>
        )
      }
    </>
  )
}

export default inject('weatherStore')(observer(WeatherModuleDefault))