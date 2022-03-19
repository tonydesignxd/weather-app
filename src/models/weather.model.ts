export type GlobalUnit = 'imperial' | 'metric'

export interface WeatherModel {
  name: string;
  local_names: { [key: string]: string };
  lat: number;
  lon: number;
  country: string;
  state: string;
}

export interface WeatherForecastModel {
  current: ForecastDetailModel;
  daily: ForecastDetailModel[];
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
}

export interface ForecastDetailModel {
  clouds: number;
  dew_point: number;
  dt: number;
  feels_like: TemperatureModel;
  humidity: number;
  moon_phase: number;
  moonrise: number;
  moonset: number;
  pop: number;
  pressure: number;
  sunrise: number;
  sunset: number;
  temp: TemperatureModel | number;
  uvi: number;
  weather: WeatherDetailModel[];
  wind_deg: number;
  wind_gust: number;
  wind_speed: number;
}

export interface TemperatureModel {
  day: number;
  eve: number;
  max: number;
  min: number;
  morn: number;
  night: number;
}

export interface WeatherDetailModel {
  description: string;
  icon: string;
  id: number;
  main: string;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface AirPollutionModel {
  coord: Coordinates,
  list: AirPollutionListItemModel[]
}

export interface AirPollutionListItemModel {
  dt: number;
  main: {
    aqi: number;
  },
  components: AirQualityModel
}

export interface AirQualityModel {
  co: number;
  nh3: number;
  no: number;
  no2: number;
  o3: number;
  pm2_5: number;
  pm10: number;
  so2: number;
}