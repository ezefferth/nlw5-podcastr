import { useContext, useEffect, useRef, useState } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import styles from './styles.module.scss';
import Image from 'next/image';
import Slider from 'rc-slider'; //slider do timing do podcast 
import 'rc-slider/assets/index.css';//css do rc Slider
import { convertDurationToTimeString } from '../../utils/convertDuration';

export function Player() {

  /* sera usada para referencia do audio */
  /* dentro da tag < > esta falando que ali vai ter um elemento do tipo audio */
  const audioRef = useRef<HTMLAudioElement>(null);

  const [progress, setProgress] = useState(0);//armazenara o tempo do progresso

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    isLooping,
    toggleLoop,
    isShuffling,
    toggleShuffle,
    clearPlayerState

  } = useContext(PlayerContext);

  const episode = episodeList[currentEpisodeIndex];


  useEffect(() => {
    /* se audio ref nao tiver nada ele retorna pois nao tem referencia ao player*/
    if (!audioRef.current) {
      return
    }
    /*  se passar eh pq tem a referencia
    e se is playing for true ele da play
    se nao ele pausa*/
    if (isPlaying) {
      audioRef.current.play();
    }
    else {
      audioRef.current.pause();
    }

  }, [isPlaying])


  /* funcao que ao dispara o episodio do audio */
  function setupProgress() {
    /*  audioRef.current.currentTime = 0; sempre que carregar o 
    audio novamente ele volta para estaca zero */
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));//math.floor para arredondar
    }); //ouvir um evento, ou seja retornar o tempo atual

  }

  /* handleseek recebe o valor que foi alterado la do progresso e
  passa para referencia do audioRef qual que deve ser o valor para
  que ele possa tocar, nessa alteracao */
  function handleSeek(amount: number){

    audioRef.current.currentTime = amount;

    setProgress(amount);
  }


  /* se tiver proxima ele avança, se nao ele limpa o estado */
  function handleEnded(){
    if(hasNext){
      playNext();
    }
    else{
      clearPlayerState();
    }
  }

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
          {/* lembra da funcao convertDurationToTimeString? ela ira converter o number
          em string de tempo, e nesse caso o do progresso*/}
          <span>{convertDurationToTimeString(progress)}</span>

          <div className={styles.slider}>
            {/* outra condicional do slider, se tiver vazio, se nao */}
            {episode ? (
              /* SLIDER */
              <Slider
                max={episode.duration}//maximo do tamanho do slider
                value={progress}//incremento do progresso do slider
                onChange={handleSeek} //funcao que ao alterar o progresso, deva-se... 
                //...alterar tambem o progresso do podcastr
                trackStyle={{ backgroundColor: '#04d361' }}//cor do slider
                railStyle={{ backgroundColor: '#9f75ff' }}//cor barrabarra vazia
                handleStyle={{ borderColor: '#04d361', borderWidth: 3.4 }}//cor borda da bolinha
              />
            ) : (
              /* slider vazio da parra de progresso */
              <div className={styles.emptySlider} />
            )}
          </div>
          {/* converte a propriedade em string da funcao que criamos anteriormente
           e, nao menos importante o episode?, onde ele verifica se existe alguma coisa em
           episode, e se existir ele verifica duration para que nao dê erro 
           e o '??' seria para mostrar 0 caso nao tenha nenhum episodio*/}
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>{/* disabled={!episode} se nao tem episodio pq habilitar os botoes */}

        {/* so vai executar se episodio for verdadeiro(existir) */}
        {episode && (
          /* AUDIO */
          <audio
            src={episode.url}
            autoPlay
            loop={isLooping}
            ref={audioRef}
            /* a funcao criada antes onde qnd o pause e mudado pelo teeclado/click
            ele altera o valor de isPlaying, logo ele pausa/ troca o icone do play */
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            /* loadedMetadata dispara assim que o player 
            conseguir carregar os dados o episodio */
            onLoadedMetadata={setupProgress}

            onEnded={handleEnded}
          />
        )}


        <div className={styles.buttons}>
          <button
            type='button'
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}

          >
            <img src='/shuffle.svg' alt='Embaralhar' />
          </button>
          {/* disable se nao tem ep ou se nao tem o proximo */}
          <button type='button' disabled={!episode || !hasPrevious} onClick={playPrevious}>
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
          {/* disable se nao tem ep ou se nao tem o proximo */}
          <button type='button' disabled={!episode || !hasNext} onClick={playNext}>
            <img src='/play-next.svg' alt='Tocar Próxima' />
          </button>

          <button
            type='button'
            disabled={!episode}
            onClick={toggleLoop}/* se looping estiver ativo, se nao ele eh vazio */
            className={isLooping ? styles.isActive : ''}
          >
            <img src='/repeat.svg' alt='Repetir' />
          </button>
        </div>
      </footer>
    </div>
  );
}
