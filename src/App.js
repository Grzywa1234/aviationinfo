import React, { useState, useEffect } from 'react';


const imgwCiv = {
  /*key: "c0d9809aad20beee9e67291d769f074a"*/
  base: "http://awiacja.imgw.pl/rss/metar30.php?airport="
}

const imgwMil = {
  base : "http://awiacja.imgw.pl/rss/metarmil.php?airport="
}

const rsstojson = {
  base : "https://api.rss2json.com/v1/api.json?rss_url=",
  api : "5kfv0uqurdoybsvtjd3hykpcmtotivlkdumjgts2"
}

const notam = {
  base: "https://v4p4sz5ijk.execute-api.us-east-1.amazonaws.com/anbdata/states/notams/notams-realtime-list?",
  api: "d3cb82c0-d0fb-11ea-92a6-f1939f4f9295"
}


function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState([]);
  const [notamResp, setNotam] = useState([]);
  

  const milList = ['EPCE', 'EPDA', 'EPDE', 'EPIR', 'EPKS', 'EPLK', 'EPLY', 'EPMB', 'EPMI', 'EPMM', 'EPNA', 'EPOK', 'EPPR', 'EPPW', 'EPRA', 'EPSN', 'EPTM']
  const civList = ['EPBY', 'EPGD', 'EPKK', 'EPKT', 'EPLB', 'EPLL', 'EPMO', 'EPPO', 'EPRA', 'EPRZ', 'EPSC', 'EPSY', 'EPWA', 'EPWR', 'EPZG']
  

  useEffect(() => {
    setWeather(['Loading IMGW MEATR database..'])
    async function fetchData () {
      if (milList.includes(query)) { 
      const metarData = await fetch(`${rsstojson.base}${imgwMil.base}${query}&api_key=${rsstojson.api}`)
      const response = await metarData.json();
        setWeather(response.items[0].content);
        console.log(response)
        console.log(weather)
      
      
       } else {
         
      const metarData = await fetch(`${rsstojson.base}${imgwCiv.base}${query}&api_key=${rsstojson.api}`)
      const response = await metarData.json();
        setWeather(response.items[0].content);
        console.log(response)
        console.log(weather)
         
       }
    }
    fetchData()
    console.log(weather)
  }, [query]);

  

useEffect(() => {
  setNotam(['Loading ICAO NOTAM database...'])
  async function fetchNotams () {
    const notamData = await fetch(`${notam.base}api_key=${notam.api}&format=json&criticality=&locations=${query}`)
    const response = await notamData.json();
    let notams = [];
    if(response.length !== 0) {
      //ICAO API not always responds, sometimes its empty array
    for (let i = 0; i < response.length; i++) {
      notams.push(`Nr: ${response[i].key}, Start date: ${response[i].startdate}, End date: ${response[i].enddate}, Message: ${response[i].message}`)
    }
  } else {
    notams.push('ICAO NOTAM API not respond. I`m trying to load data.. Please wait or refresh:)')
    fetchNotams()
  }
    setNotam(notams);
    console.log(response)
    console.log(response.length)
  console.log(notamResp)
  };
  fetchNotams()
}, [query])
  


  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}, ${date} ${month} ${year}`;
  }

  

  return (
    <div className={
      (query !=="") ? (milList.includes(query) ? 'App mil' : 'App')
      : 'App'
    }>
      <main> 

        <form>
          <select disabled={false} className="selectbox" value={query} 
          onChange={e => setQuery(e.target.value)}>
            <option>Click here</option>
            <optgroup label="Military">
              {milList.map(el=> {
                return (
                <option key={el.toString()} value={el}>{el}</option>
                )
              })}
            </optgroup>
            <optgroup label="Civil">
            {civList.map(el=> {
                return (
                <option key={el.toString()} value={el}>{el}</option>
                )
              })}

            </optgroup>
          </select>
        </form>

        <div className="link-box">
        <a className="link" href="https://airspace.pansa.pl/" target="blank">AUP</a>
        <a className="link" href="https://www.ais.pansa.pl/aip/aip.html" target="blank">AIP Civ</a>
        <a className="link" href="https://www.ais.pansa.pl/mil/aip.html" target="blank">AIP Mil</a>
      </div>

      {(milList.includes(query) || civList.includes(query)) ? (
      <div>
        <div className="location-box">
        <div className="location">{query}</div>
          <div  className="date">{dateBuilder(new Date())}</div>
        </div>

        <div className="metar-box">
          <div className="metar">{weather}</div>
        </div>

        
        <div className="notam-box">
          Notam:
          {notamResp.map(el=> {
            return (
            <div className="notam" key={el.toString()} value={el}>{el}</div>
            )
          })}
        </div>

      </div>
      ) : (
        <div>
        <div className="noinputbox">
         <div className="noinput">Choose aerodrome above.</div>
          <div  className="noinputdate">{dateBuilder(new Date())}</div>
        </div>
      </div>
      )}

      </main>
    </div>
  );
}

export default App;
