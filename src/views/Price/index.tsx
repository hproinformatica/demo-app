/* Dependencies */
import React, { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'

/* Libraries */
import { executeSqlAsync, Loader } from '@hproinformatica/react-native'
import { Searchbar, useTheme } from 'react-native-paper'

/* Components */
import PriceList from './PriceList'

const PriceView = ({ navigation, route }: HPro.Props<HPro.SalesStack, 'PriceView'>) => {
	const params = route.params

	/* Styles */
	const { colors } = useTheme()
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			padding: 10
		},
		searchbar: {
			backgroundColor: colors.background,
			margin: 4
		}
	})

	/* States */
	const [loading, setLoading] = useState<boolean>(true)
	const [search, setSearch] = useState<string>('')
	const [list, setList] = useState<HPro.priceType[]>([])
	const [filteredList, setFilteredList] = useState<HPro.priceType[]>([])

	/* Hooks */
	useEffect(() => {
		const getInfos = () => {
			executeSqlAsync(`select * from htab`)
				.then(({ rows }) => {
					setList(rows._array)
					setFilteredList(rows._array)
				})
				.finally(() => setLoading(false))
		}

		getInfos()
	}, [navigation])

	/* Functions */
	const _onSearchbarChangeText = (text) => {
		setSearch(text)

		const newList = list.filter((item) => {
			const upperCaseText = text.toUpperCase()

			if (item.cod.toString().includes(upperCaseText)) { return true }
			if (item.des.toUpperCase().includes(upperCaseText)) { return true }

			return false
		})

		setFilteredList(newList)
	}

	return (<SafeAreaView style={styles.container}>
		<Loader.Circle visible={loading} />
		<Searchbar
			icon={{
				direction: 'auto',
				source: 'arrow-left'
			}}
			onChangeText={text => _onSearchbarChangeText(text)}
			onIconPress={() => navigation.goBack()}
			placeholder={'Buscar'}
			placeholderTextColor={colors.text}
			style={styles.searchbar}
			value={search}
		/>
		<PriceList
			listInfo={filteredList}
			navigation={navigation}
			params={params} />
	</SafeAreaView>)
}

export default PriceView
