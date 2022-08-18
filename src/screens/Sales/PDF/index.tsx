/* Dependencies */
import React from 'react'
import { StyleSheet, View } from 'react-native'

/* Libraries */
import * as Sharing from 'expo-sharing'
import { Appbar, useTheme } from 'react-native-paper'
import PDFReader from 'rn-pdf-reader-js'

const PDF = ({ navigation, route }: HPro.Props<HPro.SalesStack, 'PDF'>) => {

	const { fileName } = route.params

	/* Styles */
	const { colors } = useTheme()
	const styles = StyleSheet.create({
		wrapper: {
			flex: 1
		}
	})

	return (<View style={styles.wrapper}>
		<Appbar.Header>
			<Appbar.Action
				color={colors.accent}
				icon={'arrow-left'}
				onPress={() => navigation.goBack()} />
			<Appbar.Content
				color={colors.accent}
				title={'Visualizar PDF'} />
			<Appbar.Action
				color={colors.accent}
				icon={'upload'}
				onPress={() => Sharing.shareAsync(fileName)} />
		</Appbar.Header>
		{fileName &&
			<PDFReader
				source={{
					uri: fileName
				}}
				withPinchZoom
				withScroll
			/>}
	</View>)
}

export default PDF
