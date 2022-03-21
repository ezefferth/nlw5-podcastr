import '../styles/global.scss';
import styles from '../styles/app.module.scss';

import { Header } from '../components/Header';
import { Player } from '../components/Player';
import { PlayerContexProvider } from '../context/PlayerContext';
import { useState } from 'react';



function MyApp({ Component, pageProps }) {



  return (//alem de passar episodeList, e currentEpisode Index, eh passado a 
    //                                        funcao play para o contexto
    <PlayerContexProvider >
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContexProvider>
  )
}

export default MyApp
