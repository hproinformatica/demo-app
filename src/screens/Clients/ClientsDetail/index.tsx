import { DrawerActions } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Dimensions, StyleSheet, ScrollView } from 'react-native'
import { Appbar, useTheme } from 'react-native-paper'
import { Block } from '@hproinformatica/react-native'

const ClientsDetail = ({ navigation, route }: HPro.Props<HPro.ClientsStack, 'ClientsDetail'>) => {

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
					title="Detalhes do cliente" />
			</Appbar.Header>
			<ScrollView
				style={{ flex: 1, padding: 10 }}

			>
				<Block.Info
					data={[
						{ description: item.cod ? item.cod.toString() : '', title: 'Código' },
						{ description: item.raz, title: 'Razão social' },
						{ description: item.fan, title: 'Nome fantasia' },
						{ description: item.cpx, title: 'CPF/CPJ' }
					]}
					title={'Informações cadastrais'}
				/>
				<Block.Info
					data={[
						{ description: item.end, title: 'Endereço' },
						{ description: item.nue, title: 'Número' },
						{ description: item.coe, title: 'Complemento' },
						{ description: item.bai, title: 'Bairro' },
						{ description: item.cep, title: 'CEP' },
						{ description: `${item.cid}/${item.est}`, title: 'Cidade/UF' }
					]}
					title={'Endereço'}
				/>
				<Block.Info
					data={[
						{ description: item.tel, title: 'Telefone' },
						{ description: item.cel, title: 'Celular' }
					]}
					title={'Contato'}
				/>
			</ScrollView>
		</>
	)
}

export default ClientsDetail
