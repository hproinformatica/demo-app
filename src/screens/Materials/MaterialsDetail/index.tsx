import { Block } from '@hproinformatica/react-native'
import React from 'react'
import { Dimensions, ScrollView, StyleSheet } from 'react-native'
import { Appbar, useTheme } from 'react-native-paper'
import { formatValue } from '@hproinformatica/functions'

const MaterialsDetail = ({ navigation, route }: HPro.Props<HPro.MaterialsStack, 'MaterialsDetail'>) => {

	const item = route.params

	const { colors } = useTheme()
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			height: Dimensions.get('window').height - 80,
		},
	})

	return (
		<>
			<Appbar.Header>
				<Appbar.Action
					color={colors.accent}
					icon={'arrow-left'}
					onPress={() => navigation.goBack()} />
				<Appbar.Content
					color={colors.accent}
					title="Detalhes do material" />
			</Appbar.Header>
			<ScrollView
				style={{ flex: 1, padding: 10 }}

			>
				<Block.Info
					data={[
						{ description: item.cod ? item.cod.toString() : '', title: 'Código' },
						{ description: item.des, title: 'Descrição' },
						{ description: item.uni, title: 'Unidade' },
						{ description: item.ref, title: 'Referência' }
					]}
					title={'Informações cadastrais'}
				/>
				<Block.Info
					data={[
						{ description: item.est ? formatValue(item.est) : '0,00', title: 'Saldo disponível' },
					]}
					title={'Estoque'}
				/>
			</ScrollView>
		</>
	)
}

export default MaterialsDetail
