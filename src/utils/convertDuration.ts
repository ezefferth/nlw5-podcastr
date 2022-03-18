//esta funcao converte o tempo em minutos


export function convertDurationToTimeString(duration: number) {
	const hours = Math.floor(duration / 3600); //(60 * 60)
	//Math.floor arredonda para baixo o numero


	const minutes = Math.floor((duration % 3600) / 60); //o resto da divisao, dividido por 60
	//eo resto da divisao eh os minutos

	const seconds = duration % 60;


	const result = [hours, minutes, seconds].map(unit =>
		String(unit).padStart(2, '0')	//padStart preenche com zero sempre que estiver fazio
	).join(':');	//para sempre ter 2 digitos

	//com esse join junta as strings com o ':'

	return result;
}