/* Dependencies */
import React, { useContext } from 'react'
import appContext from '../../context'
import { FlatList } from 'react-native'

/* Libraries */
import { Divider } from 'react-native-paper'

/* Components */
import MaterialElement from '../../components/MaterialElement'

const MaterialsList = ({ listInfo, navigation, params }) => {

	const { setMatContext } = useContext(appContext)

	/* Functions */
	const Ajust = (matInfo) => {
		setMatContext(`${matInfo.cod} - ${matInfo.des}`)
		//navigation.goBack()
		navigation.navigate('ItemsDetail', { matcod: matInfo.cod })
	}

	return (<FlatList
		data={listInfo}
		ItemSeparatorComponent={() => <Divider />}
		keyExtractor={(item) => item.cod.toString()}
		renderItem={({ item }) =>
			<MaterialElement
				material={item}
				onClick={() => Ajust(item)}
			/>
		} />)
}

export default MaterialsList
