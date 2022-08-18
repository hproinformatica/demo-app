import { executeSqlAsync } from '@hproinformatica/react-native'
import { DrawerActions } from '@react-navigation/native'
import { setParams } from '@react-navigation/routers/lib/typescript/src/CommonActions'
import React, { useEffect, useState } from 'react'
import { Dimensions, FlatList, RefreshControl, StyleSheet, View } from 'react-native'
import { Appbar, Divider, Searchbar, useTheme } from 'react-native-paper'
import CondElement from '../../components/CondElement'
import AppStorage from '../../storage/AppStorage'

const Cond = ({ navigation }: HPro.Props<HPro.CondStack, 'Cond'>) => {

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
	const [cond, setCond] = useState<number>(0)
	const [search, setSearch] = useState<string>('')
	const [list, setList] = useState<HPro.condType[]>([])
	const [filtered, setFiltered] = useState<HPro.condType[]>([])

	useEffect(() => {
		AppStorage.loadParamsInfo()
			.then((params) => {
				setCond(params.cpaesp)
			})
	}, [])

	useEffect(() => {
		const refresh = navigation.addListener('focus', () => {
			_refresh()
		})
		return refresh
	}, [navigation])

	const _refresh = () => {
		setLoading(true)
		executeSqlAsync('select * from hcpa ')
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

			if (item.des.toUpperCase().includes(upperCaseText)) { return true }

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
					title="Condições de pagamento" />
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
					data={filtered.sort((a, b) => a.des.localeCompare(b.des))}
					ItemSeparatorComponent={() => <Divider />}
					keyExtractor={(item) => item.cod.toString()}
					refreshControl={<RefreshControl
						progressBackgroundColor={colors.primary}
						colors={['#fff']}
						refreshing={loading}
						onRefresh={_refresh}
					/>}
					renderItem={({ item }) =>
						<CondElement
							onClick={() => navigation.navigate('CondDetail', item)}
							cond={item}
							special={item.cod == cond}
						/>
					}
				/>
			</View>
		</>
	)
}

export default Cond
