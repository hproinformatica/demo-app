/* Dependencies */
import React, { useContext } from 'react'
import appContext from '../../context'
import { FlatList } from 'react-native'

/* Libraries */
import { Divider } from 'react-native-paper'

/* Components */
import PriceElement from '../../components/PriceElement'

const PriceList = ({ listInfo, navigation, params }) => {

	const { setTabContext } = useContext(appContext)

	/* Functions */
	const Ajust = (tabInfo) => {
		setTabContext(`${tabInfo.cod} - ${tabInfo.des}`)
		navigation.goBack()
	}

	return (<FlatList
		data={listInfo}
		ItemSeparatorComponent={() => <Divider />}
		keyExtractor={(item) => item.cod.toString()}
		renderItem={({ item }) =>
			<PriceElement
				price={item}
				onClick={() => Ajust(item)}
			/>
		} />)
}

export default PriceList
