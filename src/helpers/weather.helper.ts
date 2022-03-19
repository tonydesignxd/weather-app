import { GlobalUnit } from '../models/weather.model'

export const WeatherHelper = {
  getTemperatureUnit(globalUnit: GlobalUnit): string {
    switch (globalUnit) {
      case 'metric':
        return 'C'
      case 'imperial':
        return 'F'
    }
  },
  getWindUnit(globalUnit: GlobalUnit): string {
    switch (globalUnit) {
      case 'metric':
        return 'KPH'
      case 'imperial':
        return 'MPH'
    }
  },
  getWindDirection(windDegree: number): string {
    if (!windDegree) return ''
    const val = Math.floor((windDegree / 22.5) + 0.5)
    const arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
    return arr[(val % 16)]
  },
  getAirPollutionInfo(index: number): string {
    switch (index) {
      case 1:
        return 'Good'
      case 2:
        return 'Fair'
      case 3:
        return 'Moderate'
      case 4:
        return 'Poor'
      case 5:
        return 'Very Poor'
      default:
        return ''
    }
  },
}