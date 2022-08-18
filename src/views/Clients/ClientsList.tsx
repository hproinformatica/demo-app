/* Dependencies */
import React, { useContext } from 'react'
import appContext from '../../context'
import { FlatList } from 'react-native'

/* Libraries */
import { Divider } from 'react-native-paper'

/* Components */
import ClientElement from '../../components/ClientElement'

const ClientsList = ({ listInfo, navigation, params }) => {

	const { setCliContext, setRepContext } = useContext(appContext)

	/* Functions */
	const Ajust = (cliInfo) => {
		if (!params.root) {
			setCliContext(`${cliInfo.cod} - ${cliInfo.raz}`)
		} else {
			setRepContext(`${cliInfo.cod} - ${cliInfo.raz}`)
		}
		navigation.goBack()
	}

	return (<FlatList
		data={listInfo}
		ItemSeparatorComponent={() => <Divider />}
		keyExtractor={(item) => item.cod.toString()}
		renderItem={({ item }) =>
			<ClientElement
				client={item}
				onClick={() => Ajust(item)}
			/>
		} />)
}

export default ClientsList
