import styled from 'styled-components'

export const ForecastWrapper = styled.ul`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 0;
`
export const ForecastItem = styled.li`
  flex: 1;
  border: 1px solid #e3e3e3;
  transition: all ease .3s;
  
  &:hover {
    transition: all ease .3s;
    background-color: #f3f3f3;
    cursor: pointer;
  }

  .weekday {
    text-align: center;
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 0;
  }

  .temperature {
    text-align: center;
    margin-bottom: 0;
    line-height: 1.2;

    &.high {
      font-weight: bold;
      font-size: 16px;
    }
  }
`