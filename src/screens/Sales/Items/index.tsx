import { formatCurrency, formatValue, transform } from '@hproinformatica/functions'
import { delayedAlert, executeSqlAsync, backendRequest } from '@hproinformatica/react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import { Appbar, Button, Card, Dialog, FAB, useTheme } from 'react-native-paper'
import HPro from '../../../@types'
import AppStorage from '../../../storage/AppStorage'

const Items = ({ navigation, route }: HPro.Props<HPro.SalesStack, 'Items'>) => {

	const pev = route.params

	const { colors } = useTheme()
	const styles = StyleSheet.create({
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
			marginRight: 5,
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
	const [list, setList] = useState<HPro.salesItemType[]>([])
	const [delIve, setDelIve] = useState<HPro.salesItemType>(undefined)

	useEffect(() => {
		const refresh = navigation.addListener('focus', () => {
			_refresh()
		})
		return refresh
	}, [navigation])

	const _refresh = async () => {
		setLoading(true)
		if (pev.new == 2) {
			await AppStorage.loadUserInfo()
				.then(async (user) => {
					await backendRequest('liberationItems', { cod: user.cod, emp: user.empcod, num: pev.num })
						.then((content) => {
							setList(content.hive)
						})
				})
				.catch((error) => delayedAlert('Atenção', error.message))
				.finally(() => setLoading(false))
		} else {
			executeSqlAsync('select * from hive where num=?', [pev.num])
				.then(({ rows }) => {
					setList(rows._array)
				})
				.finally(() => setLoading(false))
		}
	}

	const AddIve = () => {
		navigation.navigate('ItemsDetail', { pev })
	}

	const ConfirmDialog = () => {
		return (
			<Dialog visible={visible} onDismiss={() => setVisible(false)}>
				<Dialog.Title>Atenção</Dialog.Title>
				<Dialog.Content>
					<Text>Deseja realmente excluir o item selecionado?</Text>
				</Dialog.Content>
				<Dialog.Actions>
					<Button onPress={() => deleteIve(delIve)}>Sim</Button>
					<Button onPress={() => setVisible(false)}>Não</Button>
				</Dialog.Actions>
			</Dialog>
		)
	}

	const deleteIve = async (item: salesItemType) => {
		setLoading(true)
		await executeSqlAsync('delete from hive where num=? and seq=?', [pev.num, item.seq])
			.then(async () => {
				await executeSqlAsync('select sum(tot) as totpev from hive where num=?', [pev.num])
					.then(async ({ rows }) => {
						await executeSqlAsync('update hpev set tot=? where num=?', [rows._array[0].totpev, pev.num])
							.then(() => {
								_refresh()
								setVisible(false)
							})
					})
			})
			.catch((error) => delayedAlert('Atenção', error.message))
			.finally(() => setLoading(false))
	}

	return (
		<>
			<Appbar.Header>
				<Appbar.Action
					color={colors.accent}
					icon={'arrow-left'}
					onPress={() => navigation.goBack()} />
				<Appbar.Content
					color={colors.accent}
					title="Itens da venda"
					subtitle={`Nº Pedido: ${transform(pev.num, 'XX/######')}`} />
			</Appbar.Header>
			<View style={{ flex: 1 }} >
				<FlatList
					data={list.sort((a, b) => a.des.localeCompare(b.des))}
					//ItemSeparatorComponent={() => <Divider />}
					ListFooterComponent={() => <View style={{ height: 80 }} />}
					keyExtractor={(item) => item.seq}
					refreshControl={<RefreshControl
						progressBackgroundColor={colors.primary}
						colors={['#fff']}
						refreshing={loading}
						onRefresh={_refresh}
					/>}
					renderItem={({ item }) =>
						<Card
							onPress={() => navigation.navigate('ItemsDetail', { ive: item, pev: pev, matcod: item.mat })}
							style={{ padding: 8, margin: 5 }}
						>
							<Card.Title
								title={`${item.mat}. ${item.des}`}
								titleStyle={styles.salesNumber}
								subtitle={`Quantidade: ${formatValue(item.qtd, 2)}`}
								subtitleStyle={styles.clientName}
								right={(props) =>
									<Text style={styles.valueText}>{formatCurrency(item.tot)}</Text>
								}
							/>
							{
								pev.new == 1 &&
								<Card.Actions>
									<Button onPress={() => {
										setDelIve(item)
										setVisible(true)
									}}>Excluir</Button>
								</Card.Actions>
							}
						</Card>
					}
				/>
				{
					pev.new == 1 &&
					<FAB
						style={styles.fab}
						icon="plus"
						onPress={() => AddIve()}
					/>
				}
				<ConfirmDialog />
			</View>
		</>
	)
}

export default Items
