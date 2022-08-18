import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, ScrollView } from 'react-native'
import { Appbar, useTheme, Card, Button, FAB, Dialog } from 'react-native-paper'
import { transform, dtoc, toDate } from '@hproinformatica/functions'
import { Picker, delayedAlert, executeSqlAsync, Loader } from '@hproinformatica/react-native'

const Dates = ({ navigation, route }: HPro.Props<HPro.SalesStack, 'Dates'>) => {

	const pev = route.params

	const { colors } = useTheme()
	const styles = StyleSheet.create({
		title: {
			fontSize: 16,
			fontWeight: '500',
		},
		subtitle: {
			color: 'rgba(0, 0, 0, 0.60)',
			fontSize: 14,
		},
		fab: {
			position: 'absolute',
			right: 16,
			bottom: 32,
			backgroundColor: colors.primary,
		},
	})

	const [loading, setLoading] = useState<boolean>(false)
	const [visible, setVisible] = useState<boolean>(false)
	const [changed, setChanged] = useState<boolean>(false)
	const [confirm, setConfirm] = useState<boolean>(false)
	const [date, setDate] = useState<string>(dtoc())
	const [dates, setDates] = useState<string[]>([])

	useEffect(() => {
		if (pev.vce) {
			setDates(pev.vce.split(';'))
		}
	}, [])

	const addDate = (dt) => {

		setChanged(true)

		let lastDate = ''

		if (dates.length) {
			if (dates.length >= 12) {
				delayedAlert('Atenção', 'O máximo é de 12 pagamentos')
				return
			}
			lastDate = dates[dates.length - 1]
		}

		if (lastDate && (toDate(dt.split('/').reverse().join('-')) <= toDate(lastDate.split('/').reverse().join('-')))) {
			delayedAlert('Atenção', 'Não é possível selecionar uma data menor ou igual a última selecionada')
			return
		}

		// Verifica se é sábado ou domingo, se for joga para segunda
		let dAux = toDate(dt.split('/').reverse().join('-'))

		const nAux = dAux.getDay()
		if (nAux == 5) {
			dAux.setDate(dAux.getDate() + 2)
		} else if (nAux == 6) {
			dAux.setDate(dAux.getDate() + 1)
		}

		dAux.setDate(dAux.getDate() + 1)
		setDates(prev => prev.concat(dtoc(dAux)))
	}

	const postPev = async () => {
		if (dates) {
			setLoading(true)
			await executeSqlAsync('update hpev set vce=? where num=?', [dates.join(';'), pev.num])
				.then(() => {
					navigation.goBack()
				})
				.finally(() => setLoading(false))
		} else {
			navigation.goBack()
		}
	}

	const checkGoBack = () => {
		if (!changed) {
			navigation.goBack()
		} else {
			setConfirm(true)
		}
	}

	const ConfirmDialog = () => {
		return (
			<Dialog visible={confirm} onDismiss={() => setConfirm(false)}>
				<Dialog.Title>Atenção</Dialog.Title>
				<Dialog.Content>
					<Text>As alterações feitas serão perdidas! Deseja realmente voltar?</Text>
				</Dialog.Content>
				<Dialog.Actions>
					<Button onPress={() => navigation.goBack()}>Sim</Button>
					<Button onPress={() => setConfirm(false)}>Não</Button>
				</Dialog.Actions>
			</Dialog>
		)
	}

	return (
		<>
			<Appbar.Header>
				<Appbar.Action
					color={colors.accent}
					icon={'arrow-left'}
					onPress={() => checkGoBack()} />
				<Appbar.Content
					color={colors.accent}
					title="Datas para pagamento"
					subtitle={`Nº Pedido: ${transform(pev.num, 'XX/######')}`} />
				{
					pev.new == 1 &&
					<Appbar.Action
						color={colors.accent}
						icon={'check'}
						onPress={() => postPev()} />
				}

			</Appbar.Header>
			<Loader.Circle visible={loading} />
			<View style={{ position: 'absolute', top: -200 }}>
				<Picker.Date
					visible={visible}
					setVisible={setVisible}
					selectedDate={date}
					setSelectedDate={setDate}
					onConfirm={(dt) => addDate(dt)}
				/>
			</View>
			<ScrollView>
				{
					dates.map((item, idx) => {
						return (
							<Card
								style={{ padding: 8, margin: 5 }}
								key={idx}
							>
								<Card.Title
									title={item}
									titleStyle={styles.title}
									subtitle={`Data do ${idx + 1}º pagamento`}
									subtitleStyle={styles.subtitle}
								/>
								{
									pev.new == 1 &&
									<Card.Actions>
										<Button onPress={() => {
											setDates(prev => prev.filter(x => x !== item))
											setChanged(true)
										}}>Excluir</Button>
									</Card.Actions>
								}

							</Card>
						)
					})
				}
			</ScrollView>
			{
				pev.new == 1 &&
				<FAB
					style={styles.fab}
					icon="plus"
					onPress={() => setVisible(true)}
				/>
			}
			<ConfirmDialog />
		</>
	)
}

export default Dates
