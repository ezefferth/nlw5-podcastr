import { GetStaticProps } from "next";
import { api } from "../services/api";
import { format, parseISO } from 'date-fns'; //formatacao de dadas entre outros
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from "../utils/convertDuration";
import styles from './home.module.scss';
import Image from 'next/image';/* exclusivo ate entao do next
eh uma forma de manipular imagem com otimizacao */
import Link from 'next/link'//mao na roda, para cada troca de página, com link não é precisso todo
import { PlayerContext } from "../context/PlayerContext";
import { useContext } from "react";
import Head from 'next/head'; //cabeçario nextJS titulo
//carregamento novamente


//Ou a typagem poderia ser direto como abaixo
/* type HomeProps = {
  episodes: Array<{
    id: string;
    title: string;
    members: string;
    //...
    }>
} */

//desta forma abaixo fica mais explicito
type Episodes = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string,
  description: string,
  durationFormated: string,
  duration: number,
  url: string


}
//hoemProps é um array que contem episodes
type HomeProps = {
  //episodes: Episodes[];esse aki ja nao precisa mais
  lastedEpisodes: Episodes[];//eh necessario pois no getStaticProps foi buscado
  allEpisodes: Episodes[];//e filtrado separado a listagem dos episodeos
}

//logo lasted e all é do tipo HomeProps.. uma vantagem de utilizar typescript
export default function Home({ lastedEpisodes, allEpisodes }: HomeProps) {

  //recebe context do playerContext
  const { play, playList } = useContext(PlayerContext);

  /* copiar a informação como um todo,  aproveitando as anteriores, imutabilidade*/
  const episodeList = [...lastedEpisodes, ...allEpisodes];




  return (
    <div className={styles.homePage}>
      <Head>{/* é o titulo da pagina da aba, outra dica do next*/}
        <title>Home | Podcastr</title>{/* pode ser por qlq tag */}
      </Head>
      {/* aki vem 2 secoes, ultimos episodeios e todos episodeos */}
      <section className={styles.lastedEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {lastedEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>{/* importante por a key para que o react entenda corretamente
              qual eh o elemento que ele esta renderizando, pois em alguma chamada ele for alterar
              ele nao sofra em ter que retirar/alterar sem ter que remover tudo e renderizar novamente */}
                {/* // 192px eh o tamanho que o Image vai carregar, sem a necessidade de utilziar a img como um todo */}
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit='cover'/*cobre o espaço da imagem sem distorcer  */
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a >{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationFormated}</span>
                </div>
                {/*  desta forma, ele pega o episode e o index com a referencia da lista completa da home*/}
                <button type='button' onClick={() => playList(episodeList, index)}>
                  <img src='/play-green.svg' alt='Tocar Episódio' />
                </button>
              </li>
            )
          })}
        </ul>
      </section >


      <section className={styles.allEpisodes}>
        <h2>Todos eposódios</h2>

        <table cellSpacing={0} >
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Duração</th>
            </tr>

          </thead>
          <tbody>
            {
              allEpisodes.map((episode, index) => {
                return (
                  <tr key={episode.id}>
                    <td style={{ width: 75 }}>
                      <Image
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit='cover'
                      />
                    </td>
                    <td>
                      <Link href={`/episodes/${episode.id}`}>
                        <a >{episode.title}</a>
                      </Link>

                    </td>
                    <td>
                      {episode.members}
                    </td>
                    <td style={{ width: 100 }}> {/* havia de estar quebrando linha, entao foi colocado o style para aumentar o tam */}
                      {episode.publishedAt}
                    </td>
                    <td>
                      {episode.durationFormated}
                    </td>
                    <td>{/* lastedEpisodes.length e devido q o primeiro index eh 0, logo para pegar outro item
                    o index deve ser aql que ele clicar */}
                      <button onClick={() => playList(episodeList, index + lastedEpisodes.length)}>
                        <img src='/play-green.svg' alt='Tocar eposódio' />
                      </button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>

      </section>
    </div>

  )
}


//GetStaticProps é uma forma de typagem da função como um todo,
//formato da função etc...
export const getStaticProps: GetStaticProps = async () => {

  const response = await api.get('episodes', {
    /*com axios é possivel escrever os parametros como objeto de configuracoes em formato JS*/
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
    /*ou seja, poderia ser direto na url mas com axios é possivel setar antes
    os parametros, onde se mantem uma sintaxe mais limpa e mais facil de entender
    oque é feito
     */
  });
  const data = await response.data;
  // é possivel fazer uma desestruturação direto
  //const {data} = await api.get('episodes?_limit=12&_sort=published+at&_order=desc');


  /* Uma dica de dev para dev, realizar a formatação dos dados  antes de ser passado para o 
  componente de renderização, pois se for  formatar os dados dentro do return,
  isso sera feito a cada renderizacao do componente, isso trará 
  uma queda de desempenho, ou seja, faça-o antes */
  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      members: episode.members,
      duration: Number(episode.file.duration),
      description: episode.description,
      durationFormated: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,

    }
  })
  /* continuando sobre performance, aki abaixo sera buscada ja os dois ultimos  episodeos
  para ser usado no return*/
  const lastedEpisodes = episodes.slice(0, 2);//2 episiodes
  const allEpisodes = episodes.slice(2, episodes.lenght);//do segundo em diante


  return {
    props: {
      episodes,
      lastedEpisodes,
      allEpisodes
    },
    /* revalidate é em quanto em quanto tempo será feito uma nova busca no servidor
    dos dados buscados, um dos motivos de usar o staticProps, pois não será
    necessario realizar a busca//update dos dados a cada acesso da pagina
    */
    revalidate: 60 * 60 * 8,
  }

}