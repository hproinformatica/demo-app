/* Dependencies */
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

/* Libraries */
import { TouchableRipple, useTheme } from 'react-native-paper'

const CondElement = ({ cond, onClick, special }: {
	cond: HPro.condType
	onClick: () => void
	special: boolean
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
			style={{ padding: 8, backgroundColor: special ? '#def7da' : 'white' }}
		>
			<View style={styles.element}>
				<Text style={styles.title}>
					{cond.des}
				</Text>
			</View>
		</TouchableRipple>
	)
}

export default CondElement
