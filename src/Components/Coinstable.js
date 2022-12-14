import { Container, createTheme ,LinearProgress,makeStyles,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,TextField,ThemeProvider, Typography } from '@material-ui/core';

import React, { useEffect, useState } from 'react'

import { CryptoState } from '../CryptoContext';
import { useNavigate } from 'react-router-dom';
import { numberWithCommas } from './Carousel';
import { Pagination } from '@material-ui/lab';

const useStyles = makeStyles({
  row:{
    backgroundColor:"#16171a",
    cursor:"pointer",
    "&:hover":{
      backgroundColor:"#131111",
    }
  },
  pagination:{
    "& .MuiPaginationItem-root":{
      color:"gold"
    }
  }
})

const Coinstable = () => {
  const navigate = useNavigate();
  
  const [search, setSearch] = useState("")
  const {currency , symbol , coins , loading ,fetchcoins}=CryptoState();
  const [page, setPage] = useState(1)
  const classes= useStyles();
  
  const darkTheme = createTheme({
    palette: {
      primary: {
        main:"#fff"
      },
      type:"dark",
    },
  });

  

  useEffect(() => {
    fetchcoins();
  }, [])

  const handleSearch = ()=>{
    return coins.filter((coin)=>{
      return coin.name.toLowerCase().includes(search) || coin.symbol.toLowerCase().includes(search);
    })
  }
  
  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{textAlign:"center"}}>
    <Typography variant='h4' style={{margin:18}}>
      Crypto currency prices by market cap
    </Typography>
    <TextField label="Search for a crypto currency..." variant='outlined' style={{marginBottom:20 , width:"100%"}}
    onChange={(e)=>{setSearch(e.target.value)}}></TextField>
    <TableContainer>
      {
        loading?(
          <LinearProgress style={{backgroundColor:"gold"}}></LinearProgress>
        ):(          
          <Table>
            <TableHead style={{backgroundColor:"gold"}}>
              <TableRow>
                {["Coin","Price","24h Change","Market Cap"].map((head)=>{
                  return <TableCell style={{color:"black",fontWeight:700}} key={head} align={head==="Coin"?"":"right"}>
                    {head}
                  </TableCell>
                })}
              </TableRow>
            </TableHead>
            <TableBody>
                {handleSearch().slice((page-1)*10,(page-1)*10+10).map((row)=>{
                  const profit = row.price_change_percentage_24h>0;
                  return(
                    <TableRow onClick={()=>{navigate(`/coins/${row.id}`)}} className={classes.row} key={row.name}>
                      <TableCell component="th" scope="row" style={{display:"flex" , gap:15}}>
                        <img src={row.image} alt={row.name} height={50} style={{marginBottom:10}}/>
                        <div style={{display:"flex" , flexDirection:"column"}}>
                          <span style={{textTransform:"uppercase", fontSize:22}}>{row.symbol}</span>
                          <span style={{color:"grey"}}>{row.name}</span>
                        </div>
                      </TableCell>
                      <TableCell align='right'>
                        {symbol}{" "}{numberWithCommas(row.current_price.toFixed(2))}
                      </TableCell>
                      <TableCell align='right' style={{color:profit>0?"rgb(14,203,129)":"red" , fontWeight:500}}>
                        {profit && "+"} {row.price_change_percentage_24h.toFixed(2)}%
                      </TableCell>
                      <TableCell align='right'>
                        {symbol}{" "}{numberWithCommas(row.market_cap.toString().slice(0,-6))}M
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>          
        )
      }
    </TableContainer>
    <Pagination style={{padding:20, width:"100%" , display:"flex" , justifyContent:"center"}}
      classes={{ul:classes.pagination}}
      count={(handleSearch()?.length/10).toFixed(0)}
      onChange={(_,value)=>{
        setPage(value);
        window.scroll(0,450);
      }}
    />
      </Container>
    </ThemeProvider>
  )
}

export default Coinstable