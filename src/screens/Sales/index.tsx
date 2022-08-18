import { formatCurrency } from '@hproinformatica/functions'
import { executeSqlAsync, transactionAsync } from '@hproinformatica/react-native'
import { DrawerActions } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import { Appbar, Card, Divider, Searchbar, TouchableRipple, useTheme, FAB, Button, Dialog } from 'react-native-paper'
import { transform } from '@hproinformatica/functions'

const Sales = ({ navigation }: HPro.Props<HPro.SalesStack, 'Sales'>) => {

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
		fab: {
			position: 'absolute',
			right: 16,
			bottom: 32,
			backgroundColor: colors.primary,
		},
	})

	const [loading, setLoading] = useState<boolean>(false)
	const [visible, setVisible] = useState<boolean>(false)
	const [delPev, setDelPev] = useState<string>('')
	const [search, setSearch] = useState<string>('')
	const [list, setList] = useState<HPro.salesType[]>([])
	const [filtered, setFiltered] = useState<HPro.salesType[]>([])

	useEffect(() => {
		const refresh = navigation.addListener('focus', () => {
			_refresh()
		})
		return refresh
	}, [navigation])

	const _refresh = () => {
		setLoading(true)
		executeSqlAsync('select hcli.raz as cliraz, hpev.* from hpev inner join hcli on (hpev.cli = hcli.cod)')
			.then(({ rows }) => {
				setSearch('')
				setList(rows._array)
				setFiltered(rows._array)
			})
			.finally(() => setLoading(false))
	}

	const _onSearchbarChangeText = (text) => {
		setSearch(text)

		const newList = list.filter((item) => {
			const upperCaseText = text.toUpperCase()

			if (item.num.toString().includes(upperCaseText)) { return true }
			if (item.cliraz.toUpperCase().includes(upperCaseText)) { return true }

			return false
		})

		setFiltered(newList)
	}

	const AddPev = () => {
		navigation.navigate('SalesDetail')
	}

	const deletePev = async () => {
		await transactionAsync(transaction => {
			transaction.executeSql('delete from hpev where num=?', [delPev])
			transaction.executeSql('delete from hive where num=?', [delPev])
		}).then(() => {
			_refresh()
			setVisible(false)
		})
	}

	const ConfirmDialog = () => {
		return (
			<Dialog visible={visible} onDismiss={() => setVisible(false)}>
				<Dialog.Title>Atenção</Dialog.Title>
				<Dialog.Content>
					<Text>Deseja realmente excluir o pedido?</Text>
				</Dialog.Content>
				<Dialog.Actions>
					<Button onPress={() => deletePev()}>Sim</Button>
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
					title="Pedidos de venda" />
			</Appbar.Header>
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
					keyExtractor={(item) => item.num}
					ListFooterComponent={() => <View style={{ height: 80 }} />}
					refreshControl={<RefreshControl
						progressBackgroundColor={colors.primary}
						colors={['#fff']}
						refreshing={loading}
						onRefresh={_refresh}
					/>}
					renderItem={({ item }) =>
						<Card
							//mode='contained'
							style={{
								padding: 8,
								margin: 5,
								backgroundColor: item.new == 1 ? '#ffffe1' : item.ori === 'Internet' ? '#def7da' : 'white'
							}}
							onPress={() => navigation.navigate('SalesDetail', item)}
						>
							<Card.Title
								title={`${transform(item.num, 'XX/######')}`}
								//title={item.num}
								titleStyle={styles.salesNumber}
								subtitle={item.cliraz}
								subtitleStyle={styles.clientName}
								right={(props) =>
									<Text style={styles.valueText}>{formatCurrency(item.tot)}</Text>
								}
							/>
							{
								item.new == 1 &&
								<Card.Actions>
									<Button onPress={() => {
										setDelPev(item.num)
										setVisible(true)
									}}>Excluir</Button>
								</Card.Actions>
							}
						</Card>
					}
				/>
				<ConfirmDialog />
				<FAB
					style={styles.fab}
					icon="plus"
					onPress={() => AddPev()}
				/>
			</View>
		</>
	)
}

export default Sales
