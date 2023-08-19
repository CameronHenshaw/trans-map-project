import React from 'react';
import { useState, useEffect } from 'react';

import Map from './components/Map/Map';
import Info from './components/Info/Info';
import styles from './styles.module.css';

function App() {
  const [status, setStatus] = useState('idle');
  const [selectedStateInfo, setSelectedStateInfo] = useState({
    statename: 'default',
    text: 'Choose a state to learn more.',
  });

  const updateSelectedStateInfo = (newValue) => {
    setSelectedStateInfo(newValue);
  };

  useEffect(() => {
    // This will update the state after the component has mounted,
    // causing a re-render with the default value.
    setSelectedStateInfo({
      statename: 'default',
      text: 'Choose a state to learn more.',
    });
  }, []);

  return (
    <section className={styles.main}>
      <h1>Legislation Affecting Transgender People</h1>
      <Map updateSelectedStateInfo={updateSelectedStateInfo} />
      <Info selectedStateInfo={selectedStateInfo} />
    </section>
  );
}

export default App;
