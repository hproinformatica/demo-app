/* Dependencies */
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

/* Libraries */
import { TouchableRipple, useTheme } from 'react-native-paper'
import { formatValue } from '@hproinformatica/functions'

const MaterialElement = ({ material, onClick }: {
	material: HPro.materialType
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
					{material.cod}. {material.des}
				</Text>
				<Text style={styles.subtitle}>
					{material.uni}
				</Text>
				<Text style={styles.subtitle}>
					{material.ref}
				</Text>
				<Text style={styles.subtitle}>
					Quantidade em estoque: {formatValue(material.est)}
				</Text>
			</View>
		</TouchableRipple>
	)
}

export default MaterialElement
