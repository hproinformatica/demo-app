/* Dependencies */
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

/* Libraries */
import { TouchableRipple, useTheme } from 'react-native-paper'

const ClientElement = ({ client, onClick }: {
	client: HPro.clientType
	onClick: () => void
}) => {

	/* Styles */
	const { colors } = useTheme()
	const styles = StyleSheet.create({
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

	return (
		<TouchableRipple
			onPress={() => onClick && onClick()}
			style={{ padding: 8 }}
		>
			<View style={styles.element}>
				<Text style={styles.title}>
					{client.raz}
				</Text>
				<Text style={styles.subtitle}>
					{client.fan}
				</Text>
				<Text style={styles.subtitle}>
					{`${client.cid}, ${client.est}`}
				</Text>
			</View>
		</TouchableRipple>
	)
}

export default ClientElement
