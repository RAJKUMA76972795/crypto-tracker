import { CircularProgress, createTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';
import { HistoricalChart } from '../config/api';
import { CryptoState } from '../CryptoContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { chartDays } from '../config/data';
import SelectButton from './SelectButton';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const useStyles = makeStyles((theme) => ({
  container: {
    width: "75%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    padding: 40,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      marginTop: 0,
      padding: 20,
      paddingTop: 0
    }
  }
}))

const CoinInfo = ({ coin }) => {
  const classes = useStyles();
  const [historicalData, setHistoricalData] = useState();
  const [days, setDays] = useState(1);
  const { currency, symbol } = CryptoState();

  const fetchHistoricalData = async () => {
    const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
    setHistoricalData(data.prices);
  }
  console.log(historicalData);
  useEffect(() => {
    fetchHistoricalData();
    console.log(historicalData)
  }, [currency, days])

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff"
      },
      type: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        {
          !historicalData ? (
            <CircularProgress style={{ color: "gold" }} size={250} thickness={1} />
          ) : (
            <>
              <Line
                data={{
                  labels: historicalData.map(coin => {
                    let date = new Date(coin[0]);
                    let time = date.getHours() > 12 ? `${date.getHours() - 12}:${date.getMinutes()} pm` : `${date.getHours()}:${date.getMinutes()} am`;
                    return days === 1 ? time : date.toLocaleDateString();
                  }),
                  datasets: [
                    {
                      data: historicalData.map((coin) => coin[1]),
                      label: `Price (past ${days} Days ) in ${currency}`,
                      borderColor: "gold"
                    }
                  ]
                }}
                options={{
                  elements: {
                    point: {
                      radius: 1
                    }
                  }
                }} />
              <div 
              style={{
                display:"flex",
                marginTop:20,
                justifyContent:"space-around",
                width:"100%"
              }}>
                {chartDays.map(day=>{
                  return <SelectButton key={day.value} onClick={()=>setDays(day.value)} selected={day.value===days}>{day.label}</SelectButton>
                })}
              </div>
            </>
          )

        }
      </div>
    </ThemeProvider>
  )
}

export default CoinInfo