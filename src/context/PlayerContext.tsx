/* context, importante para que toda aplicação possa ter acesso a este componente */

import { createContext, useState, ReactNode, useContext } from "react";


//typagem paga o contex dos players,
//contendo dados dos podcastrs anteriores, proximo e etc
type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;//se esta tocando
    togglePlay: () => void; //uma funcao sem parametro que nao retorna nada
    setPlayingState: (state: boolean) => void //state que eh um boolean
    play: (episode: Episode) => void; //play eh uma funcao q recebe episode do tipo
    //Episode que retorna nada!
    playList: (list: Episode[], index: number) => void;
    playNext: () => void;//nao recebe parametro e retorno e vazio void
    playPrevious: () => void;
    hasNext: boolean;
    hasPrevious: boolean;
    isLooping: boolean;
    toggleLoop: () => void;//da msm forma que togglePlay
    isShuffling: boolean;
    toggleShuffle: () => void;
    clearPlayerState: () => void;
};

//as a PlayerContexData define o tipo de como o objeto será
//devido a typagem mencionada 
export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    /* ReactNode, vem de dentro do proprio react feita para isso quando nao se sabe
    o conteudo que tem ou que pode ter, qualquer coisa que react aceitaria como conteudo JSX*/
    children: ReactNode;
}

export function PlayerContexProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);//play
    const [isLooping, setIsLooping] = useState(false);//loop
    const [isShuffling, setIsShuffling] = useState(false);//shuffle

    function play(episode: Episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }
    //para a lista de EP
    function playList(list: Episode[], index: number) { //array de EP e o indice do EP
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    /* ------------------------------------ */
    /* bem intuitico essa parte
    onde no next se o index for menor maior que o length ele nao deve ir para 
    o proximo, ou seja se for menor ai sim que ele incrementa e troca de faixa
    
    
    no previus parte da mesma ideia, se o current for igual a 0 nao tem por que ele 
    voltar se ele eh o primeiro, isso seria possivel se fosse uma lista encadeada
    */

    //dar clear no player qnd tudo acabar
    function clearPlayerState() {
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }

    const hasPrevious = currentEpisodeIndex > 0;

    //hasNext eh aleatorio ou propriamente dito next, para que funcione no tocar random
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;


    function playNext() {
        //const nextEpisodeIndex = currentEpisodeIndex + 1;

        /*  isShoffling for true quer dizer que eh para ser aleatorio, logo*/
        if (isShuffling) {
            /* math.floor aredonda o valor para inteiro, 
            e o math.random pega o numero aleatorio do tamanho max da lista */
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        }
        else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }

    }
    function playPrevious() {
        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        }
    }
    /* ------------------------------------------------------ */

    function togglePlay() {
        setIsPlaying(!isPlaying);//valor da variavel pelo contrario dela
    }
    function toggleLoop() {
        setIsLooping(!isLooping);//valor da variavel pelo contrario dela
    }
    function toggleShuffle() {
        setIsShuffling(!isShuffling);//valor da variavel pelo contrario dela
    }
    //quando ocorrer alguma alteração no audio, ele vai disparar diretamente aki
    // pois quando da pause /plau pelo click o btn altera, mas quando eh pelo teclado
    //ele nao altera, por isso desta funcao passando o stado do playing dentro do Player
    function setPlayingState(state: boolean) {
        setIsPlaying(state);
    }

    return (
        <PlayerContext.Provider
            value={{
                episodeList,
                currentEpisodeIndex,
                play,
                isPlaying,
                togglePlay,
                setPlayingState,
                playList,
                playNext,
                playPrevious,
                hasNext,
                hasPrevious,
                toggleLoop,
                isLooping,
                isShuffling,
                toggleShuffle,
                clearPlayerState,
            }}
        >
            {children}

        </PlayerContext.Provider>
    )
}

/* é possivel importar diretamente o useContext(PlayerContext) 
para que em cada chamada nao precise escrever tudo novamente, e entao
no import dar o import somente da const conforme abaixo
*/

export const usePlayer = () => {
    return useContext(PlayerContext);
}
//deixa mais semantico esse repasse
//neste caso nao usarei muito isso, mas para um trabalho muito grande
//pode ser e deve ser indicado isso;