import { useState, useEffect } from 'react';
//import './Map.css';
import React from 'react';
import Highcharts, { color } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMap from 'highcharts/modules/map';
import mapDataUS from '@highcharts/map-collection/countries/us/custom/us-small.geo.json';
import mapstyles from './mapstyles.module.css';

import HighchartsAccessibility from 'highcharts/modules/accessibility';

HighchartsAccessibility(Highcharts);

highchartsMap(Highcharts); // Initialize the map module

function Map({ updateSelectedStateInfo }) {
  const [status, setStatus] = useState('idle');
  const [jsonData, setJsonData] = useState();
  const [mapData, setMapData] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [stateInfo, setStateInfo] = useState('');

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
      setJsonData(data);
    } else {
      setStatus('error');
    }
  }

  useEffect(() => {
    console.log('running data fetching');
    fetchItems();
  }, []);

  const parseData = async (data) => {
    const rows = data.table.rows;
    rows.shift(); //removes header row
    const stateLabels = {};

    const colorStates = rows.reduce(
      (accum, { c: [{ v: _stateName }, { v: stateLabel }, { v: color }] }) => {
        const stateAbbrev = stateLabel.slice(0, 2); //idk if the emojis for high
        //danger/sanctuaries are staying but this makes the abbrevs safe to use
        stateLabels[stateAbbrev] = stateLabel;

        if (accum[color]) {
          accum[color].add(stateAbbrev);
        } else {
          accum[color] = new Set([stateAbbrev]);
        }

        return accum;
      },
      {},
    );

    const renamedColors = {
      'Dark Red': 'Worst Active Anti-trans Laws',
      'Light Red': 'Moderate Risk within Two Years',
      Blue: 'Low Risk within Two Years',
      'Dark Blue': 'Safest State with protections',
      Red: 'High Risk within Two Years',
    };

    const renamedColorStates = {};
    for (const color in colorStates) {
      renamedColorStates[renamedColors[color]] = colorStates[color];
    }

    const result = Object.entries(renamedColorStates).map(([color, states]) => {
      return {
        name: color,
        data: Array.from(states).map((code) => ({ code })),
      };
    });
    console.log(result);
    // This code reorders things to that the categories show nicely in the legend
    const desiredOrder = [0, 4, 1, 2, 3];
    const reorderedData = desiredOrder.map((index) => result[index]);
    console.log(reorderedData);
    setMapData(reorderedData);
  };

  const parseStateInfo = async (data) => {
    const rows = data.table.rows;
    const stateInfo = rows.reduce(
      (
        accum,
        { c: [{ v: stateName }, { v: stateLabel }, { v: color }, { v: info }] },
      ) => {
        accum[stateName] = info;
        return accum;
      },
      {},
    );

    setStateInfo(stateInfo);
  };

  //runs when jsonData is ready
  useEffect(() => {
    if (status === 'success') {
      parseData(jsonData);
      parseStateInfo(jsonData);
    }
  }, [jsonData]);

  const mapOptions = {
    chart: {
      map: mapDataUS,
      animation: false,
    },
    colors: [
      'rgba(89, 0, 0, 1)',
      'rgba(217, 40, 40, 1)',
      'rgba(245, 148, 148, 1)',
      'rgba(83, 83, 232, 1)',
      'rgba(12, 12, 132, 1)',
    ],
    title: {
      text: 'Map of US States Showing Risk of Anti-Trans Legislation',
    },
    accessibility: {
      enabled: true,
      series: {
        descriptionFormat: '',
      },
      point: {
        valueDescriptionFormat: '{point.name}',
      },
    },
    credits: {
      enabled: false,
    },
    mapNavigation: {
      enabled: true,
    },
    tooltip: {
      headerFormat: '',
      pointFormat: '{point.name}: <b>{series.name}</b>',
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
            '{#if (lt point.properties.labelrank 10)}' +
            '{point.properties.hc-a2}' +
            '{/if}',
        },
      },

      series: {
        events: {
          legendItemClick: function () {
            return false;
          },
        },
        point: {
          events: {
            click: function () {
              setSelectedState(this.name);
            },
          },
        },
      },
    },
    series: mapData,
  };

  useEffect(() => {
    updateSelectedStateInfo({
      statename: selectedState,
      text: stateInfo[selectedState],
    });
  }, [selectedState]);

  return (
    <div className={mapstyles.mappart}>
      {status === 'loading' && <p>Loading assets...</p>}
      {status === 'error' && (
        <p>We regret to inform you of your grave misdeeds...</p>
      )}
      {status === 'success' && (
        <div>
          <p>
            Click on a state on the map below or choose one from the drop down
            menu to show details about legislative activity.
          </p>
          <HighchartsReact
            constructorType={'mapChart'}
            highcharts={Highcharts}
            options={mapOptions}
          />
        </div>
      )}
    </div>
  );
}

export default Map;
