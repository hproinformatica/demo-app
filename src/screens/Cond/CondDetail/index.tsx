import { Block } from '@hproinformatica/react-native'
import React from 'react'
import { Dimensions, ScrollView, StyleSheet } from 'react-native'
import { Appbar, useTheme } from 'react-native-paper'

const CondDetail = ({ navigation, route }: HPro.Props<HPro.CondStack, 'CondDetail'>) => {

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
					title="Detalhes da cond. pagamento" />
			</Appbar.Header>
			<ScrollView
				style={{ flex: 1, padding: 10 }}

			>
				<Block.Info
					data={[
						{ description: item.cod ? item.cod.toString() : '', title: 'Código' },
						{ description: item.des, title: 'Descrição' },
						{ description: item.num ? item.num.toString() : '', title: 'Nº de parcelas' },
					]}
					title={'Cadastro'}
				/>
				<Block.Info
					data={[
						{ description: item.d01 ? item.d01.toString() : '', title: '1.' },
						{ description: item.d02 ? item.d02.toString() : '', title: '2.' },
						{ description: item.d03 ? item.d03.toString() : '', title: '3.' },
						{ description: item.d04 ? item.d04.toString() : '', title: '4.' },
						{ description: item.d05 ? item.d05.toString() : '', title: '5.' },
						{ description: item.d06 ? item.d06.toString() : '', title: '6.' },
						{ description: item.d07 ? item.d07.toString() : '', title: '7.' },
						{ description: item.d08 ? item.d08.toString() : '', title: '8.' },
						{ description: item.d09 ? item.d09.toString() : '', title: '9.' },
						{ description: item.d10 ? item.d10.toString() : '', title: '10.' },
						{ description: item.d11 ? item.d11.toString() : '', title: '11.' },
						{ description: item.d12 ? item.d12.toString() : '', title: '12.' },
					]}
					title={'Nº de dias dos pagamentos'}
				/>
			</ScrollView>
		</>
	)
}

export default CondDetail
