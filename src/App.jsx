import React from 'react';
import Map from './components/Map/Map';
import Info from './components/Info/Info';
import styles from './styles.module.css';

function App() {
  return (
    <section className={styles.main}>
      <h1>Legislation Affecting Trangender People</h1>
      <Map />
      <Info />
    </section>
  );
}

export default App;
