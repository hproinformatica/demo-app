import { formatCurrency } from '@hproinformatica/functions'
import { backendRequest, delayedAlert, Loader } from '@hproinformatica/react-native'
import { DrawerActions } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import { Appbar, Card, Searchbar, useTheme, Button, Dialog } from 'react-native-paper'
import { transform } from '@hproinformatica/functions'
import AppStorage from '../../storage/AppStorage'

const Liberation = ({ navigation }: HPro.Props<HPro.LiberationStack, 'Liberation'>) => {

	const { colors } = useTheme()
	const styles = StyleSheet.create({
		container: {
			paddingTop: 8,
			paddingBottom: 8,
			paddingRight: 16,
		},
		salesNumber: {
			fontSize: 16,
			fontWeight: '500',
		},
		clientName: {
			color: 'rgba(0, 0, 0, 0.60)',
			fontSize: 14,
		},
		valueText: {
			fontSize: 18,
			fontWeight: '100',
			marginRight: 10,
		},
	})

	const [loader, setLoader] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(false)
	const [visible, setVisible] = useState<boolean>(false)
	const [libPev, setLibPev] = useState<string>('')
	const [search, setSearch] = useState<string>('')
	const [list, setList] = useState<HPro.salesType[]>([])
	const [filtered, setFiltered] = useState<HPro.salesType[]>([])

	useEffect(() => {
		_refresh()
	}, [])

	const _refresh = async () => {
		setLoading(true)
		await AppStorage.loadUserInfo()
			.then(async (user) => {
				await backendRequest('liberation', { cod: user.cod, emp: user.empcod })
					.then((content) => {
						setSearch('')
						setList(content.hpev)
						setFiltered(content.hpev)
					})
			})
			.catch((error) => delayedAlert('Atenção', error.message))
			.finally(() => setLoading(false))
	}

	const _onSearchbarChangeText = (text) => {
		setSearch(text)

		const newList = list.filter((item) => {
			const upperCaseText = text.toUpperCase()

			if (item.num.toString().includes(upperCaseText)) { return true }
			if (item.cliraz.toUpperCase().includes(upperCaseText)) { return true }
			if (item.venraz.toUpperCase().includes(upperCaseText)) { return true }

			return false
		})

		setFiltered(newList)
	}

	const liberatePev = async () => {
		setLoader(true)
		await AppStorage.loadUserInfo()
			.then(async (user) => {
				await backendRequest('liberate', { num: libPev, usr: user.nom, emp: user.empcod })
					.then(() => {
						_refresh()
					})
			})
			.catch((error) => delayedAlert('Atenção', error.message))
			.finally(() => {
				setVisible(false)
				setLoader(false)
			})
	}

	const ConfirmDialog = () => {
		return (
			<Dialog visible={visible} onDismiss={() => setVisible(false)}>
				<Dialog.Title>Atenção</Dialog.Title>
				<Dialog.Content>
					<Text>Deseja realmente liberar o pedido?</Text>
				</Dialog.Content>
				<Dialog.Actions>
					<Button onPress={() => liberatePev()}>Sim</Button>
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
					title="Liberação das vendas" />
			</Appbar.Header>
			<Loader.Circle visible={loader} />
			<View style={{ flex: 1 }} >
				<Searchbar
					onChangeText={text => _onSearchbarChangeText(text)}
					placeholder={'Buscar'}
					placeholderTextColor={colors.text}
					style={{
						margin: 4,
						backgroundColor: colors.background
					}}
					value={search}
				/>
				<FlatList
					data={filtered.sort((a, b) => a.num.localeCompare(b.num))}
					//ItemSeparatorComponent={() => <Divider />}
					ListFooterComponent={() => <View style={{ height: 30 }} />}
					keyExtractor={(item) => item.num}
					refreshControl={<RefreshControl
						progressBackgroundColor={colors.primary}
						colors={['#fff']}
						refreshing={loading}
						onRefresh={_refresh}
					/>}
					renderItem={({ item }) =>
						<Card
							style={{ padding: 8, margin: 5, backgroundColor: item.ori === 'Internet' ? '#def7da' : 'white' }}
							onPress={() => navigation.navigate('SalesDetail', item)}
						>
							<Card.Title
								title={`${transform(item.num, 'XX/######')}`}
								titleStyle={styles.salesNumber}
								subtitle={
									<>
										<Text style={styles.clientName}>{item.dat} - {item.hor} {'\n'}</Text>
										<Text style={styles.clientName}>Cliente: {item.cliraz} {'\n'}</Text>
										<Text style={styles.clientName}>Vendedor: {item.venraz}</Text>
									</>
								}
								subtitleNumberOfLines={5}
								right={(props) =>
									<Text style={styles.valueText}>{formatCurrency(item.tot)}</Text>
								}
							/>
							<Card.Actions>
								<Button onPress={() => {
									setLibPev(item.num)
									setVisible(true)
								}}>Liberar</Button>
							</Card.Actions>
						</Card>
					}
				/>
				<ConfirmDialog />
			</View>
		</>
	)
}

export default Liberation
