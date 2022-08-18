import { Block } from '@hproinformatica/react-native'
import React from 'react'
import { Dimensions, ScrollView, StyleSheet } from 'react-native'
import { Appbar, useTheme } from 'react-native-paper'

const PriceDetail = ({ navigation, route }: HPro.Props<HPro.PriceStack, 'PriceDetail'>) => {

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
					title="Detalhes da tabela de preço" />
			</Appbar.Header>
			<ScrollView
				style={{ flex: 1, padding: 10 }}

			>
				<Block.Info
					data={[
						{ description: item.cod ? item.cod.toString() : '', title: 'Código' },
						{ description: item.des, title: 'Descrição' },
						{ description: item.est, title: 'Estados' },
					]}
					title={'Cadastro'}
				/>
			</ScrollView>
		</>
	)
}

export default PriceDetail
