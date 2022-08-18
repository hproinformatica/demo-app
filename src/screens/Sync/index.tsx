import { DrawerActions } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Dimensions } from 'react-native'
import { Appbar, useTheme, TouchableRipple, Dialog, Button } from 'react-native-paper'
import AppStorage from '../../storage/AppStorage'
import { delayedAlert, Loader } from '@hproinformatica/react-native'
import HPro from '../../@types'
import { syncApp } from '../../sync'

const Sync = ({ navigation }: HPro.Props<HPro.AppDrawer, 'SyncStack'>) => {

	const { colors } = useTheme()
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			height: Dimensions.get('window').height - 80,
		},
		itemContainer: {
			padding: 16,
		},
		settingsItem: {
			fontSize: 16,
		},
		syncInfo: {
			marginTop: 4,
			fontSize: 12,
			color: 'rgba(0, 0, 0, 0.60)',
		}
	})

	const [loading, setLoading] = useState<boolean>(false)
	const [visible, setVisible] = useState<boolean>(false)
	const [syncInfo, setSyncInfo] = useState<HPro.Sync>()

	const _refresh = async () => {
		await AppStorage.loadSyncInfo()
			.then((sync) => {
				setSyncInfo(sync)
			})
	}

	useEffect(() => {
		const refresh = navigation.addListener('focus', () => {
			_refresh()
		})
		return refresh
	}, [navigation])

	const syncronize = async () => {
		setVisible(false)

		await syncApp({ setLoading, _refresh })
	}

	const ConfirmDialog = () => {
		return (
			<Dialog visible={visible} onDismiss={() => setVisible(false)}>
				<Dialog.Title>Atenção</Dialog.Title>
				<Dialog.Content>
					<Text>Deseja realmente sincronizar a base de dados?</Text>
				</Dialog.Content>
				<Dialog.Actions>
					<Button onPress={() => syncronize()}>Sim</Button>
					<Button onPress={() => setVisible(false)}>Não</Button>
				</Dialog.Actions>
			</Dialog>
		)
	}

	return (
		<>
			<Appbar.Header>
				<Appbar.Action
					color={colors.accent}
					icon={'view-headline'}
					onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
				<Appbar.Content
					color={colors.accent}
					title="Configurações" />
			</Appbar.Header>
			<Loader.Circle visible={loading} />
			<View style={styles.container}>
				<TouchableRipple style={styles.itemContainer} onPress={() => setVisible(true)}>
					<View>
						<Text style={styles.settingsItem}>Sincronizar base de dados</Text>
						<Text style={styles.syncInfo}>
							Última sincronização: {syncInfo ? `${syncInfo.dat} às ${syncInfo.hor}.` : 'aplicativo não sincronizado.'}
						</Text>
					</View>
				</TouchableRipple>
			</View>
			<ConfirmDialog />
		</>
	)
}

export default Sync
