/* Libraries */
import AsyncStorage from '@react-native-async-storage/async-storage'
import { delayedAlert } from '@hproinformatica/react-native'

/* Environments */
const SYNC_INFO_KEY = 'SYNCINFO'

export async function saveSyncInfo(sync: HPro.Sync) {
	try {
		await AsyncStorage.setItem(SYNC_INFO_KEY, JSON.stringify(sync))
	} catch (error) {
		delayedAlert('Erro', error.message)
	}
}

export async function loadSyncInfo() {
	try {
		const syncInfo = await AsyncStorage.getItem(SYNC_INFO_KEY)

		if (!syncInfo) {
			return null
		}

		return JSON.parse(syncInfo) as HPro.Sync

	} catch (error) {
		delayedAlert('Erro', error.message)
	}
}

export async function clearSyncInfo() {
	try {
		await AsyncStorage.removeItem(SYNC_INFO_KEY)
	} catch (error) {
		delayedAlert('Erro', error.message)
	}
}
