/* Libraries */
import AsyncStorage from '@react-native-async-storage/async-storage'
import { delayedAlert } from '@hproinformatica/react-native'

/* Environments */
const PARAMS_INFO_KEY = 'PARAMSINFO'

export async function saveParamsInfo(sync: HPro.Params) {
	try {
		await AsyncStorage.setItem(PARAMS_INFO_KEY, JSON.stringify(sync))
	} catch (error) {
		delayedAlert('Erro', error.message)
	}
}

export async function loadParamsInfo() {
	try {
		const paramsInfo = await AsyncStorage.getItem(PARAMS_INFO_KEY)

		if (!paramsInfo) {
			return null
		}

		return JSON.parse(paramsInfo) as HPro.Params

	} catch (error) {
		delayedAlert('Erro', error.message)
	}
}

export async function clearParamsInfo() {
	try {
		await AsyncStorage.removeItem(PARAMS_INFO_KEY)
	} catch (error) {
		delayedAlert('Erro', error.message)
	}
}
