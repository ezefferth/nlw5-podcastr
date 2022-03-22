//[slug] utilizado para receber os parametros qnd chamado
//ou seja os dados de cada podcast para o titulo

import { GetStaticProps, GetStaticPaths } from "next";
import Image from 'next/image';
import { api } from '../../services/api';
import { format, parseISO } from 'date-fns'; //formatacao de dadas entre outros
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from "../../utils/convertDuration";
import { useRouter } from "next/router";//funcao
import styles from './episodes.module.scss';
import Link from 'next/link';
import { useContext } from "react";
import { PlayerContext } from "../../context/PlayerContext";
import Head from "next/head";


type Episode = {
	id: string;
	title: string;
	members: string;
	publishedAt: string;
	thumbnail: string,
	description: string,
	durationFormated: string,
	duration: number,
	url: string
}//semelhantemente ao home, realizar as typagens
type EpisodeProps = {
	episode: Episode
}


export default function Episode({ episode }: EpisodeProps) {

	const { play } = useContext(PlayerContext);

	//----------------------------
	/* se a router estiver em carregamento "dos dados digamos assim
	aguardando o getStaticProps buscar os dados"
	
	se fallback: true, entao deve deixar isso abaixo,
	se nao tiver isso vai dar erro pois nao há dados para que a pagina 
	posa usar para rendericacao 																		*/
	/* const router = useRouter();

	if (router.isFallback) {
		return <p>Carregando...</p>
	} */
	//----------------------------


	return (

		<div className={styles.episode}>
			<Head>{/* é o titulo da pagina da aba, outra dica do next*/}
				<title>{episode.title}</title>
			</Head>
			<div className={styles.thumbnailContainer}>
				<Link href='/'>
					<button type="button">
						<img src="/arrow-left.svg" alt="Voltar" />
					</button>
				</Link>

				<Image
					width={700}
					height={160}
					src={episode.thumbnail}
					objectFit='cover'
				/>
				<button type='button' onClick={() => play(episode)}>
					<img src="/play.svg" alt='Tocar episódio' />
				</button>
			</div>


			<header>
				<h1>{episode.title}</h1>
				<span>{episode.members}</span>
				<span>{episode.durationFormated}</span>
			</header>

			{/* <div className={styles.description}> desta forma ele apareceria na tela
				{episode.description} dados com termos em html, e para isso nao ocorrer, deve injetar
			</div>  html digamos assim, converter o texto em estrutura html
			*/}
			<div className={styles.description}
				dangerouslySetInnerHTML={{
					__html: episode.description
				}} />

		</div>
	)
}

//GetStaticPaths para paginas estaticas que podem ser dinamicas
export const getStaticPaths: GetStaticPaths = async () => {

	/* É indicado aki, fazer a busca no banco dos dados mais acessados,
	ou oque vc mais vai precisar mostrar nas paginas do site como um todo
	e depois passa-los pelo paths, como no exemplo abaixo:
	
	*/

	//busca o dado
	const { data } = await api.get('episodes', {
		params: {//nesse caso buscou os 2 primeiros episodios para poder
			_limit: 2,//estar gerando de forma estatica os 2 primeiros ep
			_sort: 'published_at',
			_order: 'desc'
		}
	});

	//passa cada episodio para o paths
	const paths = data.map(episodes => {
		return {
			params: {
				slug: episodes.id
			}
		}
	});

	//return recebe o paths e o tipo do fallback
	return {
		paths,
		fallback: 'blocking'
		/*  

		paths: [] o next na hora da build nao gera nenhuma pagina
		de forma estática. o fallback que determina o comportamento 
		quando uma pessoa acessa a uma pagina de um epodio que nao foi
		gerado estaticamente
		
		se fallback: false => ira aparecer o error 404, nao encontrado
		
		fallback: true  => ele ira tentar buscar os dados do staticprops
		do novo episodio, e salvar em disco para gerar uma pagina statica,
		Faz com que a requisicao da busca dos dados seja feita na parte do 
		Cliente, lado do browser. Quando for true, ele demoraria para carregar
		os dados da StaticProps, e isso afetaria a renderizacao da pagina
		estatica, entao deva-se colocar um useRouter from next/router e colocar 
		uma condicao antes de tudo no componente.

		fallback: true roda no client, e 'blocking' no node.js

		fallback: 'blocking' => vai rodar a requisição na camada node.js
		a pessoa so vai carregar a tela quando os dados estiverem sidos 
		carregados, e como melhor forma de indexação é o mais indicado
		
		*/
	}
}


export const getStaticProps: GetStaticProps = async (ctx) => { //ctx = context

	const { slug } = ctx.params;

	const { data } = await api.get(`/episodes/${slug}`);

	const episode = {
		id: data.id,
		title: data.title,
		thumbnail: data.thumbnail,
		publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
		members: data.members,
		duration: Number(data.file.duration),
		description: data.description,
		durationFormated: convertDurationToTimeString(Number(data.file.duration)),
		url: data.file.url,

	};

	return {
		props: {
			episode
		},
		revalidate: 60 * 60 * 8 //60s * 60 = 1hora
		//revalidate eh o intervalo da busca dos props
	}
}