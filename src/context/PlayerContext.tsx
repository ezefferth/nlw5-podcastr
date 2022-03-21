/* context, importante para que toda aplicação possa ter acesso a este componente */

import { createContext, useState, ReactNode } from "react";


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
    const [isPlaying, setIsPlaying] = useState(false);

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
    function playNext() {

        const nextEpisodeIndex = currentEpisodeIndex + 1;

        if (nextEpisodeIndex < episodeList.length) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }
    }
    function playPrevious() {
        if (currentEpisodeIndex > 0) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        }
    }
    /* -------------------------------------------- */

    function togglePlay() {
        setIsPlaying(!isPlaying);//valor da variavel pelo contrario dela
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
            }}
        >
            {children}

        </PlayerContext.Provider>
    )

}

