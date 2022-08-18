/* Dependencies */
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

/* Libraries */
import { TouchableRipple, useTheme } from 'react-native-paper'

const RepresentativeElement = ({ rep, onClick }: {
	rep: HPro.representativeType
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
					{rep.cod} - {rep.raz}
				</Text>
			</View>
		</TouchableRipple>
	)
}

export default RepresentativeElement
