import { makeAutoObservable } from 'mobx'
import {
  AirPollutionModel,
  ForecastDetailModel,
  GlobalUnit,
  WeatherForecastModel,
  WeatherModel,
} from '../models/weather.model'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { WeatherHelper } from '../helpers/weather.helper'

class WeatherStore {

  globalUnit: GlobalUnit = 'metric'
  coordinatesByLocationName: WeatherModel[] = []
  forecastData: WeatherForecastModel = {} as WeatherForecastModel
  locationName = ''
  airPollutionInfo = ''
  apiKey = process.env.REACT_APP_API_KEY
  apiURL = process.env.REACT_APP_API_URL

  constructor() {
    makeAutoObservable(this)
  }

  get weatherSummary(): string {
    const currentWeather = this.forecastData?.current?.weather
    if (!currentWeather) return ''
    if (currentWeather.length === 0) return ''
    return currentWeather[0].description
  }

  get dailyForecast(): ForecastDetailModel[] {
    return this.forecastData?.daily
  }

  get currentTemperature(): number {
    const curTemp = this.forecastData?.current?.temp
    return curTemp as number
  }

  get currentWindSpeed(): string {
    const curWindSpd = this.forecastData?.current?.wind_speed
    const curWindDeg = this.forecastData?.current?.wind_deg
    const windSpeedUnit = WeatherHelper.getWindUnit(this.globalUnit)
    return `${curWindSpd} ${windSpeedUnit} ${WeatherHelper.getWindDirection(curWindDeg)}`
  }

  get currentHumidity(): number {
    const curHumidity = this.forecastData?.current?.humidity
    return curHumidity as number
  }

  getWeatherStatusIconURL(weatherCode: string): string {
    return `http://openweathermap.org/img/wn/${weatherCode}@2x.png`
  }

  changeGlobalUnit(gloablUnit: GlobalUnit): void {
    this.globalUnit = gloablUnit
    void this.getCoordinatesByLocationName(this.locationName)
  }

  clearCoordinatesData(): void {
    this.coordinatesByLocationName.length = 0
  }

  clearForecastData(): void {
    this.forecastData = {} as WeatherForecastModel
  }

  clearLocationName(): void {
    this.locationName = ''
  }

  getAirPollutionData(
    lat: number,
    lon: number,
  ): Promise<AirPollutionModel> {
    return new Promise((resolve, reject) => {
      const requestURL = `${this.apiURL}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${this.apiKey}`
      return axios.get(requestURL)
        .then((response: AxiosResponse) => {
          this.airPollutionInfo = WeatherHelper.getAirPollutionInfo(response.data?.list?.[0]?.main?.aqi)
          return resolve(response.data)
        })
        .catch((error: AxiosError) => {
          console.error(error)
          return reject(error)
        })
    })
  }

  getForecast(
    lat: number,
    lon: number,
    dt?: number,
  ): Promise<WeatherForecastModel> {
    let requestURL = `${this.apiURL}/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=${this.globalUnit}&appid=${this.apiKey}`
    if (dt) requestURL = requestURL.concat(`&dt=${dt}`)
    return new Promise((resolve, reject) => {
      return axios.get(requestURL)
        .then((response: AxiosResponse) => {
          this.forecastData = response.data
          return resolve(response.data)
        })
        .catch((error: AxiosError) => {
          return reject(error)
        })
    })
  }

  getCoordinatesByLocationName(
    locationName: string,
    dt?: number
  ): Promise<WeatherModel> {
    const requestURL = `${this.apiURL}/geo/1.0/direct?q=${locationName}&limit=5&appid=${this.apiKey}`
    return new Promise((resolve, reject) => {
      return axios.get(requestURL)
        .then((response: AxiosResponse) => {
          this.locationName = locationName
          this.coordinatesByLocationName = response.data
          if (this.coordinatesByLocationName.length !== 0) {
            const { lat, lon } = response.data[0]
            void this.getForecast(lat, lon, dt)
            void this.getAirPollutionData(lat, lon)
          }
          return resolve(response.data)
        })
        .catch((error: AxiosError) => {
          console.error(error)
          return reject(error)
        })
    })
  }

}

export default new WeatherStore()