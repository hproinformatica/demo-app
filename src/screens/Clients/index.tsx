import { DrawerActions } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Dimensions, FlatList, RefreshControl, Keyboard } from 'react-native'
import { Appbar, useTheme, Divider, TouchableRipple, Searchbar } from 'react-native-paper'
import ClientElement from '../../components/ClientElement'
import { delayedAlert, executeSqlAsync } from '@hproinformatica/react-native'

const Clients = ({ navigation }: HPro.Props<HPro.ClientsStack, 'Clients'>) => {

	const { colors } = useTheme()
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			height: Dimensions.get('window').height - 80,
		},
		element: {
			margin: 8,
		},
		title: {
			fontSize: 16,
			fontWeight: 'bold',
		},
		subtitle: {
			fontSize: 14,
			color: 'rgba(0, 0, 0, 0.60)',
		},
	})

	const [loading, setLoading] = useState<boolean>(false)
	const [search, setSearch] = useState<string>('')
	const [list, setList] = useState<HPro.clientType[]>([])
	const [filtered, setFiltered] = useState<HPro.clientType[]>([])

	useEffect(() => {
		const refresh = navigation.addListener('focus', () => {
			_refresh()
		})
		return refresh
	}, [navigation])

	const _refresh = () => {
		setLoading(true)
		executeSqlAsync('select * from hcli ')
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

			if (item.cod.toString().includes(upperCaseText)) { return true }
			if (item.raz.toUpperCase().includes(upperCaseText)) { return true }
			if (item.est.toUpperCase().includes(upperCaseText)) { return true }
			if (item.cid.toUpperCase().includes(upperCaseText)) { return true }

			return false
		})

		setFiltered(newList)
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
					title="Clientes" />
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
					data={filtered.sort((a, b) => a.raz.localeCompare(b.raz))}
					ItemSeparatorComponent={() => <Divider />}
					keyExtractor={(item) => item.cod.toString()}
					refreshControl={<RefreshControl
						progressBackgroundColor={colors.primary}
						colors={['#fff']}
						refreshing={loading}
						onRefresh={_refresh}
					/>}
					renderItem={({ item }) =>
						<ClientElement
							client={item}
							onClick={() => navigation.navigate('ClientsDetail', item)}
						/>
					}
				/>
			</View>
		</>
	)
}

export default Clients
