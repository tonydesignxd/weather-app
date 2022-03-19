import { makeAutoObservable, runInAction } from 'mobx'
import {
  AirPollutionModel, Coordinates,
  ForecastDetailModel,
  GlobalUnit,
  WeatherForecastModel,
  WeatherModel,
} from '../models/weather.model'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { WeatherHelper } from '../helpers/weather.helper'
import { message } from 'antd'

class WeatherStore {

  apiKey = process.env.REACT_APP_API_KEY
  apiURL = process.env.REACT_APP_API_URL

  globalUnit: GlobalUnit = 'metric'
  locationName!: string
  locationCountry!: string
  locationCoordinates: Coordinates = {} as Coordinates
  airPollutionInfo!: string

  currentForecastData: ForecastDetailModel = {} as ForecastDetailModel
  dailyForecastData: ForecastDetailModel[] = []

  constructor() {
    makeAutoObservable(this)
  }

  get currentWeatherDescription(): string {
    return this.currentForecastData?.weather?.[0].description
  }

  get currentTemperature(): number {
    return this.currentForecastData?.temp as number
  }

  get currentWindSpeed(): string {
    if (!this.currentForecastData) return ''
    const { wind_deg, wind_speed } = this.currentForecastData
    const windSpeedUnit = WeatherHelper.getWindUnit(this.globalUnit)
    const windSpeedDeg = WeatherHelper.getWindDirection(wind_deg)
    return `${wind_speed} ${windSpeedUnit} ${windSpeedDeg}`
  }

  get currentHumidity(): string {
    return `${this.currentForecastData?.humidity}%`
  }

  getWeatherStatusIconURL(weatherCode: string): string {
    return `http://openweathermap.org/img/wn/${weatherCode}@2x.png`
  }

  changeGlobalUnit(globalUnit: GlobalUnit): void {
    runInAction(() => this.globalUnit = globalUnit)
    void this.getCoordinatesByLocationName(this.locationName)
  }

  clearCurrentForecastData(): void {
    runInAction(() => this.currentForecastData = {} as ForecastDetailModel)
  }

  clearLocation(): void {
    runInAction(() => {
      this.locationName = ''
      this.locationCountry = ''
    })
  }

  getAirPollutionData(
    lat: number,
    lon: number,
  ): Promise<AirPollutionModel> {
    return new Promise((resolve, reject) => {
      const requestURL = `${this.apiURL}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${this.apiKey}`
      return axios.get(requestURL)
        .then((response: AxiosResponse) => {
          runInAction(() => {
            this.airPollutionInfo = WeatherHelper.getAirPollutionInfo(response.data?.list?.[0]?.main?.aqi)
          })
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
  ): Promise<WeatherForecastModel> {
    let requestURL = `${this.apiURL}/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=${this.globalUnit}&appid=${this.apiKey}`
    return new Promise((resolve, reject) => {
      return axios.get(requestURL)
        .then((response: AxiosResponse) => {
          runInAction(() => {
            this.currentForecastData = response.data.current
            this.dailyForecastData = response.data.daily
          })
          return resolve(response.data)
        })
        .catch((error: AxiosError) => {
          this.clearCurrentForecastData()
          return reject(error)
        })
    })
  }

  getCoordinatesByLocationName(
    locationName: string,
  ): Promise<WeatherModel[]> {
    const requestURL = `${this.apiURL}/geo/1.0/direct?q=${locationName}&limit=5&appid=${this.apiKey}`
    return new Promise((resolve, reject) => {
      return axios.get(requestURL)
        .then((response: AxiosResponse) => {
          runInAction(() => {
            this.locationName = locationName
          })
          if (response.data.length !== 0) {
            const { lat, lon, country, name } = response.data[0]
            runInAction(() => {
              this.locationCountry = country
              this.locationName = name
              this.locationCoordinates = { lat, lon }
            })
            void this.getForecast(lat, lon)
            void this.getAirPollutionData(lat, lon)
          } else {
            this.clearCurrentForecastData()
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