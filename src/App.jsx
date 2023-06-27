import { useState, useEffect } from 'react';
import './App.css';
import React from 'react';
import { render } from 'react-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMap from 'highcharts/modules/map';
import proj4 from 'proj4';
import mapDataIE from '@highcharts/map-collection/countries/ie/ie-all.geo.json';
highchartsMap(Highcharts); // Initialize the map module

// tidbit of code below needed for map. IDK why but that's what the example said

if (typeof window !== 'undefined') {
  window.proj4 = window.proj4 || proj4;
}

function App() {
  const [status, setStatus] = useState('idle');
  const [jsonData, setJsonData] = useState();

  // -------------------------------- Fetching data code below
  // fetchItems gets data from google API and sets the state of jsonData
  async function fetchItems() {
    setStatus('loading');

    const response = await fetch(
      'https://docs.google.com/spreadsheets/d/1ZcWTuusy8eaCJj0IDUtXpq-ZR7eiyFD8NeUhZMkHk24/gviz/tq?tqx=out:json',
      {
        method: 'GET',
        majorDimension: 'ROWS',
      },
    );

    const textData = await response.text();

    if (!textData.error) {
      setStatus('success');
      const startIndex = textData.indexOf('{');
      const endIndex = textData.lastIndexOf('}') + 1;
      const data = JSON.parse(textData.slice(startIndex, endIndex));
      console.log(data);
      setJsonData(data);
    } else {
      setStatus('error');
    }
  }

  // useEffect makes sure fetchItems() runs upon initial render
  // except it runs twice and IDK why lol
  useEffect(() => {
    console.log('running data fetching');
    fetchItems();
  }, []);

  // -------------------------------- Map code below

  const mapOptions = {
    chart: {
      map: 'countries/ie/ie-all',
    },
    title: {
      text: 'Map Demo',
    },
    credits: {
      enabled: false,
    },
    mapNavigation: {
      enabled: true,
    },
    tooltip: {
      headerFormat: '',
      pointFormat:
        '<b>{point.freq}</b><br><b>{point.keyword}</b>                      <br>lat: {point.lat}, lon: {point.lon}',
    },
    series: [
      {
        // Use the gb-all map with no data as a basemap
        name: 'Basemap',
        mapData: mapDataIE,
        borderColor: '#A0A0A0',
        nullColor: 'rgba(200, 200, 200, 0.3)',
        showInLegend: false,
      },
      {
        // Specify points using lat/lon
        type: 'mapbubble',
        name: 'Cities',
        color: '#4169E1',
        data: [
          { z: 10, keyword: 'Galway', lat: 53.27, lon: -9.25 },
          { z: 4, keyword: 'Dublin', lat: 53.27, lon: -6.25 },
        ],
        cursor: 'pointer',
        point: {
          events: {
            click: function () {
              console.log(this.keyword);
            },
          },
        },
      },
    ],
  };

  return (
    <>
      {status === 'loading' && <p>Loading assets...</p>}
      {status === 'error' && (
        <p>We regret to inform you of your grave misdeeds...</p>
      )}
      {status === 'success' && (
        <div>
          <h1> IT'S AN APP</h1>
          <HighchartsReact
            constructorType={'mapChart'}
            highcharts={Highcharts}
            options={mapOptions}
          />
          ;
        </div>
      )}
    </>
  );
}

export default App;
