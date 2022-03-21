import { useContext, useEffect, useRef } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import styles from './styles.module.scss';
import Image from 'next/image';
import Slider from 'rc-slider'; //slider do timing do podcast 
import 'rc-slider/assets/index.css';//css do rc Slider

export function Player() {

  /* sera usada para referencia do audio */
  /* dentro da tag < > esta falando que ali vai ter um elemento do tipo audio */
  const audioRef = useRef<HTMLAudioElement>(null);

  const { 
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    setPlayingState,
    playNext,
    playPrevious

  } = useContext(PlayerContext);

  const episode = episodeList[currentEpisodeIndex];


  useEffect(() => {
    /* se audio ref nao tiver nada ele retorna pois nao tem referencia ao player*/
    if(!audioRef.current){
      return
    }
    /*  se passar eh pq tem a referencia
    e se is playing for true ele da play
    se nao ele pausa*/
    if(isPlaying){
      audioRef.current.play();
    }
    else{
      audioRef.current.pause();
    }

  }, [isPlaying])

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src='/playing.svg' alt='Tocando agora' />
        {/* o operador ? verifica de tem algum valor para ai entao executar */}
        <strong>Tocando agora {episode?.title}</strong>
      </header>


      {/* esta parte eh importante, ter esta condicional na renderização, pois
      se tiver alguma coisa em episiodeo ele renderiza, se nao renderiza outra coisa*/}
      {/* episode ? () : () */}
      {episode ? (
        <div className={styles.currentPlayer}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit='cover'
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}


      {/* detalhe no footer é se tiver episodio vazio ele nao tiver vazio ele passa
      o class name, se nao ele passa vazio*/}
      <footer className={!episode ? styles.emptyFooter : ''}>
        <div className={styles.progress}>
          <span>00:00</span>

          <div className={styles.slider}>
            {/* outra condicional do slider, se tiver vazio, se nao */}
            {episode ? (
              <Slider
                trackStyle={{ backgroundColor: '#04d361' }}//cor do slider
                railStyle={{ backgroundColor: '#9f75ff' }}//cor barrabarra vazia
                handleStyle={{ borderColor: '#04d361', borderWidth: 3.4 }}//cor borda da bolinha
              />
            ) : (
              /* slider vazio da parra de progresso */
              <div className={styles.emptySlider} />
            )}
          </div>

          <span>00:00</span>
        </div>{/* disabled={!episode} se nao tem episodio pq habilitar os botoes */}

        {/* so vai executar se episodio for verdadeiro(existir) */}
        {episode && (
          <audio
            src={episode.url}
            autoPlay
            ref={audioRef}
            /* a funcao criada antes onde qnd o pause e mudado pelo teeclado/click
            ele altera o valor de isPlaying, logo ele pausa/ troca o icone do play */
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
          />
        )}


        <div className={styles.buttons}>
          <button type='button' disabled={!episode}>
            <img src='/shuffle.svg' alt='Embaralhar' />
          </button>

          <button type='button' disabled={!episode} onClick={playPrevious}>
            <img src='/play-previous.svg' alt='Tocar Anterior' />
          </button>


          <button type='button'
            className={styles.playButton}
            disabled={!episode}
            onClick={() => togglePlay()}
          >
            {isPlaying ? (
              <img src='/pause.svg' alt='Tocar ' />
            ) :
              (
                <img src='/play.svg' alt='Tocar ' />
              )
            }

          </button>

          <button type='button' disabled={!episode} onClick={playNext}>
            <img src='/play-next.svg' alt='Tocar Próxima' />
          </button>

          <button type='button' disabled={!episode}>
            <img src='/repeat.svg' alt='Repetir' />
          </button>
        </div>
      </footer>
    </div>
  );
}
