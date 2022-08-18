/* Dependencies */
import React, { useContext } from 'react'
import appContext from '../../context'
import { FlatList } from 'react-native'

/* Libraries */
import { Divider } from 'react-native-paper'

/* Components */
import RepresentativeElement from '../../components/RepresentativeElement'

const RepresentativesList = ({ listInfo, navigation, params }) => {

	const { setRepContext } = useContext(appContext)

	/* Functions */
	const Ajust = (cliInfo) => {
		setRepContext(`${cliInfo.cod} - ${cliInfo.raz}`)
		navigation.goBack()
	}

	return (<FlatList
		data={listInfo}
		ItemSeparatorComponent={() => <Divider />}
		keyExtractor={(item) => item.cod.toString()}
		renderItem={({ item }) =>
			<RepresentativeElement
				rep={item}
				onClick={() => Ajust(item)}
			/>
		} />)
}

export default RepresentativesList
