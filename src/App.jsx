import React from 'react';
import { useState, useEffect } from 'react';

import Map from './components/Map/Map';
import Info from './components/Info/Info';
import styles from './styles.module.css';

function App() {
  const [status, setStatus] = useState('idle');
  const [selectedStateInfo, setSelectedStateInfo] = useState(
    'This is the default info that will show',
  );

  const updateSelectedStateInfo = (newValue) => {
    setSelectedStateInfo(newValue);
  };

  useEffect(() => {
    console.log(selectedStateInfo);
  }, [selectedStateInfo]);

  return (
    <section className={styles.main}>
      <h1>Legislation Affecting Trangender People</h1>
      <Map updateSelectedStateInfo={updateSelectedStateInfo} />
      <Info selectedStateInfo={selectedStateInfo} />
    </section>
  );
}

export default App;
