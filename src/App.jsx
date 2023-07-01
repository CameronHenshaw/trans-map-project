import { useState, useEffect } from 'react';
import './App.css';
import React from 'react';
import Highcharts, { color } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMap from 'highcharts/modules/map';
import mapDataUS from '@highcharts/map-collection/countries/us/custom/us-small.geo.json';

highchartsMap(Highcharts); // Initialize the map module

function App() {
  const [status, setStatus] = useState('idle');
  const [jsonData, setJsonData] = useState();
  const [mapData, setMapData] = useState([]);

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
    // pretending like i know how to handle errors
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

  // data processing task:
  // The mapOptions object below has a bunch of info which highchart needs to
  // render the map. We need to get the jsonData we fetched above into the right format so that
  // we can replace the placeholder data in the series array below. States
  // will need to be grouped by color.

  // -------------------------------- Map code below
  //IDK what a lot of these options do yet- just copy/pasted from examples

  const mapOptions = {
    chart: {
      map: mapDataUS,
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
    plotOptions: {
      map: {
        allAreas: false,
        joinBy: ['hc-a2', 'code'],
        dataLabels: {
          enabled: true,
          color: '#FFFFFF',
          style: {
            fontWeight: 'bold',
          },
          // Only show dataLabels for areas with high label rank
          format:
            '{#if (lt point.properties.labelrank 5)}' +
            '{point.properties.hc-a2}' +
            '{/if}',
        },
      },
    },
    // The array below is the same thing as:
    // [
    //   {
    //     name: 'RED',
    //     data: [
    //       { code: 'VA' },
    //       { code: 'NC' }
    //     ]
    //   }
    //   {
    //     name: 'BLUE',
    //     data: [
    //       { code: 'WA' },
    //       { code: 'OR' }
    //     ]
    //   }
    // ]
    series: [
      {
        name: 'RED',
        data: ['VA', 'NC'].map((code) => ({ code })),
      },
      {
        name: 'BLUE',
        data: ['WA', 'OR'].map((code) => ({ code })),
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
        </div>
      )}
    </>
  );
}

export default App;
