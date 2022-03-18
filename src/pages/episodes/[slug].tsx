//[slug] utilizado para receber os parametros qnd chamado
//ou seja os dados de cada podcast para o titulo

import { GetStaticProps, GetStaticPaths } from "next";
import Image from 'next/image';
import { api } from '../../services/api';
import { format, parseISO } from 'date-fns'; //formatacao de dadas entre outros
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from "../../utils/convertDuration";
/* import { useRouter } from "next/router" */
import styles from './episodes.module.scss';

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

	return (

		<div className={styles.episode}>
			<div className={styles.thumbnailContainer}>
				<button type="button">
					<img src="/arrow-left.svg" alt="Voltar" />

				</button>
				<Image
					width={700}
					height={160}
					src={episode.thumbnail}
					objectFit='cover'
				/>
				<button type='button'>
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
//devido
export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: [],
		fallback: 'blocking'
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
	}
}