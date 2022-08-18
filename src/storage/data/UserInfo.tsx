/* Libraries */
import AsyncStorage from '@react-native-async-storage/async-storage'
import { delayedAlert } from '@hproinformatica/react-native'

/* Environments */
const USER_INFO_KEY = 'USERINFO'

export async function saveUserInfo(user: HPro.User) {
	try {
		await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(user))
	} catch (error) {
		delayedAlert('Erro', error.message);
	}
}

export async function loadUserInfo() {
	try {
		const userInfo = await AsyncStorage.getItem(USER_INFO_KEY)

		if (!userInfo) {
			return null
		}

		return JSON.parse(userInfo) as HPro.User

	} catch (error) {
		delayedAlert('Erro', error.message)
	}
}

export async function clearUserInfo() {
	try {
		await AsyncStorage.removeItem(USER_INFO_KEY)
	} catch (error) {
		delayedAlert('Erro', error.message)
	}
}
