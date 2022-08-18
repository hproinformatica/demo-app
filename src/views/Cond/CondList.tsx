/* Dependencies */
import React, { useState, useEffect, useContext } from 'react'
import appContext from '../../context'
import { FlatList } from 'react-native'

/* Libraries */
import { Divider } from 'react-native-paper'
import AppStorage from '../../storage/AppStorage'

/* Components */
import CondElement from '../../components/CondElement'

const CondList = ({ listInfo, navigation, params }) => {

	const [cond, setCond] = useState<number>(0)

	const { setCpaContext } = useContext(appContext)

	/* Functions */
	const Ajust = (cpaInfo) => {
		setCpaContext(`${cpaInfo.cod} - ${cpaInfo.des}`)
		navigation.goBack()
	}

	useEffect(() => {
		AppStorage.loadParamsInfo()
			.then((params) => {
				setCond(params.cpaesp)
			})
	}, [])

	return (<FlatList
		data={listInfo}
		ItemSeparatorComponent={() => <Divider />}
		keyExtractor={(item) => item.cod.toString()}
		renderItem={({ item }) =>
			<CondElement
				cond={item}
				onClick={() => Ajust(item)}
				special={item.cod == cond}
			/>
		} />)
}

export default CondList
