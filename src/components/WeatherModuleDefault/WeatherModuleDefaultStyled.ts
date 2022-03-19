import styled from 'styled-components'
import { Input } from 'antd'

export const ModuleWrapper = styled.div`
  min-width: 590px;
  max-width: 590px;
  margin-left: auto;
  margin-right: auto;
  display: block;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, .1);
  padding: 10px;
  margin-bottom: 10px;
`
export const LocationInput = styled(Input)``
export const WeatherInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .row {
    width: 100%;

    &.flex {
      display: flex;
      align-items: center;
      gap: 60px;
    }
  }

  .weather-info {
    display: flex;
    flex-direction: column;
  }

  .temperature-info {
    display: flex;
    align-items: center;

    strong {
      font-weight: bold;
      font-size: 28px;
      position: relative;
      margin-right: 20px;
      line-height: 1;

      &:after {
        display: block;
        content: 'o';
        position: absolute;
        top: -4px;
        right: -13px;
        font-weight: bold;
        line-height: 1;
        font-size: 20px;
      }
    }
  }

  .location {
    margin-bottom: 0;
    font-weight: bold;
    font-size: 16px;
    line-height: 1.2;
  }

  .datetime {
    text-transform: capitalize;
  }
`